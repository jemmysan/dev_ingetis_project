export default function LoginPage() {
  return (
    <div
      className="h-full flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/salon_view.webp')" }}
    >
      <div className="absolute inset-0 bg-black/40 "></div>

      <form className="h-100 relative z-10 bg-white/90 p-8 rounded-xl shadow-lg w-100 flex flex-col justify-center">
        <h2 className="text-gray-900 text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Mot de passe"
        />

        <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">
          Se connecter
        </button>
      </form>
    </div>
  );
}
