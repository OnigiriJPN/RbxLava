import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RbxLava STUDIO',
  description: 'Roblox Universe & Place Automated Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
