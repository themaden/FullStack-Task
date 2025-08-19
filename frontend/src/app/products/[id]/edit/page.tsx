import { api } from "@/lib/api"
import EditForm from "@/app/products/[id]/edit/ui/EditForm"
import { notFound } from "next/navigation"
import Link from "next/link"

type Params = { params: { id: string } }

export default async function EditProductPage({ params }: Params) {
  const id = Number(params.id)
  let product: any

  try {
    product = await api.getProduct(id)
  } catch {
    notFound()
  }

  if (!product?.id) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />

      <div className="relative z-10 p-6">
        <div className="mx-auto max-w-2xl mb-6">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-400">Edit</span>
          </nav>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
              Edit Product
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto">Update your product information and make it shine</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
            <EditForm initialData={product} />
          </div>
        </div>
      </div>
    </main>
  )
}