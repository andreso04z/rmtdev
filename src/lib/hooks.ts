import { useState, useEffect } from "react";
import { JobItem, JobItemExpanded } from "./types";
import { BASE_API_URL } from "./constants";

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

export function useJobItem(activeId: number | null) {
    const [jobItem, setJobItem] = useState<JobItemExpanded | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (!activeId) return;
  
      const fetchData = async () => {
        setIsLoading(true);
        const response = await fetch(`${BASE_API_URL}/${activeId}`);
        const data = await response.json();
        setIsLoading(false);
        setJobItem(data.jobItem);
      };
  
      fetchData();
    }, [activeId]);

    return {jobItem, isLoading} as const;
}

export function useJobItems(searchText: string) {
      const [jobItems, setJobItems] = useState<JobItem[]>([]);
      const [isLoading, setIsLoading] = useState(false);

      const jobItemsSliced = jobItems.slice(0, 7);
      const totalNumberOfResults = jobItems.length;
    
      useEffect(() => {
        if (!searchText) return;
    
        const fetchData = async () => {
          setIsLoading(true);
          const response = await fetch(
            `${BASE_API_URL}?search=${searchText}`
          );
          const data = await response.json();
          setIsLoading(false);
          setJobItems(data.jobItems);
        };
    
        fetchData();
      }, [searchText]);

      return {jobItemsSliced, isLoading, totalNumberOfResults} as const;
}
