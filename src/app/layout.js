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

            <Navbar />
            {children}
            <Footer />
            <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3000,
          }}
          containerStyle={{
            top: 80, // Navbar height + some spacing
            right: 20,
          }}
        />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}