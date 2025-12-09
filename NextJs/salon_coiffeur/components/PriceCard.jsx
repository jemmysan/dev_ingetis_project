// app/components/PriceCard.jsx
export default function PriceCard({ title, price, image }) {
  return (
    <div className="border rounded-xl shadow p-4 text-center bg-gray-200">
      <img src={image} className="w-full h-40 rounded-lg object-cover" />
      <h3 className="text-xl text-gray-900 font-bold mt-4">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-2">{price} €</p>
    </div>
  );
}
