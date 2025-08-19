export const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",

  async listProducts() {
    const res = await fetch(`${this.baseUrl}/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async getProduct(id: number) {
    const res = await fetch(`${this.baseUrl}/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  async createProduct(payload: { name: string; price: number; description?: string }) {
    const res = await fetch(`${this.baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
  },

  async updateProduct(
    id: number,
    payload: { name?: string; price?: number; description?: string }
  ) {
    const res = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  },

  async deleteProduct(id: number) {
    const res = await fetch(`${this.baseUrl}/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
  },
};
