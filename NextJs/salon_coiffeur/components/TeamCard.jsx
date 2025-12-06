// app/components/TeamCard.jsx
export default function TeamCard({ name, role, image }) {
  return (
    <div className="text-center">
      <img src={image} className="w-40 h-40 object-cover rounded-full mx-auto shadow" />
      <h3 className="text-xl font-bold mt-4">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
}
