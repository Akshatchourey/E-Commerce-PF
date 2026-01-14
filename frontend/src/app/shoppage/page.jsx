"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Filters from "@/components/Filters";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { fetchProducts } from "@/lib/api";

export default function ShopPage() {
  const [filters, setFilters] = useState({ page: 1 });
  const [products, setProducts] = useState([]);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    fetchProducts(filters)
      .then(data => {
        setProducts(data.results.products);
        setHasNext(Boolean(data.next));
      })
      .catch(err => console.error(err));
  }, [filters]);

  return (
    <>
      <Navbar />

      <main className="px-[64px] flex gap-[32px] mt-[24px]">
        <Filters setFilters={setFilters} />

        <section className="grid grid-cols-3 gap-[24px] flex-1">
          {products.map(p => (
            <ProductCard
              key={p.public_product_id}
              product={p}
            />
          ))}
        </section>
      </main>

      <Pagination
        page={filters.page}
        setPage={p => setFilters(f => ({ ...f, page: p }))}
        hasNext={hasNext}
      />
    </>
  );
}
