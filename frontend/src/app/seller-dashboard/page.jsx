 "use client";
 
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import Link from "next/link";
 import { useEffect, useState } from "react";
 import { fetchSellerSummary } from "@/lib/api";
 import { ShoppingCart, Package, TrendingUp } from "lucide-react";
 
export default function SellerDashboard() {
  const [summary, setSummary] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await fetchSellerSummary();
        setSummary({
          products: data.products ?? 0,
          orders: data.orders ?? 0,
          revenue: data.revenue ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSummary();
    
    // Refresh summary every 30 seconds
    const interval = setInterval(loadSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
      <main className="px-1 py-2">
        <header className="mb-8 animate-fade-in">
           <h1 className="text-4xl font-serif text-gray-900">Seller Dashboard</h1>
           <p className="text-gray-600 mt-2">
             Overview of your store performance and quick actions.
           </p>
         </header>
 
        <section className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className={`p-6 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 ${loading ? "animate-pulse" : "animate-slide-up"}`} style={{ animationDelay: "0ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Products</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{loading ? "—" : summary.products}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
           </Card>

          <Card className={`p-6 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 ${loading ? "animate-pulse" : "animate-slide-up"}`} style={{ animationDelay: "60ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{loading ? "—" : summary.orders}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-purple-500 opacity-50" />
            </div>
           </Card>

          <Card className={`p-6 shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 ${loading ? "animate-pulse" : "animate-slide-up"}`} style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{loading ? "—" : `₹${parseFloat(summary.revenue || 0).toFixed(2)}`}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
            </div>
           </Card>
         </section>
 
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-lg border-0 bg-white animate-slide-up hover:shadow-xl transition-shadow" style={{ animationDelay: "180ms" }}>
             <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Products</h2>
             <p className="text-gray-600 mb-4">
               Add, edit, and organize your product listings. Currently selling {summary.products} product{summary.products !== 1 ? 's' : ''}.
             </p>
             <div className="flex gap-3">
                <Link href="/seller-dashboard/products">
                  <Button variant="outline" className="w-full sm:w-auto">View All Products</Button>
                </Link>
                <Link href="/seller-dashboard/products/new">
                  <Button className="w-full sm:w-auto">Add New Product</Button>
                </Link>
             </div>
           </Card>
 
          <Card className="p-6 shadow-lg border-0 bg-white animate-slide-up hover:shadow-xl transition-shadow" style={{ animationDelay: "240ms" }}>
             <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Orders</h2>
             <p className="text-gray-600 mb-4">
               Track and manage incoming orders. You have {summary.orders} order{summary.orders !== 1 ? 's' : ''} in total.
             </p>
             <Link href="/seller-dashboard/orders">
                <Button variant="outline" className="w-full">Manage Orders</Button>
             </Link>
           </Card>
         </section>

         <section className="mt-8 grid md:grid-cols-2 gap-6">
           <Card className="p-6 shadow-lg border-0 bg-white animate-slide-up" style={{ animationDelay: "300ms" }}>
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                 <span className="text-gray-700">Products Listed</span>
                 <span className="font-semibold text-gray-900">{summary.products}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                 <span className="text-gray-700">Total Orders Received</span>
                 <span className="font-semibold text-gray-900">{summary.orders}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                 <span className="text-gray-700">Total Revenue Generated</span>
                 <span className="font-semibold text-green-600">₹{parseFloat(summary.revenue || 0).toFixed(2)}</span>
               </div>
             </div>
           </Card>

           <Card className="p-6 shadow-lg border-0 bg-white animate-slide-up" style={{ animationDelay: "360ms" }}>
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings & Support</h2>
             <div className="space-y-3">
               <Link href="/seller-dashboard/profile">
                 <Button variant="outline" className="w-full">Edit Store Profile</Button>
               </Link>
               <Link href="/seller-dashboard/settings">
                 <Button variant="outline" className="w-full">Store Settings</Button>
               </Link>
             </div>
           </Card>
         </section>
      </main>
   );
 }
