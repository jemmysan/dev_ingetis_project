import ContactForm from "@/components/ContactFrom";

export default function Contact() {
  return (
    <main
      className="relative bg-cover bg-center px-6 py-10 h-full"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}
    >
      <div
        className="absolute inset-0 
                   bg-black 
                   opacity-60" // <--- L'opacité ne s'applique qu'ici
      ></div>

      <div className="relative z-10 h-full">
        <h2 className="text-gray-200 text-3xl font-bold text-center p-2">
          Contactez-nous
        </h2>
        <ContactForm />
      </div>
    </main>
  );
}
