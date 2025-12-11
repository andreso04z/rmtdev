import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { handleError, fetchJobItem, fetchJobItems } from "./utils";

export function useActiveId() {
    const [activeId, setActiveId] = useState<number | null>(null);
  
    useEffect(() => {
      const handleHashChange = () => {
        const id = +window.location.hash.slice(1);
        setActiveId(id);
      };
      handleHashChange();
  
      window.addEventListener("hashchange", handleHashChange);
  
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, []);

    return activeId;
}

export function useJobItem(id: number | null) {
  const { data, isInitialLoading } = useQuery(
    ["job-item", id],
    () => id ? fetchJobItem(id) : null, 
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!id,
      onError: handleError,
    }
  );

  return { jobItem: data?.jobItem, isLoading: isInitialLoading } as const;
}

export function useJobItems(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchText],
    () => searchText ? fetchJobItems(searchText) : null,
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!searchText,
      onError: handleError,
    }
  );

  return {jobItems: data?.jobItems, isLoading: isInitialLoading} as const;
}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue as T;
}