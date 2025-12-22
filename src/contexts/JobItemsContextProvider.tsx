import { createContext, useState, useMemo, useEffect } from "react";
import { useSearchQuery } from "../lib/hooks";
import { useSearchTextContext } from "../lib/hooks";
import { JobItem, SortBy, Direction } from "../lib/types";
import { RESULTS_PER_PAGE } from "../lib/constants";

type JobItemsContextProviderProps = {
  children: React.ReactNode;
};

type JobItemsContext = {
  jobItems: JobItem[] | undefined;
  isLoading: boolean;
  currentPage: number;
  sortBy: SortBy;
  totalNumberOfResults: number;
  totalNumberOfPages: number;
  jobItemsSortedAndSliced: JobItem[];
  handleChangePage: (direction: Direction) => void;
  handleChangeSortBy: (newSortBy: SortBy) => void;
};

export const JobItemsContext = createContext<JobItemsContext | null>(null);

export default function JobItemsContextProvider({
  children,
}: JobItemsContextProviderProps) {
  const { debouncedSearchText } = useSearchTextContext();
  const { jobItems, isLoading } = useSearchQuery(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("relevant");

  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText]);

  const jobItemsSortedAndSliced = useMemo(() => {
    const sorted = [...(jobItems || [])].sort((a, b) => {
      if (sortBy === "relevant") {
        return b.relevanceScore - a.relevanceScore;
      } else {
        return a.daysAgo - b.daysAgo;
      }
    });
    return sorted.slice(
      currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
      currentPage * RESULTS_PER_PAGE
    );
  }, [jobItems, sortBy, currentPage]);

  const handleChangePage = (direction: Direction) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous") {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleChangeSortBy = (newSortBy: SortBy) => {
    setCurrentPage(1);
    setSortBy(newSortBy);
  };

  return (
    <JobItemsContext.Provider
      value={{
        jobItems,
        isLoading,
        currentPage,
        sortBy,
        totalNumberOfResults,
        totalNumberOfPages,
        jobItemsSortedAndSliced,
        handleChangePage,
        handleChangeSortBy,
      }}
    >
      {children}
    </JobItemsContext.Provider>
  );
}
