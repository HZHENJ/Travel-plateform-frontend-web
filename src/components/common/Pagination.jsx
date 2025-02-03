import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null; //if there is only one page, don't show pagination

  const pageNumbers = [];
  const maxButtonsToShow = 5;

  if (totalPages <= maxButtonsToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    pageNumbers.push(totalPages);
  }

  return (
    <div className="mt-8 flex justify-center">
      {/* last page button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-4 py-2 border rounded-md disabled:opacity-50"
      >
        &lt; Prev
      </button>

      {/* 渲染页码 */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`mx-1 px-4 py-2 border rounded-md ${
            currentPage === page ? "bg-blue-500 text-white" : ""
          }`}
          disabled={typeof page !== "number"}
        >
          {page}
        </button>
      ))}

      {/* next page button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-4 py-2 border rounded-md disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
