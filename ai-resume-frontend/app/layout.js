// app/layout.js
import '../styles/globals.css';
import Head from 'next/head';
import ClientThemeProvider from '../components/ClientThemeProvider';

export const metadata = {
  title: 'AI Resume SaaS',
  description: 'An AI powered Resume Optimizer and Cover Letter Generator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
      </Head>
      <body>
        <ClientThemeProvider>
          <header>
            <h1>AI Resume SaaS</h1>
          </header>
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()} AI Resume SaaS
          </footer>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
