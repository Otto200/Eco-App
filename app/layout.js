import './globals.css';

export const metadata = {
  title: 'BANKBUGS|FX Ecosystem',
  description: 'Premium Trading Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0E14] m-0 p-0 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
