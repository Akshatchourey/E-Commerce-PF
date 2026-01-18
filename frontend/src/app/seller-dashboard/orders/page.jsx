 "use client";
 
 import { useEffect, useState } from "react";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { fetchSellerOrders, updateOrderStatus } from "@/lib/api";
 
 export default function SellerOrdersPage() {
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [page, setPage] = useState(1);
   const [hasNext, setHasNext] = useState(false);
 
   useEffect(() => {
     loadOrders(page);
   }, [page]);
 
   async function loadOrders(p) {
     setLoading(true);
     setError("");
     try {
       const data = await fetchSellerOrders({ page: p });
       const list = data.results || data.orders || [];
       setOrders(list);
       setHasNext(Boolean(data.next));
     } catch (e) {
       setError("Failed to load orders");
     } finally {
       setLoading(false);
     }
   }
 
   async function handleStatus(id, status) {
     try {
       const updated = await updateOrderStatus(id, status);
       setOrders((curr) => curr.map((o) => (o.id === id ? { ...o, status: updated.status ?? status } : o)));
     } catch (e) {
       alert(e.message);
     }
   }
 
   return (
       <main className="px-1 py-2">
         <h1 className="text-3xl font-serif text-gray-900 mb-6">Manage Orders</h1>
 
         {error && <div className="text-red-600 mb-4">{error}</div>}
 
        {loading ? (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border-0 shadow-lg rounded-xl p-6 animate-pulse">
                <div className="h-5 w-1/2 bg-stone-100 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-2/5 bg-stone-100 rounded" />
                  <div className="h-4 w-1/3 bg-stone-100 rounded" />
                  <div className="h-4 w-1/4 bg-stone-100 rounded" />
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="h-9 w-28 bg-stone-100 rounded" />
                  <div className="h-9 w-28 bg-stone-100 rounded" />
                  <div className="h-9 w-28 bg-stone-100 rounded" />
                </div>
              </div>
            ))}
          </section>
        ) : (
           <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((o, idx) => (
              <Card key={o.id} className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                 <CardHeader>
                   <CardTitle className="text-gray-900">Order #{o.id}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-sm text-gray-600">Customer: {o.customer_name ?? "-"}</div>
                   <div className="text-sm text-gray-600">Amount: {o.total_amount ?? o.amount ?? "-"}</div>
                   <div className="text-sm text-gray-600">Status: {o.status ?? "-"}</div>
                   <div className="mt-4 flex gap-3">
                     <Button variant="outline" onClick={() => handleStatus(o.id, "processing")}>Mark Processing</Button>
                     <Button variant="outline" onClick={() => handleStatus(o.id, "shipped")}>Mark Shipped</Button>
                     <Button variant="outline" onClick={() => handleStatus(o.id, "delivered")}>Mark Delivered</Button>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </section>
         )}
 
         <div className="flex items-center gap-3 mt-8">
           <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
           <span className="text-sm text-gray-600">Page {page}</span>
           <Button variant="outline" onClick={() => setPage((p) => (hasNext ? p + 1 : p))} disabled={!hasNext}>Next</Button>
         </div>
       </main>
   );
 }
