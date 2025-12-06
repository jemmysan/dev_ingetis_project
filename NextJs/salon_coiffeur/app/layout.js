import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Salon de coiffure",
  description: "Le meilleur salon de coiffure de Paris",
};

export default function RootLayout({ children }) {
  return (
 <html lang="fr">
  <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-screen flex flex-col overflow-hidden">

    <Navbar />

    {/* Zone qui ne doit JAMAIS dépasser */}
    <main className="flex-1 overflow-y-auto overflow-x-hidden">
      {children}
    </main>

    <Footer />

  </body>
</html>


  );
}
