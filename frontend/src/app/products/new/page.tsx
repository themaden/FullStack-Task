"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { ArrowLeft, Package, DollarSign, FileText } from "lucide-react"

type FieldErrors = Partial<{
  name: string
  price: string
  description: string
}>

const MAX_DESC = 280

export default function NewProductPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ferrs, setFerrs] = useState<FieldErrors>({})

  const nameRef = useRef<HTMLInputElement | null>(null)
  const priceRef = useRef<HTMLInputElement | null>(null)
  const descRef = useRef<HTMLTextAreaElement | null>(null)

  // TRY para formatlayıcı
  const nf = useMemo(
    () =>
      new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  )

  // Sayfadan ayrılırken taslak uyarısı (kayıt edilmediyse)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (loading) return
      const dirty = name || price !== "" || description
      if (dirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [name, price, description, loading])

  // Klavye kısayolları: Cmd/Ctrl+Enter gönder, Esc geri
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (loading) return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        const fake = new Event("submit", { bubbles: true, cancelable: true })
        formRef.current?.dispatchEvent(fake as unknown as Event)
      } else if (e.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [loading, router])

  const formRef = useRef<HTMLFormElement | null>(null)

  function validate(): boolean {
    const errors: FieldErrors = {}
    const trimmedName = name.trim()

    if (!trimmedName) {
      errors.name = "Product name is required."
    } else if (trimmedName.length < 2) {
      errors.name = "Name should be at least 2 characters."
    }

    if (price === "" || isNaN(Number(price))) {
      errors.price = "Price is required."
    } else if (Number(price) <= 0) {
      errors.price = "Price must be greater than 0."
    } else if (Number(price) > 1_000_000_000) {
      errors.price = "Price is too large."
    }

    if (description.length > MAX_DESC) {
      errors.description = `Max ${MAX_DESC} characters.`
    }

    setFerrs(errors)
    // ilk hatalı alana odaklan
    if (errors.name) nameRef.current?.focus()
    else if (errors.price) priceRef.current?.focus()
    else if (errors.description) descRef.current?.focus()

    return Object.keys(errors).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (!validate()) return

    try {
      setLoading(true)
      await api.createProduct({
        name: name.trim(),
        price: Number(price),
        description: description.trim() ? description.trim() : undefined,
      })
      router.push("/products?created=1")
      router.refresh()
    } catch (e: any) {
      // Backend'ten anlamlı mesaj gelmediyse genel hata ver
      setErr(e?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  // blur'da fiyatı 2 hane yap
  function normalizePrice() {
    if (price === "" || isNaN(Number(price))) return
    const fixed = Number(price).toFixed(2)
    setPrice(Number(fixed))
  }

  const descCount = `${description.length}/${MAX_DESC}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* arka plan efektleri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-tr from-indigo-400/20 to-blue-600/20 blur-3xl delay-1000" />
      </div>

      <main className="relative mx-auto max-w-2xl p-6">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Products</span>
          </button>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold text-transparent">
            Add New Product
          </h1>
          <p className="mx-auto max-w-md text-slate-600">
            Create a new product by filling out the information below
          </p>
        </div>

        <div
          className="relative rounded-3xl border border-white/20 bg-white/80 p-8 backdrop-blur-sm shadow-xl"
          aria-busy={loading ? "true" : "false"}
        >
          {/* loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 grid place-items-center rounded-3xl bg-white/60 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm">
                <span className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent" />
                Saving…
              </div>
            </div>
          )}

          <form ref={formRef} onSubmit={onSubmit} className="space-y-6" noValidate>
            {/* NAME */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <Package className="h-4 w-4" />
                Product Name
              </label>
              <input
                id="name"
                ref={nameRef}
                className={`w-full rounded-xl border-2 p-4 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white/50 ${
                  ferrs.name ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!ferrs.name}
                aria-describedby={ferrs.name ? "name-err" : undefined}
                maxLength={120}
                autoComplete="off"
              />
              {ferrs.name && (
                <p id="name-err" className="text-xs font-medium text-red-600">
                  {ferrs.name}
                </p>
              )}
            </div>

            {/* PRICE */}
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <DollarSign className="h-4 w-4" />
                Price
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  id="price"
                  ref={priceRef}
                  className={`w-full rounded-xl border-2 p-4 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white/50 ${
                    ferrs.price ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="0.00"
                  inputMode="decimal"
                  type="number"
                  step="0.01"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  onBlur={normalizePrice}
                  aria-invalid={!!ferrs.price}
                  aria-describedby={ferrs.price ? "price-err" : "price-help"}
                />
                {/* canlı önizleme */}
                <div className="hidden whitespace-nowrap rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 sm:block">
                  {price === "" || isNaN(Number(price)) ? "—" : nf.format(Number(price))}
                </div>
              </div>
              {ferrs.price ? (
                <p id="price-err" className="text-xs font-medium text-red-600">
                  {ferrs.price}
                </p>
              ) : (
                <p id="price-help" className="text-xs text-slate-500">
                  Use dot for decimals. Blur formats to 2 digits.
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <FileText className="h-4 w-4" />
                Description <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  ref={descRef}
                  className={`min-h-[100px] w-full resize-none rounded-xl border-2 p-4 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white/50 ${
                    ferrs.description ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                  aria-invalid={!!ferrs.description}
                  aria-describedby={ferrs.description ? "desc-err" : "desc-help"}
                />
                <span className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-slate-400">
                  {descCount}
                </span>
              </div>
              {ferrs.description ? (
                <p id="desc-err" className="text-xs font-medium text-red-600">
                  {ferrs.description}
                </p>
              ) : (
                <p id="desc-help" className="text-xs text-slate-500">
                  Up to {MAX_DESC} characters.
                </p>
              )}
            </div>

            {/* genel hata */}
            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert" aria-live="polite">
                <p className="text-sm font-medium text-red-700">{err}</p>
              </div>
            )}

            {/* actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                title="Create Product (Ctrl/Cmd+Enter)"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Product...
                  </span>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
