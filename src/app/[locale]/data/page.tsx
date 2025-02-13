"use client";

import React from "react";

import EventTable from "./_components/event-table";
import TablePagination from "./_components/table-pagination";
import { useSortableTable } from "@/app/_hooks/use-sortable-table";

export default function SortableEventTable() {
  const {
    category,
    setCategory,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedEvents,
  } = useSortableTable();

  return (
    <div className="p-4">
      <EventTable
        events={paginatedEvents}
        category={category}
        setCategory={setCategory}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
