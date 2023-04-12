import React, { useEffect, useRef, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import "./report.css";
import { useReactToPrint } from 'react-to-print';
import {Link} from "react-router-dom";

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ""}
            className="form-control"
            onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
}

const ReportTable = React.forwardRef(({
    columns,
    data,
    onSort,
    fetchData,
    dateObject,
    loading,
    pageCount: controlledPageCount,
    canView,
    handleViewClick,
    checkbox,
    handleCheckboxChange,
    checkedList,
    isChecked,
    getSelectAllValue,
    handleSelectAll,
    handleDeselectAll,
}, ref) => {
    const companyId = JSON.parse(sessionStorage.getItem("company_id"))?.company_id ?? "1";
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    const [customFilters, setCustomFilters] = React.useState({
        companyId: "" + companyId,
        fyear: fYear_fetch,
    });
    const [highlightRow, setHighlightRow] = React.useState([]);

    const filterTypes = React.useMemo(
        () => ({
            // Add a new fuzzyTextFilterFn filter type.
            // Or, override the default text filter to use
            // "startWith"
            text: (rows, id, filterValue) => {
                return rows.filter((row) => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            },
        }),
        []
    );
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        // Get the state from the instance
        state: { pageIndex, pageSize, sortBy },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
            defaultColumn, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            manualSortBy: true,
            autoResetPage: false,
            autoResetSortBy: false,
            pageCount: controlledPageCount,
            initialState: { pageSize: 100 }
            //   autoResetFilters: false
        },
        // useFilters,
        useSortBy,
        usePagination
    );
    //   console.log("FILEIET", filters);
    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize, sortBy, customFilters, dateObject });
    }, [fetchData, pageIndex, pageSize, sortBy, customFilters, dateObject]);

    const updateFilters = (e) => {
        let { name, value } = e.target;
        console.log("in update filter", e.target, name, value);
        gotoPage(0)
        setCustomFilters({ ...customFilters, [name]: value });
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const [tableWidth, setTableWidth] = useState('1000px');

    // React.useEffect(() => {
    //     console.log(highlightRow);
    // })

    const tooglehighlightRow = (rowId) => {
        // console.log(rowId);
        let hlRow = [...highlightRow];
        const idx = hlRow.indexOf(rowId);
        if(idx > -1) {
            hlRow.splice(idx, 1);
            setHighlightRow(hlRow);
        }
        else {
            hlRow.push(rowId);
            setHighlightRow(hlRow);
        }
    }

    useEffect(() => {
        console.log("!!!!!!!!");
        var wrapper1 = document.getElementById('wrapper1');
        var wrapper2 = document.getElementById('wrapper2');

        wrapper1.onscroll = function () {
            wrapper2.scrollLeft = wrapper1.scrollLeft;
        };
        wrapper2.onscroll = function () {
            wrapper1.scrollLeft = wrapper2.scrollLeft;
        };

        let tableWidthCurr = componentRef.current.offsetWidth + "px";
        // console.log({ tableWidthCurr });

        setTableWidth(tableWidthCurr);
    }, [])


    // Render the UI for your table
    return (
        <>
            <div className="report-container">
                <div id="wrapper1">
                    <div className="div1" style={{ width: `${tableWidth}` }}>
                    </div>
                </div>
                <div id="wrapper2" >
                    <table {...getTableProps()} className="div2" ref={componentRef}>
                        <thead >
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        canView && <div></div>
                                    }
                                    {
                                        checkbox && <input 
                                            type="checkbox"
                                            name="main_checkbox"
                                            value={getSelectAllValue()}
                                            onChange={(e) => {
                                                if(getSelectAllValue()) {
                                                    handleDeselectAll();
                                                }
                                                else {
                                                    handleSelectAll();
                                                }
                                            }}
                                        />
                                    }
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps({
                                            style: {
                                                minWidth: column.minWidth,
                                                width: column.width,
                                                whiteSpace: "nowrap"
                                            },
                                        })}>

                                            <span {...column.getSortByToggleProps({
                                                style: {
                                                    minWidth: column.minWidth,
                                                    width: column.width,
                                                },
                                            })}>
                                                {column.render("Header")}
                                                {column.isSorted
                                                    ? column.isSortedDesc
                                                        ? " 🔽"
                                                        : " 🔼"
                                                    : ""}
                                            </span>
                                            <div>
                                                {column.accessor && column.canFilter ? <input
                                                    name={column.id}
                                                    value={customFilters[column.id]}
                                                    className="form-control"
                                                    onChange={updateFilters}
                                                    placeholder={`Search records...`}
                                                    style={{ width: column.width, minWidth: column.minWidth }}
                                                /> : null}

                                            </div>

                                            {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                const currentRowId = row.cells[0].value;
                                const highlightCurrentRow = highlightRow.indexOf(currentRowId) > -1;
                                return (
                                    <tr {...row.getRowProps()} className="report-cell-tr">
                                        {
                                            checkbox && <input 
                                                type="checkbox"
                                                checked={isChecked(row.cells)}
                                                onChange={(e) => {
                                                    handleCheckboxChange(row.cells);
                                                }}
                                            />
                                        }
                                        {
                                            canView && <button onClick={() => handleViewClick(row.cells)}>
                                                Open
                                            </button>
                                        }
                                        {/* <button onClick={()=> {
                                                window.open(
                                                    URL = "/bilty",
                                                )
                                            }
                                        }  >
                                            Ok  
                                        </button>
                                        <button>
                                        <Link 
                                            to="/bilty" 
                                            target="_blank"
                                        > Link !! </Link>
                                         </button> */}
                                        {row.cells.map((cell) => {
                                            // console.log(row, row.cells);
                                            return (
                                                <td
                                                    onDoubleClick={() => tooglehighlightRow(currentRowId)}
                                                    {...cell.getCellProps()}
                                                    style={{
                                                        textDecoration: highlightCurrentRow ? "underline" : "",
                                                        whiteSpace: "nowrap",
                                                        textAlign: "center",
                                                        maxWidth: "0px",
                                                        overflow: "hidden",
                                                        textTransform: "uppercase",
                                                    
                                                    }}>{cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            <tr>
                                {loading ? (
                                    // Use our custom loading state to show a loading indicator
                                    <td colSpan="10000">Loading...</td>
                                ) : (
                                    <td colSpan="10000">
                                        Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                                        results
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                    {/* 
            Pagination can be built however you'd like. 
            This is just a very basic UI implementation:
        */}
                    <div className="pagination">
                        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            {"<<"}
                        </button>{" "}
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            {"<"}
                        </button>{" "}
                        <button onClick={() => nextPage()} disabled={!canNextPage}>
                            {">"}
                        </button>{" "}
                        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            {">>"}
                        </button>{" "}
                        <span>
                            Page{" "}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>{" "}
                        </span>
                        <span>
                            | Go to page:{" "}
                            <input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(page);
                                }}
                                style={{ width: "100px" }}
                            />
                        </span>{" "}
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                        <button onClick={handlePrint}>Print </button>
                    </div>
                </div>
            </div>
        </>
    );
})




export default ReportTable;
