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
     image_url: "",
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
 
   function handleChange(e) {
     const { name, value } = e.target;
     setForm((f) => ({ ...f, [name]: value }));
   }
 
   async function handleSubmit(e) {
     e.preventDefault();
     setError("");
     setLoading(true);
     try {
       const payload = {
         title: form.title,
         price: Number(form.price),
         stock: Number(form.stock),
         description: form.description,
         image_url: form.image_url,
       };
       await createSellerProduct(payload);
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
           <form onSubmit={handleSubmit}>
             <CardContent className="space-y-4">
               {error && <div className="text-red-600">{error}</div>}
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Title</label>
                 <Input name="title" value={form.title} onChange={handleChange} required />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Price</label>
                   <Input type="number" name="price" value={form.price} onChange={handleChange} required />
                 </div>
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Stock</label>
                   <Input type="number" name="stock" value={form.stock} onChange={handleChange} required />
                 </div>
               </div>
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Image URL</label>
                 <Input name="image_url" value={form.image_url} onChange={handleChange} />
               </div>
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Description</label>
                 <textarea
                   name="description"
                   className="w-full h-24 rounded-md border bg-transparent px-3 py-2 text-sm"
                   value={form.description}
                   onChange={handleChange}
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
