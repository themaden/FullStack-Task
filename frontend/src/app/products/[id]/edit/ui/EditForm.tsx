"use client"

import { useState } from "react"
import type { Product } from "@/types/product"

type Props = {
  initialData: Product
  onSaved?: (p: Product) => void
}

export default function EditForm({ initialData, onSaved }: Props) {
  const [form, setForm] = useState({
    name: initialData.name ?? "",
    price: initialData.price ?? 0,
    description: initialData.description ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: name === "price" ? Number(value) : value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErr(null)
    try {
      // kendi API’ine göre güncelle (ör: PUT /api/products/:id)
      const res = await fetch(`/api/products/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Update failed")
      const updated = (await res.json()) as Product
      onSaved?.(updated)
    } catch (e: any) {
      setErr(e?.message ?? "Failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Price</label>
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          rows={4}
        />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  )
}
