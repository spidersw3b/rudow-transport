"use client";

import { useEffect, useState } from "react";

type Shipment = {
  id: string;
  request_id: string;
  driver_id: string | null;
  status: string;
  pickup_location: string;
  delivery_location: string;
};

export default function AdminTransportPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [requestId, setRequestId] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");

  async function load() {
    const res = await fetch("/api/transport");
    const data = await res.json();
    if (res.ok) setShipments(data.shipments ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createShipment() {
    const res = await fetch("/api/transport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: requestId,
        pickup_location: pickup,
        delivery_location: delivery,
      }),
    });
    if (res.ok) {
      setRequestId("");
      setPickup("");
      setDelivery("");
      await load();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-rt-navy">Transport Dispatch Board</h1>
      <div className="rounded-sm border border-rt-gray-mid bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-rt-navy">Create shipment</p>
        <div className="grid gap-3 md:grid-cols-4">
          <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Request UUID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
          <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
          <input className="rounded-sm border px-3 py-2 text-sm" placeholder="Delivery location" value={delivery} onChange={(e) => setDelivery(e.target.value)} />
          <button type="button" className="rounded-sm bg-rt-navy px-4 py-2 text-sm font-bold text-white" onClick={() => void createShipment()}>
            Create
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-sm border border-rt-gray-mid bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F6F9] text-left">
            <tr>
              <th className="px-3 py-2">Request</th>
              <th className="px-3 py-2">Pickup</th>
              <th className="px-3 py-2">Delivery</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{shipment.request_id}</td>
                <td className="px-3 py-2">{shipment.pickup_location}</td>
                <td className="px-3 py-2">{shipment.delivery_location}</td>
                <td className="px-3 py-2">{shipment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
