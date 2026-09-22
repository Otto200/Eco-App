// app/layout.js
import './globals.css'; // ◄ This injects Tailwind globally!

export const metadata = {
  title: 'BANKBUGS|FX Ecosystem',
  description: 'Premium Trading Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
