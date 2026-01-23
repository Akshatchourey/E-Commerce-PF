"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/navbar";
import { User, Mail, Phone, Package, CheckCircle, Clock, MapPin } from "lucide-react";
import { fetchUserProfile, fetchUserOrders } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, ordersData] = await Promise.all([
          fetchUserProfile(),
          fetchUserOrders()
        ]);

        setUser(userData);
        setOrders(ordersData.orders || []);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const currentOrders = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED" && o.status !== "FAILED"
  );

  const pastOrders = orders.filter(
    (o) => o.status === "DELIVERED" || o.status === "CANCELLED" || o.status === "FAILED"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* PROFILE INFO */}
        <section className="bg-white rounded-lg p-6 border shadow-sm">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
              <User className="text-blue-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                <p className="font-medium text-lg">{user?.username || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
              <Mail className="text-blue-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="font-medium text-lg">{user?.email || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
              <Phone className="text-blue-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="font-medium text-lg">{user?.phone_number || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
              <Clock className="text-blue-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                <p className="font-medium text-lg">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-50 flex items-start gap-4">
            <MapPin className="text-blue-500 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
              <p className="font-medium">
                {[
                  user?.address_line_1,
                  user?.address_line_2,
                  user?.city,
                  user?.state,
                  user?.postal_code,
                  user?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "No address saved"}
              </p>
            </div>
          </div>
        </section>

        {/* CURRENT ORDERS */}
        <section className="bg-white rounded-lg p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Current Orders
          </h2>

          {currentOrders.length === 0 ? (
            <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded">No active orders</p>
          ) : (
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order.public_order_id}
                  className="flex flex-wrap justify-between items-center border p-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-lg">{order.public_order_id}</p>
                    <p className="text-sm text-blue-600 flex items-center gap-1 font-medium bg-blue-100 px-2 py-0.5 rounded-full w-fit mt-1">
                      <Clock className="w-3 h-3" />
                      {order.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="font-bold text-xl">₹{order.total_amount}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PAST ORDERS */}
        <section className="bg-white rounded-lg p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Past Orders
          </h2>

          {pastOrders.length === 0 ? (
            <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded">No past orders</p>
          ) : (
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <div
                  key={order.public_order_id}
                  className="flex flex-wrap justify-between items-center border p-4 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div>
                    <p className="font-semibold">{order.public_order_id}</p>
                    <p className={`text-sm flex items-center gap-1 font-medium px-2 py-0.5 rounded-full w-fit mt-1 ${order.status === 'CANCELLED' || order.status === 'FAILED'
                        ? 'text-red-700 bg-red-100'
                        : 'text-green-700 bg-green-100'
                      }`}>
                      {order.status}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="font-bold text-lg">₹{order.total_amount}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}