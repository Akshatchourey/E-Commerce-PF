 "use client";
 
 import { useEffect, useState } from "react";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { fetchSellerOrders, updateOrderStatus } from "@/lib/api";
 import { Badge } from "@/components/ui/badge";
 
 export default function SellerOrdersPage() {
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [page, setPage] = useState(1);
   const [hasNext, setHasNext] = useState(false);
   const [expandedOrders, setExpandedOrders] = useState(new Set());
 
   useEffect(() => {
     loadOrders(page);
   }, [page]);
 
   async function loadOrders(p) {
     setLoading(true);
     setError("");
     try {
       const data = await fetchSellerOrders({ page: p });
       const list = data.results || data || [];
       setOrders(list);
       setHasNext(Boolean(data.next));
     } catch (e) {
       setError("Failed to load orders");
       console.error(e);
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

   const toggleExpand = (orderId) => {
     const newExpanded = new Set(expandedOrders);
     if (newExpanded.has(orderId)) {
       newExpanded.delete(orderId);
     } else {
       newExpanded.add(orderId);
     }
     setExpandedOrders(newExpanded);
   };

   const getStatusColor = (status) => {
     switch (status?.toUpperCase()) {
       case "PENDING":
         return "bg-yellow-100 text-yellow-800";
       case "PAID":
       case "VERIFIED":
         return "bg-blue-100 text-blue-800";
       case "SHIPPED":
         return "bg-purple-100 text-purple-800";
       case "DELIVERED":
         return "bg-green-100 text-green-800";
       case "FAILED":
       case "CANCELLED":
         return "bg-red-100 text-red-800";
       default:
         return "bg-gray-100 text-gray-800";
     }
   };
 
   return (
       <main className="px-1 py-2">
         <h1 className="text-3xl font-serif text-gray-900 mb-6">Manage Orders</h1>
 
         {error && <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">{error}</div>}
 
        {loading ? (
          <section className="grid gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
           <section className="space-y-4">
            {orders.map((o, idx) => {
              const isExpanded = expandedOrders.has(o.id);
              const orderItems = o.items || [];
              return (
                <Card key={o.id} className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                   <CardHeader className="pb-3">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <CardTitle className="text-gray-900 mb-2">Order #{o.public_order_id || o.id}</CardTitle>
                         <div className="space-y-1">
                           <div className="text-sm text-gray-600"><span className="font-semibold">Customer:</span> {o.customer || o.user?.username || '-'}</div>
                           <div className="text-sm text-gray-600"><span className="font-semibold">Amount:</span> ₹{parseFloat(o.total_amount || 0).toFixed(2)}</div>
                           <div className="text-sm text-gray-600"><span className="font-semibold">Date:</span> {new Date(o.created_at).toLocaleDateString()}</div>
                         </div>
                       </div>
                       <Badge className={getStatusColor(o.status)}>{o.status || 'UNKNOWN'}</Badge>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {/* Order Items Preview */}
                     {orderItems.length > 0 && (
                       <div>
                         <div 
                           className="cursor-pointer flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                           onClick={() => toggleExpand(o.id)}
                         >
                           <span className="text-sm font-semibold text-gray-700">
                             {orderItems.length} item{orderItems.length !== 1 ? 's' : ''} ordered
                           </span>
                           <span className="text-gray-600">{isExpanded ? '▼' : '▶'}</span>
                         </div>
                         
                         {isExpanded && (
                           <div className="mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                             {orderItems.map((item, i) => (
                               <div key={i} className="text-sm text-gray-700 py-1">
                                 <div className="font-medium">{item.product?.title || item.product_name || 'Unknown Product'}</div>
                                 <div className="text-gray-600">
                                   Qty: {item.quantity} × ₹{parseFloat(item.price_at_purchase || 0).toFixed(2)}
                                 </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     )}

                     {/* Status Actions */}
                     <div className="flex gap-2 flex-wrap pt-2">
                       {o.status?.toUpperCase() !== 'DELIVERED' && o.status?.toUpperCase() !== 'SHIPPED' && (
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => handleStatus(o.id, "VERIFIED")}
                         >
                           Verify
                         </Button>
                       )}
                       {o.status?.toUpperCase() !== 'DELIVERED' && o.status?.toUpperCase() !== 'SHIPPED' && (
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => handleStatus(o.id, "SHIPPED")}
                         >
                           Mark Shipped
                         </Button>
                       )}
                       {o.status?.toUpperCase() !== 'DELIVERED' && (
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => handleStatus(o.id, "DELIVERED")}
                         >
                           Mark Delivered
                         </Button>
                       )}
                     </div>
                   </CardContent>
                 </Card>
              );
            })}
           </section>
         )}
 
         {!loading && orders.length > 0 && (
           <div className="flex items-center gap-3 mt-8 justify-center">
             <Button 
               variant="outline" 
               onClick={() => setPage((p) => Math.max(1, p - 1))} 
               disabled={page === 1}
             >
               Previous
             </Button>
             <span className="text-sm text-gray-600 px-4">Page {page}</span>
             <Button 
               variant="outline" 
               onClick={() => setPage((p) => p + 1)} 
               disabled={!hasNext}
             >
               Next
             </Button>
           </div>
         )}
       </main>
   );
 }
