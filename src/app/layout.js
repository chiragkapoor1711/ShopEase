import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}