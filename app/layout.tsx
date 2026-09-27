import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = { title: 'Money Dashboard', description: 'Revenue streams in one place' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
