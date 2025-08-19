import Link from "next/link"
import { api } from "../../lib/api"
import ProductItem from "./_components/ProductItem"
import { Package, Plus, Sparkles } from "lucide-react"
import EmptyState from "@/app/products/_components/EmptyState"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const products = await api.listProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-400/20 to-blue-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-slate-600 text-sm">Manage your product inventory</p>
            </div>
          </div>

          <Link
            href="/products/new"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="transform hover:scale-[1.01] transition-transform duration-200">
                <ProductItem id={p.id} name={p.name} price={p.price} description={p.description} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState />
          </div>
        )}
      </main>
    </div>
  )
}
