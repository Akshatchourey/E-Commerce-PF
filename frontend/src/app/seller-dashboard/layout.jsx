 "use client";
 
 import Navbar from "@/components/navbar/navbar";
 import Link from "next/link";
 import { usePathname, useRouter } from "next/navigation";
 import { User, LayoutDashboard, Package, Plus, ClipboardList, Settings, LogOut } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 export default function SellerDashboardLayout({ children }) {
   const pathname = usePathname();
   const router = useRouter();
 
  const nav = [
    { href: "/seller-dashboard/profile", label: "My Profile", icon: User },
    { href: "/seller-dashboard", label: "Overview", icon: LayoutDashboard },
     { href: "/seller-dashboard/products", label: "Products", icon: Package },
     { href: "/seller-dashboard/products/new", label: "Add Product", icon: Plus },
     { href: "/seller-dashboard/orders", label: "Orders", icon: ClipboardList },
     { href: "/seller-dashboard/settings", label: "Settings", icon: Settings },
   ];
 
   function isActive(href) {
     return pathname === href;
   }
 
   function logout() {
     try {
       localStorage.removeItem("access_token");
       localStorage.removeItem("refresh_token");
     } catch {}
     router.push("/sign-in/login");
   }
 
   return (
     <div className="min-h-screen bg-[#F5F5F5]">
       <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <div className="grid grid-cols-[240px_1fr] gap-8">
          <aside className="rounded-xl bg-white border border-stone-200 shadow-sm p-4 animate-slide-left">
             <div className="text-sm font-semibold text-gray-900 mb-3 px-2">Seller Panel</div>
             <nav className="space-y-1">
               {nav.map((item) => {
                 const Icon = item.icon;
                 const active = isActive(item.href);
                 return (
                  <Link key={item.href} href={item.href} className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200
                   ${active ? "bg-amber-50 text-amber-700 border border-amber-100" : "text-gray-700 hover:bg-stone-50 hover:translate-x-[2px]"}`}>
                    <Icon className={`w-4 h-4 transition-colors ${active ? "text-amber-700" : "text-gray-500 group-hover:text-amber-700"}`} />
                     <span className="text-sm font-medium">{item.label}</span>
                   </Link>
                 );
               })}
             </nav>
             <div className="mt-6 border-t pt-4">
               <Button variant="outline" className="w-full justify-start gap-3" onClick={logout}>
                 <LogOut className="w-4 h-4" />
                 Logout
               </Button>
             </div>
           </aside>
 
          <main className="animate-slide-up">
             {children}
           </main>
         </div>
       </div>
     </div>
   );
 }
