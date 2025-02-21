from fastapi import FastAPI, Form, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from transformers import pipeline
import pdfplumber
import io

app = FastAPI()

# Allow CORS so our Next.js frontend can communicate with the backend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy OAuth2 setup (using a dummy token for simplicity)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Dummy password hashing
def fake_hash_password(password: str) -> str:
    return "hashed_" + password

# In-memory users "database"
users_db = {}

# -------------------------------------------
# Register Endpoint (expects form data)
# -------------------------------------------
@app.post("/register")
async def register(email: str = Form(...), password: str = Form(...)):
    if email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[email] = {"email": email, "hashed_password": fake_hash_password(password)}
    return {"message": "User registered successfully", "email": email}

# -------------------------------------------
# Login Endpoint using OAuth2PasswordRequestForm
# -------------------------------------------
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or user["hashed_password"] != fake_hash_password(form_data.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    # In production, return a JWT token; here we return a dummy token.
    return {"access_token": "dummy-token", "token_type": "bearer"}

# -------------------------------------------
# Load Hugging Face models (cache them in memory)
# -------------------------------------------
resume_summarizer = pipeline("summarization", model="t5-small")
cover_letter_generator = pipeline("text-generation", model="gpt2")

def extract_text_from_pdf(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        pages = [page.extract_text() for page in pdf.pages if page.extract_text()]
    return "\n".join(pages)

# -------------------------------------------
# Analyze Resume Endpoint (expects a PDF file)
# -------------------------------------------
@app.post("/analyze-resume/")
async def analyze_resume(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    file_bytes = await file.read()
    resume_text = extract_text_from_pdf(file_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="No text found in the resume file")
    # Generate summary/suggestions
    summary = resume_summarizer(resume_text, max_length=150, min_length=50, do_sample=False)
    # Generate a cover letter using a simple prompt
    prompt = f"Write a cover letter based on the following resume:\n{resume_text}\nCover Letter:"
    cover_letter = cover_letter_generator(prompt, max_new_tokens=100, do_sample=True)
    return {
        "resume_summary": summary[0]["summary_text"],
        "cover_letter": cover_letter[0]["generated_text"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
