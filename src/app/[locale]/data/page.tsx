"use client";

import React from "react";

import EventTable from "./components/event-table";
import TablePagination from "./components/table-pagination";
import TableHeader from "./components/table-header";
import { useSortableTable } from "@/hooks/use-sortable-table";

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
    modifyEvent,
  } = useSortableTable();

  return (
    <div>
      <EventTable
        events={paginatedEvents}
        modifyEvent={modifyEvent}
        headerComponent={
          <TableHeader
            category={category}
            setCategory={setCategory}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        }
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
