import React, { useEffect, useState } from "react";

import { chunkArray } from "../../helpers/chunkArray.helper";
import { getPageArrayInitialState } from "../../helpers/getPageArrayInitialState.helper";

import { BiSearchAlt2 } from "react-icons/bi";
import { HiOutlineChevronDoubleLeft } from "react-icons/hi";
import { HiOutlineChevronRight } from "react-icons/hi";

import "./DataTable.styles.scss";

const DataTable = ({ data, onFilterBySearch, Table, userRole }) => {
    const billsCopy = [...data];
    const chunkData = chunkArray(billsCopy, 5);

    const [billsToDisplay, setBillsToDisplay] = useState(chunkData[0]);

    useEffect(() => {
        setBillsToDisplay(chunkData[0]);
    }, [data]);

    const [paginationArray, setPaginationArray] = useState(getPageArrayInitialState(chunkData));
    const [paginationSetIndex, setPaginationSetIndex] = useState(1);

    const [currentPageIndex, setCurrentPageIndex] = useState(1);

    const fivePagesCount = Math.floor(chunkData.length / 5);
    const remainderPagesCount = chunkData.length % 5;

    const showNextButton = paginationSetIndex <= fivePagesCount;

    const changePageHandler = index => {
        setCurrentPageIndex(index);
        setBillsToDisplay(chunkData[index - 1]);
    };

    const backToFirstSetButtonsHandler = () => {
        setPaginationArray(getPageArrayInitialState(chunkData));

        setCurrentPageIndex(1);
        setPaginationSetIndex(1);
        setBillsToDisplay(chunkData[0]);
    };

    const nextSetButtonsHandler = () => {
        let pageSetCount;

        if (fivePagesCount === paginationSetIndex) {
            pageSetCount = remainderPagesCount;
        } else {
            pageSetCount = 5;
        }

        const mappedPaginationArr = Array(pageSetCount)
            .fill(0)
            ?.map((num, index) => {
                return paginationSetIndex * 5 + (index + 1);
            });

        setPaginationArray(mappedPaginationArr);
        setCurrentPageIndex(paginationSetIndex * 5 + 1);
        setBillsToDisplay(chunkData[paginationSetIndex * 5]);
        setPaginationSetIndex(prevState => prevState + 1);
    };

    const paginationButtons = paginationArray?.map(num => {
        return (
            <button
                className={`${currentPageIndex === num ? "active" : ""}`}
                key={num}
                onClick={() => changePageHandler(num)}
            >
                {num}
            </button>
        );
    });

    // const searchChangeHandler = e => {
    //     const inputValue = e.target.value.trim().toLowerCase();
    //     const filteredData = onFilterBySearch(chunkData[currentPageIndex - 1], inputValue);
    //     setBillsToDisplay(filteredData);
    // };

    let dataToShow;
    if (billsToDisplay?.length > 0) {
        dataToShow = (
            <>
                <Table dataToDisplay={billsToDisplay} userRole={userRole} />
                <div className="pagination">
                    {billsToDisplay?.length > 0 && (
                        <>
                            {paginationSetIndex > 1 && (
                                <button onClick={backToFirstSetButtonsHandler}>
                                    <HiOutlineChevronDoubleLeft />
                                </button>
                            )}
                            {paginationButtons}
                            {showNextButton && (
                                <button onClick={nextSetButtonsHandler}>
                                    <HiOutlineChevronRight />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    } else {
        dataToShow = <div className="no-result-heading">No records.</div>;
    }

    return (
        <article className="data-table">
            <div className="main-content">
                {/* <div className="main-content__upper">
                        <div className="search">
                            <BiSearchAlt2 />
                            <input
                                type="text"
                                placeholder="Filter by userID"
                                onChange={searchChangeHandler}
                            />
                        </div>
                    </div> */}
            </div>
            {dataToShow}
        </article>
    );
};

export default DataTable;
