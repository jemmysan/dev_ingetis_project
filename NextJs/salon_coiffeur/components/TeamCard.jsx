// app/components/TeamCard.jsx
export default function TeamCard({ name, role, image }) {
  return (
    <div className="text-center text-gray-200">
      <img src={image} className="w-40 h-40 object-cover rounded-full mx-auto shadow bg-gray-200" />
      <h3 className="text-xl font-bold mt-4 ">{name}</h3>
      <p className=" ">{role}</p>
    </div>
  );
}
