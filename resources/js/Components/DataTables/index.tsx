import { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Button from "../Button/Button";
import { GridReadyEvent, IServerSideDatasource } from "ag-grid-community";
import DataTable, { defaultThemes } from "react-data-table-component";
import axios from "axios";
import { HeaderRow } from "@progress/kendo-react-data-tools";

export default function DataTables({
     url,
     search,
     refreshTrigger,
     columns,
     handleDoubleClick,
     handleSelectRow,
     filter = null,
     selectableRows = false,
}: PropsWithChildren<{
     url: string;
     search: any;
     refreshTrigger: string;
     handleDoubleClick?: (row: any) => void | any | undefined;
     handleSelectRow?: (row: any) => void | any | undefined;
     columns: any[];
     filter?: any;
     selectableRows?: any;
}>) {
     const [dataBankList, setDataBankList] = useState([]);
     const [loading, setLoading] = useState(false);
     const [totalRows, setTotalRows] = useState(0);
     const [perPage, setPerPage] = useState(10);
     const [page, setPage] = useState(1);

     useEffect(() => {
          if (refreshTrigger !== "") {
               fetchData(page, perPage, search);
          }
     }, [refreshTrigger]);

     const fetchData = async (page: number, perPage: number, search: any) => {
          console.log("masa iya jalan lagi");

          setLoading(true);
          axios.get(
               `${url}?page=${page}&per_page=${perPage}&search=${JSON.stringify(
                    search
               )}&filter=${filter}`
          )
               .then((res) => {
                    setLoading(false);
                    console.log(res.data.data);

                    setDataBankList(res.data.data);
                    setTotalRows(res.data.total);
               })
               .catch((err) => console.log(err));
     };

     // for customStyleTable
     const customStyles = {
          headRow: {
               style: {
                    zIndex: 10, // pastikan head row di atas sticky kolom
                    position: "sticky" as const, // supaya zIndex berfungsi
               },
          },
          headCells: {
               style: {
                    backgroundColor: "#e8e8e8",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "12px",
                    zIndex: 10, // pastikan lebih tinggi dari sticky kolom
               },
          },
          cells: {
               style: {
                    padding: "8px",
               },
          },
          pagination: {
               style: {
                    backgroundColor: "#fff", // #00000 typo, mestinya #000 atau #000000
                    borderTop: "1px solid #ccc",
               },
          },
     };

     const handlePageChange = (page: number) => {
          setPage(page); // Update page number
          fetchData(page, perPage, search);
     };

     const handlePerRowsChange = async (newPerPage: number, page: number) => {
          setPerPage(newPerPage); // Update perPage value
          setPage(page); // Reset to first page after changing rows per page
          fetchData(page, newPerPage, search);
     };

     const columnsWithIndex = [
          {
               name: "No",
               selector: (_: any, index: number) =>
                    (page - 1) * perPage + index + 1,
               width: "80px",
               center: "true",
               style: {
                    borderLeft: "1px solid #e5e7eb",
                    // borderRight: '1px solid #e5e7eb',
               },
               conditionalCellStyles: [
                    {
                         when: (row: any, index: number) =>
                              index === dataBankList.length - 1,
                         style: {
                              borderRight: "1px solid #e5e7eb",
                         },
                    },
               ],
          },
          ...columns,
     ];
     const columnsWithBorder = columnsWithIndex.map((column) => ({
          ...column,
          style: {
               ...column.style,
               borderRight: "1px solid #e5e7eb",
          },
     }));
     return (
          <div
               className="shadow-md rounded-md"
               style={{ height: "299px", overflow: "auto" }}
          >
               <DataTable
                    columns={columnsWithBorder}
                    data={dataBankList}
                    customStyles={customStyles}
                    highlightOnHover
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                    fixedHeader
                    fixedHeaderScrollHeight="240px" // Atur tinggi sesuai kebutuhan
                    onRowDoubleClicked={handleDoubleClick}
                    onSelectedRowsChange={handleSelectRow}
                    responsive
                    striped
                    selectableRows={selectableRows}
                    progressPending={loading}
               />
          </div>
     );
}
