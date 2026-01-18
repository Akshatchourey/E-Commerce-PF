 "use client";
 
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import Link from "next/link";
 import { useEffect, useState } from "react";
 import { fetchSellerSummary } from "@/lib/api";
 
export default function SellerDashboard() {
  const [summary, setSummary] = useState({ products: 0, orders_today: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSellerSummary().then((data) => {
      setSummary({
        products: data.products ?? 0,
        orders_today: data.orders_today ?? 0,
        revenue: data.revenue ?? 0,
      });
    }).finally(() => setLoading(false));
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
          <Card className={`p-6 shadow-lg border-0 bg-white ${loading ? "animate-pulse" : "animate-slide-up"}`} style={{ animationDelay: "0ms" }}>
             <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{loading ? "—" : summary.products}</p>
           </Card>
          <Card className={`p-6 shadow-lg border-0 bg-white ${loading ? "animate-pulse" : "animate-slide-up"}`} style={{ animationDelay: "60ms" }}>
             <p className="text-sm text-gray-500">Orders Today</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{loading ? "—" : summary.orders_today}</p>
           </Card>
          <Card className={`p-6 shadow-lg border-0 bg-white ${loading ? "animate-pulse" : "animate-slide-up"}`} style={{ animationDelay: "120ms" }}>
             <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{loading ? "—" : summary.revenue}</p>
           </Card>
         </section>
 
        <section className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-lg border-0 bg-white animate-slide-up" style={{ animationDelay: "180ms" }}>
             <h2 className="text-xl font-semibold text-gray-900">Manage Products</h2>
             <p className="text-gray-600 mt-2">
               Add, edit, and organize your product listings.
             </p>
             <div className="mt-4">
              <div className="flex gap-3">
                <Link href="/seller-dashboard/products">
                  <Button variant="outline">Manage Products</Button>
                </Link>
                <Link href="/seller-dashboard/products/new">
                  <Button>Add Product</Button>
                </Link>
              </div>
             </div>
           </Card>
 
          <Card className="p-6 shadow-lg border-0 bg-white animate-slide-up" style={{ animationDelay: "240ms" }}>
             <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
             <p className="text-gray-600 mt-2">
               Track latest orders and store updates.
             </p>
             <div className="mt-4">
              <Link href="/seller-dashboard/orders">
                <Button variant="outline">Manage Orders</Button>
              </Link>
             </div>
           </Card>
         </section>
      </main>
   );
 }
