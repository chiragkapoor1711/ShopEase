import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold text-white">ShopEase</h2>

            <p className="mt-4 text-gray-400">
              Shop smart with the latest products at affordable prices. Fast
              delivery and a seamless shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-blue-400">
                  About
                </Link>
              </li>

              <li>
                <Link href="/products" className="hover:text-blue-400">
                  Products
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Ambala, Haryana, India</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@shopease.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-xl bg-white/5 hover:bg-primary hover:-translate-y-1 transition-all duration-300"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/5 hover:bg-primary hover:-translate-y-1 transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/5 hover:bg-primary hover:-translate-y-1 transition-all duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/5 hover:bg-primary hover:-translate-y-1 transition-all duration-300"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          © {new Date().getFullYear()} ShopEase. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
