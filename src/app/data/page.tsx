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
    isEditing,
    setIsEditing,
    modifyEvent,
  } = useSortableTable();

  return (
    <div>
      <EventTable
        events={paginatedEvents}
        isEditing={isEditing}
        modifyEvent={modifyEvent}
        headerComponent={
          <TableHeader
            category={category}
            setCategory={setCategory}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
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
