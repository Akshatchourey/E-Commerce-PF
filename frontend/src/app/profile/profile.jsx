"use client";

import React from "react";
import Navbar from "@/components/navbar/navbar";
import { User, Mail, Phone, Package, CheckCircle, Clock } from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555 123 4567",
    memberSince: "Jan 2024",
  };

  const currentOrders = [
    {
      id: "ORD-2025-002",
      status: "In Transit",
      total: "₹895",
    },
  ];

  const pastOrders = [
    {
      id: "ORD-2025-001",
      status: "Delivered",
      total: "₹1,249",
    },
    {
      id: "ORD-2024-078",
      status: "Delivered",
      total: "₹1,565",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* PROFILE INFO */}
        <section className="bg-white rounded-lg p-6 border">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <User className="text-gray-500" />
              <span>{user.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-gray-500" />
              <span>{user.phone}</span>
            </div>

            <div className="text-sm text-gray-500">
              Member since {user.memberSince}
            </div>
          </div>
        </section>

        {/* CURRENT ORDERS */}
        <section className="bg-white rounded-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">My Orders</h2>

          {currentOrders.length === 0 ? (
            <p className="text-gray-500">No active orders</p>
          ) : (
            <div className="space-y-3">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {order.status}
                    </p>
                  </div>
                  <p className="font-bold">{order.total}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PAST ORDERS */}
        <section className="bg-white rounded-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">Past Orders</h2>

          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {order.status}
                  </p>
                </div>
                <p className="font-bold">{order.total}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}