import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Youtube, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-karate-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">ShotokanShop</h3>
            <p className="mt-2 text-sm text-white/70">
              Authentic Shotokan karate gear for practitioners worldwide. 
              Quality equipment, traditional values.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2 hover:bg-primary transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Shotokan</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="mt-2 text-sm text-white/70">
              Email: info@shotokanshop.com
            </p>
            <p className="mt-1 text-sm text-white/70">
              Dojo: Worldwide Shipping
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/50">
              <Globe className="h-4 w-4" />
              <span>Made by <a href="https://rudradavee.netlify.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">rudradavee.netlify.app</a></span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} ShotokanShop. All rights reserved. | Osu!
        </div>
      </div>
    </footer>
  );
}
