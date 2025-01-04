export default function PlanDetails({
  plan,
  price
}) {
  return (
    (<div
      className="bg-yellow-50 rounded-xl p-6 space-y-2 border-2 border-yellow-200">
      <h2 className="text-2xl font-semibold text-gray-800">{plan}</h2>
      <p className="text-4xl font-bold text-yellow-600">{price}</p>
      <p className="text-sm text-gray-600">per month</p>
    </div>)
  );
}

