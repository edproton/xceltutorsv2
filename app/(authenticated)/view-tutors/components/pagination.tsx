import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PageResponse } from "@/lib/types";

type PaginationProps = Pick<
  PageResponse<unknown>,
  "pageNumber" | "totalPages"
> & {
  baseUrl: string;
};

export default function Pagination({
  pageNumber: currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    return params.toString();
  };

  const getPageUrl = (pageNumber: number) => {
    if (pageNumber === 1) return baseUrl;
    return `${baseUrl}?${createQueryString("page", pageNumber.toString())}`;
  };

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "ellipsis");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("ellipsis", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <nav
      className="flex flex-wrap justify-center items-center gap-1.5 mt-8"
      aria-label="Pagination"
    >
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} passHref legacyBehavior>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      )}

      <div className="flex flex-wrap gap-1.5">
        {getVisiblePages().map((pageNumber, index) => {
          if (pageNumber === "ellipsis") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-default"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </Button>
            );
          }

          const page = Number(pageNumber);
          return (
            <Link key={page} href={getPageUrl(page)} passHref legacyBehavior>
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 ${
                  currentPage === page
                    ? "bg-primary hover:bg-primary/90"
                    : "hover:bg-muted"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} passHref legacyBehavior>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </nav>
  );
}
