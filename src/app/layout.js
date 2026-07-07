import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";

import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider> 
        <Footer/>
      </body>
    </html>
  );
}