"use client";

import { useState } from "react";

export default function Filters({ setFilters }) {
  const [local, setLocal] = useState({
    min_price: "",
    max_price: "",
    category: "",
  });

  const applyFilters = () => {
    setFilters(f => ({
      ...f,
      ...local,
      page: 1,
    }));
  };

  return (
    <aside className="w-[260px] text-[14px] space-y-[28px]">
      <h3 className="text-[16px] font-semibold">Filters</h3>

      {/* PRICE */}
      <div>
        <p className="font-medium mb-[6px]">Price</p>
        <input
          type="number"
          placeholder="Min"
          className="w-full mb-[6px] px-[8px] py-[4px] border"
          value={local.min_price}
          onChange={e =>
            setLocal(l => ({ ...l, min_price: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Max"
          className="w-full px-[8px] py-[4px] border"
          value={local.max_price}
          onChange={e =>
            setLocal(l => ({ ...l, max_price: e.target.value }))
          }
        />
      </div>

      {/* CATEGORY */}
      <div>
        <p className="font-medium mb-[6px]">Category</p>
        {["Accessories", "Bags", "Decor"].map(cat => (
          <button
            key={cat}
            className={`block text-left w-full cursor-pointer ${
              local.category === cat ? "font-semibold" : ""
            }`}
            onClick={() =>
              setLocal(l => ({ ...l, category: cat }))
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* APPLY */}
      <button
        onClick={applyFilters}
        className="w-full bg-black text-white py-[8px] rounded-[6px] cursor-pointer"
      >
        Apply Filters
      </button>
    </aside>
  );
}
