import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (showEllipsisStart) {
      items.push(
        <PaginationItem key="start" className="cursor-pointer select-none">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      items.push(
        <PaginationItem
          key="ellipsis-start"
          className="cursor-pointer select-none"
        >
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i} className="cursor-pointer select-none">
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (showEllipsisEnd) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
      items.push(
        <PaginationItem key="end" className="cursor-pointer select-none">
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={`cursor-pointer select-none ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              content="Anterior"
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              className={`cursor-pointer select-none ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
              content="Següent"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
