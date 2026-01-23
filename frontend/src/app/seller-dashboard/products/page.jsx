 "use client";
 
 import { useEffect, useState } from "react";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import Link from "next/link";
 import { fetchSellerProducts, deleteSellerProduct } from "@/lib/api";
 import Image from "next/image";
 
 export default function SellerProductsPage() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [page, setPage] = useState(1);
   const [hasNext, setHasNext] = useState(false);
 
   useEffect(() => {
     loadProducts(page);
   }, [page]);
 
   async function loadProducts(p) {
     setLoading(true);
     setError("");
     try {
       const data = await fetchSellerProducts({ page: p });
       const list = data.results || data || [];
       setProducts(list);
       setHasNext(Boolean(data.next));
     } catch (e) {
       setError("Failed to load products");
       console.error(e);
     } finally {
       setLoading(false);
     }
   }
 
   async function handleDelete(id) {
     const ok = confirm("Delete this product?");
     if (!ok) return;
     try {
       const success = await deleteSellerProduct(id);
       if (success) {
         setProducts(curr => curr.filter(p => (p.id ?? p.public_product_id) !== id));
       } else {
         alert("Delete failed");
       }
     } catch (e) {
       alert(e.message);
     }
   }
 
   return (
       <main className="px-1 py-2">
         <div className="flex items-center justify-between mb-6">
           <h1 className="text-3xl font-serif text-gray-900">Manage Products</h1>
           <Link href="/seller-dashboard/products/new">
             <Button>Add Product</Button>
           </Link>
         </div>
 
         {error && <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">{error}</div>}
 
        {loading ? (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border-0 shadow-lg rounded-xl p-6 animate-pulse">
                <div className="h-40 w-full bg-stone-100 rounded mb-4" />
                <div className="h-5 w-1/2 bg-stone-100 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-1/3 bg-stone-100 rounded" />
                  <div className="h-4 w-1/4 bg-stone-100 rounded" />
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="h-9 w-20 bg-stone-100 rounded" />
                  <div className="h-9 w-20 bg-stone-100 rounded" />
                </div>
              </div>
            ))}
          </section>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found</p>
            <Link href="/seller-dashboard/products/new">
              <Button>Add Your First Product</Button>
            </Link>
          </div>
        ) : (
           <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, idx) => {
               const id = p.id ?? p.public_product_id;
               const imageUrl = p.image ? (p.image.startsWith('http') ? p.image : `${p.image}`) : null;
               return (
                <Card key={id} className="bg-white border-0 shadow-lg animate-slide-up overflow-hidden" style={{ animationDelay: `${idx * 60}ms` }}>
                   {imageUrl && (
                     <div className="relative h-40 w-full bg-gray-200">
                       <Image
                         src={imageUrl}
                         alt={p.title || p.name}
                         fill
                         className="object-cover"
                         onError={(e) => { e.target.style.display = 'none'; }}
                       />
                     </div>
                   )}
                   <CardHeader>
                     <CardTitle className="text-gray-900 text-lg line-clamp-2">{p.title || p.name || `Product ${id}`}</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-2 mb-4">
                       <div className="text-sm text-gray-600">
                         <span className="font-semibold">Price:</span> ₹{parseFloat(p.price || 0).toFixed(2)}
                       </div>
                       <div className="text-sm text-gray-600">
                         <span className="font-semibold">Stock:</span> {p.stock ?? p.quantity ?? p.inventory?.stock_quantity ?? 0} units
                       </div>
                       <div className="text-sm text-gray-600">
                         <span className="font-semibold">Category:</span> {p.category || 'Uncategorized'}
                       </div>
                       <div className="text-xs text-gray-500">
                         Added: {new Date(p.created_at).toLocaleDateString()}
                       </div>
                     </div>
                     <div className="flex gap-3">
                       <Link href={`/seller-dashboard/products/${id}`}>
                         <Button variant="outline" size="sm">Edit</Button>
                       </Link>
                       <Button variant="destructive" size="sm" onClick={() => handleDelete(id)}>Delete</Button>
                     </div>
                   </CardContent>
                 </Card>
               );
             })}
           </section>
         )}
 
         {!loading && products.length > 0 && (
           <div className="flex items-center gap-3 mt-8 justify-center">
             <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
               Previous
             </Button>
             <span className="text-sm text-gray-600 px-4">Page {page}</span>
             <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
               Next
             </Button>
           </div>
         )}
       </main>
   );
 }
