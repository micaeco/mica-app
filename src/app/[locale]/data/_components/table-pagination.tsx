import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/_components/ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function TablePagination({ currentPage, totalPages, setCurrentPage }: Props) {
  const renderPaginationItems = () => {
    const items = [];

    // For 3 pages or less, show all pages
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer select-none">
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    // If current page is near the end (last 3 pages)
    if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer select-none">
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    // For all other cases, show current page + ellipsis + last page
    items.push(
      <PaginationItem key={currentPage} className="cursor-pointer select-none">
        <PaginationLink onClick={() => setCurrentPage(currentPage)} isActive={true}>
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    items.push(
      <PaginationItem key="ellipsis" className="cursor-pointer select-none">
        <PaginationEllipsis />
      </PaginationItem>
    );

    items.push(
      <PaginationItem key={totalPages} className="cursor-pointer select-none">
        <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={`cursor-pointer select-none ${currentPage === 1 ? "opacity-50" : ""}`}
              content="Anterior"
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className={`cursor-pointer select-none ${
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }`}
              content="Següent"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
