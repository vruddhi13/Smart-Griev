import { useState } from "react";

const usePagination = (data = [], itemsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    return {
        currentPage,
        totalPages,
        currentData,
        nextPage,
        prevPage,
        setCurrentPage
    };
};

export default usePagination;