 "use client";
 
 import { useEffect, useState } from "react";
 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { fetchUserOrders, syncCartWishlist } from "@/lib/api";
 
 export default function SellerProfilePage() {
   const [username, setUsername] = useState("");
   const [orders, setOrders] = useState([]);
   const [ordersCount, setOrdersCount] = useState(0);
   const [cartCount, setCartCount] = useState(0);
   const [wishlistCount, setWishlistCount] = useState(0);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     if (typeof window !== "undefined") {
       setUsername(localStorage.getItem("username") || "");
     }
     load();
   }, []);
 
   async function load() {
     setLoading(true);
     try {
       const o = await fetchUserOrders();
       setOrders(o.orders || []);
       setOrdersCount(o.count || (o.orders?.length ?? 0));
       const sw = await syncCartWishlist();
       setCartCount(sw.cart?.length ?? 0);
       setWishlistCount(sw.wishlist?.length ?? 0);
     } catch {
     } finally {
       setLoading(false);
     }
   }
 
   return (
     <main className="px-1 py-2">
       <header className="mb-8 animate-fade-in">
         <h1 className="text-3xl font-serif text-gray-900">My Profile</h1>
         <p className="text-gray-600 mt-2">Overview of your account and recent activity.</p>
       </header>
 
       <section className="grid lg:grid-cols-3 gap-6 mb-8">
         <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0ms" }}>
           <CardHeader>
             <CardTitle className="text-gray-900">Account</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex items-center gap-4">
               <div className="size-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                 {username ? username.charAt(0).toUpperCase() : "U"}
               </div>
               <div>
                 <div className="text-lg font-medium text-gray-900">{username || "—"}</div>
                 <div className="text-sm text-gray-600">Email: —</div>
               </div>
             </div>
             <div className="mt-4">
               <Button variant="outline" onClick={load}>Refresh</Button>
             </div>
           </CardContent>
         </Card>
 
         <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "60ms" }}>
           <CardHeader>
             <CardTitle className="text-gray-900">Stats</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-3 gap-4">
               <div className="p-4 rounded-lg bg-stone-50">
                 <div className="text-xs text-gray-600">Orders</div>
                 <div className="text-2xl font-semibold text-gray-900">{ordersCount}</div>
               </div>
               <div className="p-4 rounded-lg bg-stone-50">
                 <div className="text-xs text-gray-600">Cart</div>
                 <div className="text-2xl font-semibold text-gray-900">{cartCount}</div>
               </div>
               <div className="p-4 rounded-lg bg-stone-50">
                 <div className="text-xs text-gray-600">Wishlist</div>
                 <div className="text-2xl font-semibold text-gray-900">{wishlistCount}</div>
               </div>
             </div>
           </CardContent>
         </Card>
 
         <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "120ms" }}>
           <CardHeader>
             <CardTitle className="text-gray-900">About</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-sm text-gray-600">
               Enhance your store bio and contact details in Settings to present better to customers.
             </div>
           </CardContent>
         </Card>
       </section>
 
       <section className="animate-slide-up" style={{ animationDelay: "180ms" }}>
         <Card className="bg-white border-0 shadow-lg">
           <CardHeader>
             <CardTitle className="text-gray-900">Recent Orders</CardTitle>
           </CardHeader>
           <CardContent>
             {loading ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="bg-white border-0 shadow-lg rounded-xl p-6 animate-pulse">
                     <div className="h-5 w-1/2 bg-stone-100 rounded mb-4" />
                     <div className="space-y-2">
                       <div className="h-4 w-1/3 bg-stone-100 rounded" />
                       <div className="h-4 w-1/4 bg-stone-100 rounded" />
                     </div>
                   </div>
                 ))}
               </div>
             ) : orders.length === 0 ? (
               <div className="text-sm text-gray-600">No recent orders.</div>
             ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {orders.map((o, idx) => (
                   <div key={idx} className="rounded-xl border bg-white p-6 shadow-sm animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                     <div className="text-sm text-gray-600">Order #{o.id ?? "—"}</div>
                     <div className="text-sm text-gray-600">Status: {o.status ?? "—"}</div>
                     <div className="text-sm text-gray-600">Total: {o.total_amount ?? "—"}</div>
                     <div className="text-xs text-gray-500 mt-2">Created: {o.created_at ?? "—"}</div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
       </section>
     </main>
   );
 }
