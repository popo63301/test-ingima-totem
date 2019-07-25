import React from "react";

class Pagination extends React.Component {
  pagination(currentPage, pageCount) {
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    let result = [];

    result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(
      i => i && i >= left && i < right
    );

    if (result.length > 1) {
      if (result[0] > 1) {
        if (result[0] > 2) {
          result.unshift("...");
        }
        result.unshift(1);
      }

      if (result[result.length - 1] < pageCount) {
        if (result[result.length - 1] !== pageCount - 1) {
          result.push("...");
        }
        result.push(pageCount);
      }
    }

    return result;
  }

  render() {
    const {
      currentPage,
      numberOfPages,
      goToPage,
      goToPreviousPage,
      goToNextPage
    } = this.props;

    const pages = this.pagination(currentPage, numberOfPages);

    return (
      pages &&
      pages.length > 1 && (
        <div className="container text-center">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {currentPage > 1 && (
                <li>
                  <button className="page-link" onClick={goToPreviousPage}>
                    Previous
                  </button>
                </li>
              )}
              {pages.map((page, index) => (
                <li
                  className={`page-item ${page == currentPage && "disabled"}`}
                  key={"page" + index}
                >
                  <button
                    className="page-link"
                    onClick={() => page != currentPage && goToPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              {currentPage < numberOfPages && (
                <li className="page-item">
                  <button className="page-link" onClick={goToNextPage}>
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )
    );
  }
}

export default Pagination;
