import { useMemo, useState } from "react";

import { SortDirection, SortField } from "@/lib/types";
import { useEventsContext } from "@/components/layout/events-provider";

const ITEMS_PER_PAGE = 12;

export const useSortableTable = () => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const { events, modifyEvent } = useEventsContext();

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      switch (sortField) {
        case "date":
          return sortDirection === "asc"
            ? a.timestamp.getTime() - b.timestamp.getTime()
            : b.timestamp.getTime() - a.timestamp.getTime();
        case "consumption":
          return sortDirection === "asc"
            ? a.consumption - b.consumption
            : b.consumption - a.consumption;
        case "duration":
          return sortDirection === "asc"
            ? a.duration - b.duration
            : b.duration - a.duration;
        default:
          return 0;
      }
    });

    const filtered = sorted.filter(
      (event) =>
        (event.category.name as unknown) === category || category === "all"
    );

    return filtered;
  }, [sortField, sortDirection, events, category]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    category,
    setCategory,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    totalPages,
    handleSort,
    paginatedEvents,
    modifyEvent,
  };
};
