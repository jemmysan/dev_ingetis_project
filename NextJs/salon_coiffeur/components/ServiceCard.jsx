// app/components/ServiceCard.jsx
export default function ServiceCard({ title, description, image }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
      <img src={image} className="w-full h-40 object-cover rounded-lg" />
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
