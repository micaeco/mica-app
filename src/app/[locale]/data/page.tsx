"use client";

import React from "react";
import { useSortableTable } from "@/hooks/useSortableTable";
import EventTable from "@/components/data/EventTable";
import TablePagination from "@/components/data/TablePagination";
import TableHeader from "@/components/data/TableHeader";

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
