import { AuthProvider } from '@/lib/context/AuthContext';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Social Media APP',
  description: 'Welcome to the Social Media APP',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, username: true },
  });

  const defaultUser = users[0] || null;

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider initialUser={defaultUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
