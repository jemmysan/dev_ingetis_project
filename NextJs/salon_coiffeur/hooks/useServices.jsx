"use client";
import { useState, useEffect, useCallback } from "react";

export function useServices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchAll = useCallback(async () => {
  const res = await fetch("/api/services");
  const json = await res.json();
  setData(json);
}, []);

useEffect(() => {
  // wrap in async IIFE to avoid calling setState synchronously
  (async () => {
    setLoading(true);
    await fetchAll();
    setLoading(false);
  })();
}, [fetchAll]);


  const create = async (payload) => {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setData((d) => [created, ...d]);
    return created;
  };

  const update = async (payload) => {
    const res = await fetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setData((d) => d.map((it) => (it.id === updated.id ? updated : it)));
    return updated;
  };

  const remove = async (id) => {
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    setData((d) => d.filter((it) => it.id !== id));
  };

  return { data, loading, fetchAll, create, update, remove };
}
