"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { api } from "@/lib/api"

type Props = {
  id: number
  name: string
  price: number
  description?: string | null
}

export default function ProductItem({ id, name, price, description }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onDelete() {
    const ok = confirm(`Delete "${name}"?`)
    if (!ok) return
    try {
      setLoading(true)
      setErr(null)
      await api.deleteProduct(id)
      router.refresh() // server component'i yeniden getir
    } catch (e: any) {
      setErr(e?.message ?? "Failed to delete")
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {name}
          </h3>
          {description && <p className="mt-1 truncate text-sm text-gray-600 leading-relaxed">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900 font-mono tracking-tight">{Number(price).toFixed(2)}</span>
            <span className="ml-1 text-sm font-medium text-gray-600">₺</span>
          </div>

          <button
            onClick={onDelete}
            disabled={loading}
            className="relative rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            title="Delete Product"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border border-red-400 border-t-transparent"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>

      {err && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700 font-medium">{err}</p>
        </div>
      )}
    </li>
  )
}
