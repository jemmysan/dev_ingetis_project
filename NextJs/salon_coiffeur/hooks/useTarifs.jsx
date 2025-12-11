"use client"
import { useCallback, useEffect, useState } from "react"

export function useTarifs(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();

    const fetchAll = useCallback( async () => {
        const res = await fetch("/api/tarifs");
        const json = await res.json();
        setData(json)
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await fetchAll();
            setLoading(false)
        })

    }, [fetchAll]);

    const create = async (payload) => {
        const res = await fetch("/api/tarifs", {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify(payload),
        });
        const created = await res.json();
        setData((d) => [created, ...d]) ;
        return created;
    }
}

