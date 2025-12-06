"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/services", label: "Services" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "/equipes", label: "Équipe" },
    { href: "/contacts", label: "Contact" },
  ];

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold">
          Salon Élégance
        </Link>

        {/* HAMBURGER (mobile) */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

        {/* LINKS */}
        <ul className="hidden md:flex space-x-6 font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-2 py-1 transition ${
                  pathname === link.href
                    ? "border-b-2 border-white text-white"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <ul className="md:hidden bg-gray-900 px-6 pb-4 space-y-4 font-medium animate-slideDown">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                onClick={() => setOpen(false)}
                href={link.href}
                className={`block px-2 py-1 ${
                  pathname === link.href
                    ? "border-l-4 border-white text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </nav>
  );
}
