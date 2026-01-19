 "use client";
 
 import { useEffect, useState } from "react";
 import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { fetchSellerProduct, updateSellerProduct } from "@/lib/api";
 import { useRouter, useParams } from "next/navigation";
 import Image from "next/image";
 
 export default function EditProductPage() {
   const router = useRouter();
   const params = useParams();
   const id = params?.id;
 
   const [form, setForm] = useState({
     title: "",
     price: "",
     stock: "",
     description: "",
     category: "",
     image: null,
   });
   const [preview, setPreview] = useState(null);
   const [existingImage, setExistingImage] = useState(null);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState("");
 
   useEffect(() => {
     if (!id) return;
     load();
   }, [id]);
 
   async function load() {
     setLoading(true);
     setError("");
     const data = await fetchSellerProduct(id);
     if (!data) {
       setError("Product not found");
       setLoading(false);
       return;
     }
     setForm({
       title: data.title ?? data.name ?? "",
       price: String(data.price ?? ""),
       stock: String(data.stock_quantity ?? data.stock ?? data.quantity ?? ""),
       description: data.description ?? "",
       category: data.category ?? "",
       image: null,
     });
     if (data.image) {
       setExistingImage(data.image);
     }
     setLoading(false);
   }
 
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
     setSaving(true);
     setError("");
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
       
       await updateSellerProduct(id, formData);
       router.push("/seller-dashboard/products");
     } catch (err) {
       setError(err.message || "Failed to update product");
     } finally {
       setSaving(false);
     }
   }
 
   return (
       <main className="max-w-3xl px-1 py-2">
        <Card className="bg-white border-0 shadow-lg animate-slide-up">
           <CardHeader>
             <CardTitle className="text-gray-900">Edit Product</CardTitle>
           </CardHeader>
           {loading ? (
             <div className="p-10 text-center text-gray-600">Loading...</div>
           ) : (
             <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4">
                 {error && <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">{error}</div>}
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
                   <div className="mt-2 flex gap-4">
                     {preview && (
                       <div>
                         <p className="text-xs text-gray-500 mb-2">New Image Preview:</p>
                         <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                           <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                       </div>
                     )}
                     {existingImage && !preview && (
                       <div>
                         <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                         <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                           <Image
                             src={existingImage}
                             alt="Current"
                             width={128}
                             height={128}
                             className="w-full h-full object-cover"
                             onError={(e) => { e.target.style.display = 'none'; }}
                           />
                         </div>
                       </div>
                     )}
                   </div>
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
               <CardFooter className="gap-3">
                 <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                 <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
               </CardFooter>
             </form>
           )}
         </Card>
       </main>
   );
 }
