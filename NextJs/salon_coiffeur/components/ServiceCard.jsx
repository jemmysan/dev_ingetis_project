// app/components/ServiceCard.jsx
export default function ServiceCard({ name, description, image }) {
  return (
    <div className="bg-gray-200 shadow rounded-xl p-4 hover:shadow-lg transition">
      <img src={image} className="w-full h-40 object-cover rounded-lg" />
      <h3 className="text-xl text-gray-900 font-bold mt-4">{name}</h3>
      <p className="text-gray-900">{description}</p>
    </div>
  );
}
