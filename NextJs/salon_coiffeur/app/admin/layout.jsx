"use client";
import { useState } from "react";
import { X } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Sidebar } from "@/components/SideBar";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full w-full bg-gray-100">

      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar mobile */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white  text-gray-900 pt-6 z-50 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 md:hidden`}>
        <button
          className="absolute top-4 right-4 text-gray-900"
          onClick={() => setOpen(false)}
        >
          <X size={28} />
        </button>
        <Sidebar mobile />
      </div>

      {/* Contenu */}
      <main className="flex-1  p-6 relative">
        {/* Bouton hamburger mobile */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden absolute top-4 left-4 text-gray-900"
        >
          <Menu size={28} />
        </button>

        {children}
      </main>
    </div>
  );
}
