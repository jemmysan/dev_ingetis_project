export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 ">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()}  Salon de Coiffure. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
