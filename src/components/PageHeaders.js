export default function PageHeaders({ h1Text, h2Text }) {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold text-black mb-2">{h1Text}</h1>
      <h2 className="text-lg text-gray-600 dark:text-gray-400">{h2Text}</h2>
    </div>
  )
}
