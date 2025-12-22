import { useState, useEffect, useContext } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError, fetchJobItem, fetchJobItems } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";

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

export function useSearchQuery(searchText: string) {
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

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}

export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map(id => ({
      queryKey: ["job-item", id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!id,
      onError: handleError,
    }))
  });

  const jobItems = results.map(result => result.data?.jobItem).filter(jobItem => jobItem !== undefined);
  const isLoading = results.some(result => result.isLoading);
  return {jobItems, isLoading};
}

export function useOnClickOutside(refs: React.RefObject<HTMLElement>[], handler: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        refs.every((ref) => !ref.current?.contains(e.target as Node))
      ) {
        handler();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [refs, handler]);
}

// contexts

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error(
      "useBookmarksContext(BookmarksContext) must be used within a BookmarksContextProvider"
    );
  }
  return context;
}
