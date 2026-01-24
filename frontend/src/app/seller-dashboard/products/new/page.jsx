"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSellerProduct } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files?.[0];
      setForm((f) => ({ ...f, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock));
      formData.append("description", form.description);
      formData.append("category", form.category || "General");
      if (form.image) {
        formData.append("image", form.image);
      }

      await createSellerProduct(formData);
      router.push("/seller-dashboard/products");
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl px-1 py-2">
      <Card className="bg-white border-0 shadow-lg animate-slide-up">
        <CardHeader>
          <CardTitle className="text-gray-900">Add New Product</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <CardContent className="space-y-4">
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Title</label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Price</label>
                <Input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Stock</label>
                <Input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" required />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Category</label>
                <Input name="category" value={form.category} onChange={handleChange} placeholder="e.g., Electronics" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Product Image</label>
              <Input type="file" name="image" onChange={handleChange} accept="image/*" />
              {preview && (
                <div className="mt-2 w-32 h-32 bg-gray-100 rounded overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Description</label>
              <textarea
                name="description"
                className="w-full h-24 rounded-md border bg-transparent px-3 py-2 text-sm"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
