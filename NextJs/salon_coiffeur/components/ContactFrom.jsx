// app/components/ContactForm.jsx
export default function ContactForm() {
  return (
    <form className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
      <input className="w-full p-3 border rounded-lg" placeholder="Votre nom" />
      <input className="w-full p-3 border rounded-lg" placeholder="Votre email" />
      <textarea className="w-full p-3 border rounded-lg" rows="5" placeholder="Votre message"></textarea>

      <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">
        Envoyer
      </button>
    </form>
  );
}
