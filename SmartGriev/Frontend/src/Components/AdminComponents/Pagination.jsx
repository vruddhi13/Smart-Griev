import React from "react";

const Pagination = ({ currentPage, totalPages, nextPage, prevPage, setCurrentPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent:"center",
            gap: "8px",
            flexWrap:"nowrap"
        }}>
            <button onClick={prevPage} disabled={currentPage === 1} style={btn}>
                Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                        ...btn,
                        background: currentPage === i + 1 ? "#4318FF" : "#F4F7FE",
                        color: currentPage === i + 1 ? "#fff" : "#2B3674"
                    }}
                >
                    {i + 1}
                </button>
            ))}

            <button onClick={nextPage} disabled={currentPage === totalPages} style={btn}>
                Next
            </button>
        </div>
    );
};

const btn = {
    padding: "8px 14px",
     borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600"
};

export default Pagination;