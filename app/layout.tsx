import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DevSpirits — Reliable, Human-Centered Tech Solutions',
    template: '%s | DevSpirits',
  },
  description:
    'Reliable, human-centered tech solutions built to elevate your vision. Freelance developer projects with quality, integrity, and thoughtful planning.',
  keywords: [
    'freelance developer',
    'frontend development',
    'React',
    'web development',
    'tech solutions',
    'IdanLevianDeveloper',
  ],
  icons: {
    icon: '/DevSpirits_black_white.jpeg',
    apple: '/DevSpirits_black_white.jpeg',
  },
  openGraph: {
    title: 'DevSpirits — Reliable, Human-Centered Tech Solutions',
    description: 'Reliable, human-centered tech solutions built to elevate your vision.',
    images: ['/DevSpirits_black_white.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevSpirits — Reliable, Human-Centered Tech Solutions',
    description: 'Reliable, human-centered tech solutions built to elevate your vision.',
    images: ['/DevSpirits_black_white.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
