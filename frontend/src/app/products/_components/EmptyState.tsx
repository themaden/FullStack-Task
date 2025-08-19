import { Plus } from "lucide-react"

export default function EmptyState() {
  return (
    <li className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-110 group-hover:from-gray-200 group-hover:to-gray-100 transition-all duration-300">
        <svg
          className="h-8 w-8 text-gray-400 group-hover:text-gray-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        No products found
      </h3>

      {/* Description */}
      <p className="mb-6 text-sm text-gray-500 leading-relaxed">
        It looks a little empty here. Start by adding your first product to get
        going.
      </p>

      {/* CTA Button */}
      <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1">
        <Plus className="h-4 w-4" />
        Add Product
      </button>
    </li>
  )
}
