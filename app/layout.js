// app/layout.js
export const metadata = {
  title: 'BANKBUGS|FX Ecosystem',
  description: 'Premium Trading Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0B0E14' }}>
        {children}
      </body>
    </html>
  );
}
