import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../styles/globals.css';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Jocke',
  description: 'A modern radio streaming platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="logo">
        <Link href="/">
          <Image
            src="/favicon.png" // File from the public folder
            alt="Logo"
            width={50}  // Adjust width as needed
            height={50}  // Adjust height as needed
          />
        </Link>
        </div>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
