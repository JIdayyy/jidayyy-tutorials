/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { usePagination, DOTS } from "../../hooks/usePagination";

interface IProps {
  currentPage: number;
  totalCount: number;
  siblingCount?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  pageItemsNumber: number;
}

export default function PaginationControls({
  currentPage,
  totalCount,
  siblingCount = 1,
  pageSize,
  onPageChange,
  pageItemsNumber,
}: IProps) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const lastPage = paginationRange[paginationRange.length - 1];

  const onNext = () => {
    if (currentPage === lastPage) {
      return;
    }
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    if (currentPage === 1) {
      return;
    }
    onPageChange(currentPage - 1);
  };

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm ">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{pageItemsNumber}</span> of{" "}
            <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <span
              onClick={onPrevious}
              className={`relative cursor-pointer inline-flex items-center rounded-l-md border border-blue-50 bg-blue-400 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-blue-800 focus:z-20 ${
                currentPage === 1 && "opacity-50"
              }`}
            >
              <span className="sr-only">Previous</span>
              <BsChevronLeft
                color="white"
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

            {paginationRange?.map((pageNumber) => {
              if (pageNumber === DOTS) {
                return (
                  <span className="relative inline-flex items-center border border-blue-50 bg-blue-400 px-4 py-2 text-sm font-medium ">
                    ...
                  </span>
                );
              }

              return (
                <li
                  aria-current="page"
                  className={`relative cursor-pointer z-10 inline-flex items-center border ${
                    pageNumber === currentPage
                      ? "border-blue-400 z-40"
                      : "border-blue-50"
                  } bg-blue-400 px-4 py-2 text-sm font-medium text-white focus:z-20`}
                  onClick={() => onPageChange(pageNumber as number)}
                >
                  {pageNumber}
                </li>
              );
            })}

            <span
              onClick={onNext}
              className={` ${
                currentPage === lastPage && "opacity-50"
              } relative cursor-pointer inline-flex items-center rounded-r-md border border-blue-50 bg-blue-400 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-blue-800 focus:z-20`}
            >
              <span className="sr-only">Next</span>
              <BsChevronRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
}
