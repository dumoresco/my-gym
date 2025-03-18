import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePaginationLinks } from "./generate-pages";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  showPreviousNext: boolean;
};

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext,
}: PaginatorProps) {
  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPages ? (
          <PaginationItem>
            <PaginationPrevious
              className={currentPage - 1 < 1 ? "disabled" : ""}
              onClick={() =>
                currentPage - 1 >= 1 && onPageChange(currentPage - 1)
              }
            />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages ? (
          <PaginationItem>
            {currentPage <= totalPages - 1 ? (
              <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
            ) : null}
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
