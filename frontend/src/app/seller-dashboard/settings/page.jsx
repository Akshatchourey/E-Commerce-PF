 "use client";
 
 import { useState } from "react";
 import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Checkbox } from "@/components/ui/checkbox";
 
 export default function SellerSettingsPage() {
   const [store, setStore] = useState({
     name: "",
     email: "",
     phone: "",
     description: "",
   });
 
   const [payment, setPayment] = useState({
     razorpay_key_id: "",
     razorpay_key_secret: "",
     show_secret: false,
   });
 
   const [shipping, setShipping] = useState({
     flat_rate: "",
     free_threshold: "",
     delivery_days: "",
     international: false,
   });
 
   const [notify, setNotify] = useState({
     email_orders: true,
     sms_orders: false,
     low_stock_threshold: "5",
   });
 
   const [saving, setSaving] = useState(false);
   const [saved, setSaved] = useState(false);
 
   function handleStoreChange(e) {
     const { name, value } = e.target;
     setStore(s => ({ ...s, [name]: value }));
   }
   function handlePaymentChange(e) {
     const { name, value } = e.target;
     setPayment(p => ({ ...p, [name]: value }));
   }
   function handleShippingChange(e) {
     const { name, value } = e.target;
     setShipping(s => ({ ...s, [name]: value }));
   }
   function handleNotifyChange(e) {
     const { name, value } = e.target;
     setNotify(n => ({ ...n, [name]: value }));
   }
 
   async function handleSave(e) {
     e.preventDefault();
     setSaving(true);
     setSaved(false);
     // Frontend-only: simulate success
     setTimeout(() => {
       setSaving(false);
       setSaved(true);
       setTimeout(() => setSaved(false), 2500);
     }, 500);
   }
 
   function handleReset() {
     setStore({ name: "", email: "", phone: "", description: "" });
     setPayment({ razorpay_key_id: "", razorpay_key_secret: "", show_secret: false });
     setShipping({ flat_rate: "", free_threshold: "", delivery_days: "", international: false });
     setNotify({ email_orders: true, sms_orders: false, low_stock_threshold: "5" });
   }
 
   return (
     <main className="px-1 py-2">
       <header className="mb-8 animate-fade-in">
         <h1 className="text-3xl font-serif text-gray-900">Settings</h1>
         <p className="text-gray-600 mt-2">Configure your store profile, payments, shipping, and notifications.</p>
       </header>
 
       <form onSubmit={handleSave}>
         <section className="grid lg:grid-cols-2 gap-6">
           <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "0ms" }}>
             <CardHeader>
               <CardTitle className="text-gray-900">Store Profile</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Store Name</label>
                 <Input name="name" value={store.name} onChange={handleStoreChange} required />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Email</label>
                   <Input type="email" name="email" value={store.email} onChange={handleStoreChange} required />
                 </div>
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                   <Input name="phone" value={store.phone} onChange={handleStoreChange} />
                 </div>
               </div>
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Description</label>
                 <textarea
                   name="description"
                   className="w-full h-24 rounded-md border bg-transparent px-3 py-2 text-sm"
                   value={store.description}
                   onChange={handleStoreChange}
                 />
               </div>
             </CardContent>
           </Card>
 
           <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "60ms" }}>
             <CardHeader>
               <CardTitle className="text-gray-900">Payments</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Razorpay Key ID</label>
                 <Input name="razorpay_key_id" value={payment.razorpay_key_id} onChange={handlePaymentChange} />
               </div>
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Razorpay Key Secret</label>
                 <div className="flex gap-2">
                   <Input
                     type={payment.show_secret ? "text" : "password"}
                     name="razorpay_key_secret"
                     value={payment.razorpay_key_secret}
                     onChange={handlePaymentChange}
                   />
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => setPayment(p => ({ ...p, show_secret: !p.show_secret }))}
                   >
                     {payment.show_secret ? "Hide" : "Show"}
                   </Button>
                 </div>
               </div>
               <p className="text-xs text-gray-500">Keys are stored securely on the server. Do not share publicly.</p>
             </CardContent>
           </Card>
 
           <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "120ms" }}>
             <CardHeader>
               <CardTitle className="text-gray-900">Shipping</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="grid grid-cols-3 gap-4">
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Flat Rate (₹)</label>
                   <Input type="number" name="flat_rate" value={shipping.flat_rate} onChange={handleShippingChange} />
                 </div>
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Free Threshold (₹)</label>
                   <Input type="number" name="free_threshold" value={shipping.free_threshold} onChange={handleShippingChange} />
                 </div>
                 <div>
                   <label className="text-sm text-gray-600 mb-1 block">Delivery Days</label>
                   <Input type="number" name="delivery_days" value={shipping.delivery_days} onChange={handleShippingChange} />
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <Checkbox
                   checked={shipping.international}
                   onCheckedChange={(val) => setShipping(s => ({ ...s, international: Boolean(val) }))}
                 />
                 <span className="text-sm text-gray-700">Enable International Shipping</span>
               </div>
             </CardContent>
           </Card>
 
           <Card className="bg-white border-0 shadow-lg animate-slide-up" style={{ animationDelay: "180ms" }}>
             <CardHeader>
               <CardTitle className="text-gray-900">Notifications</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center gap-2">
                 <Checkbox
                   checked={notify.email_orders}
                   onCheckedChange={(val) => setNotify(n => ({ ...n, email_orders: Boolean(val) }))}
                 />
                 <span className="text-sm text-gray-700">Email on new orders</span>
               </div>
               <div className="flex items-center gap-2">
                 <Checkbox
                   checked={notify.sms_orders}
                   onCheckedChange={(val) => setNotify(n => ({ ...n, sms_orders: Boolean(val) }))}
                 />
                 <span className="text-sm text-gray-700">SMS on new orders</span>
               </div>
               <div>
                 <label className="text-sm text-gray-600 mb-1 block">Low Stock Alert Threshold</label>
                 <Input
                   type="number"
                   name="low_stock_threshold"
                   value={notify.low_stock_threshold}
                   onChange={handleNotifyChange}
                 />
               </div>
             </CardContent>
           </Card>
         </section>
 
         <div className="mt-8 flex gap-3">
           <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
           <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
           {saved && <span className="text-sm text-green-600 self-center">Settings saved</span>}
         </div>
       </form>
     </main>
   );
 }
