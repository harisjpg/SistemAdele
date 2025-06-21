import DatePickerFlowBite from "@/Components/DatePicker";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import DataTables from "@/Components/DataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loader from "@/Components/Loader";

export default function LaporanPenutupan({ auth }: any) {
     const { arrJenisAsuransi, arrStatusPengajuan, arrStatusProses }: any =
          usePage().props;
     const selectInsurance = arrJenisAsuransi?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });
     const selectPengajuan = arrStatusPengajuan?.map((query: any) => {
          return {
               value: query.staging_pengajuan_id,
               label: query.staging_pengajuan_name,
          };
     });
     const selectStatusProses = arrStatusProses?.map((query: any) => {
          return {
               value: query.offer_status_id,
               label: query.offer_status_name,
          };
     });
     // data for filtering data
     const [dataFiltering, setDataFiltering] = useState<any>({
          START_DATE: "",
          END_DATE: "",
     });
     // end data for filtering data

     // for refresh table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for refresh table

     const [loaderFetch, setLoaderFetch] = useState<boolean>(false);
     // for generate excel
     const handleForGenerateExcel = async (e: FormEvent) => {
          setLoaderFetch(true);
          e.preventDefault();
          await axios
               .post(
                    `/getGenerateExcelPenutupan`,
                    { dataFiltering },
                    { responseType: "blob" }
               )
               .then((res) => {
                    setLoaderFetch(false);
                    const date = new Date();
                    const blob = res.data;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download =
                         date.toLocaleDateString("en-CA") +
                         " - LaporanPenutupan.xlsx"; // Set the default download filename
                    link.click(); // Trigger the file download
                    window.URL.revokeObjectURL(url); // Clean up the object URL
               })
               .catch((err) => {
                    console.log(err);
               });
     };
     // end for generate excel
     return (
          <AuthenticatedLayout user={auth.user} header={"Laporan Penutupan"}>
               <Head title={"Laporan Penutupan"} />
               {/* for alert success */}
               {/* {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )} */}
               {/* Section Penutupan */}
               {/* for section laporan penutupan */}

               {loaderFetch && <Loader />}

               <section>
                    <div
                         className={`grid xs:grid-cols-1 xs:gap-0 lg:grid-cols-5 lg:gap-4`}
                    >
                         <div className="col bg-white p-2 rounded-md shadow-md xs:mb-2 lg:mb-0">
                              <div>
                                   <InputLabel
                                        value="Start Date"
                                        required={true}
                                   />
                                   <DatePickerFlowBite
                                        value={
                                             dataFiltering.START_DATE
                                                  ? dateFormat(
                                                         dataFiltering.START_DATE,
                                                         "dd mmm yyyy"
                                                    )
                                                  : "Start Date"
                                        }
                                        onSelectedDateChanged={(date: Date) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  START_DATE:
                                                       date.toLocaleDateString(
                                                            "en-CA"
                                                       ),
                                             });
                                        }}
                                        className={
                                             "ring-1 rounded-md focus:!ring-primary-adele"
                                        }
                                   />
                              </div>
                              <div className="mt-2">
                                   <InputLabel
                                        value="End Date"
                                        required={true}
                                   />
                                   <DatePickerFlowBite
                                        value={
                                             dataFiltering.END_DATE
                                                  ? dateFormat(
                                                         dataFiltering.END_DATE,
                                                         "dd mmm yyyy"
                                                    )
                                                  : "End Date"
                                        }
                                        onSelectedDateChanged={(date: Date) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  END_DATE:
                                                       date.toLocaleDateString(
                                                            "en-CA"
                                                       ),
                                             });
                                        }}
                                        className={
                                             "ring-1 rounded-md focus:!ring-primary-adele"
                                        }
                                   />
                              </div>
                              <div className="flex justify-end gap-1 mt-2">
                                   <div
                                        className="bg-primary-adele text-white p-2 rounded-md hover:bg-blue-500 hover:cursor-pointer"
                                        onClick={() => {
                                             setDataFiltering({
                                                  START_DATE: "",
                                                  END_DATE: "",
                                             });
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   >
                                        <span>Clear Search</span>
                                   </div>
                                   <div
                                        className="bg-primary-adele text-white p-2 rounded-md hover:bg-blue-500 hover:cursor-pointer"
                                        onClick={() => {
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   >
                                        <span>Search</span>
                                   </div>
                              </div>
                         </div>
                         <div className="col col-span-4 bg-white shadow-md rounded-md p-2 ag-grid-layouts">
                              <div className="grid grid-cols-1 mb-2">
                                   <div className="flex justify-end gap-1">
                                        <div
                                             className="bg-green-800 text-white p-2 rounded-md shadow-md w-24 flex gap-2 items-center justify-center hover:cursor-pointer hover:bg-green-600"
                                             onClick={(e) => {
                                                  handleForGenerateExcel(e);
                                             }}
                                        >
                                             <div>
                                                  <FontAwesomeIcon
                                                       icon={faFileExcel}
                                                  />
                                             </div>
                                             <div>
                                                  <span>Export</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div>
                                   <DataTables
                                        columns={[
                                             {
                                                  name: "Kode Aplikasi",
                                                  selector: (row: any) =>
                                                       row.BUSINESS_LIST_SUBMISSION_CODE,
                                                  sortable: true,
                                                  width: "210px",
                                             },
                                             {
                                                  name: "Nama Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "240px",
                                             },
                                             {
                                                  name: "Tgl Lahir",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.THE_INSURED_DATE_OF_BIRTH,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Usia Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_AGE,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Usia Debitur Saat Jatuh Tempo",
                                                  selector: (row: any) =>
                                                       row.OFFER_AGE_ON_DUE_DATE,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "300px",
                                             },
                                             {
                                                  name: "NIK Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_ID_NUMBER,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "170px",
                                             },
                                             {
                                                  name: "Jenis Asuransi",
                                                  selector: (row: any) =>
                                                       row.JENIS_ASURANSI_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Sumber Pembayaran",
                                                  selector: (row: any) =>
                                                       row.TARIF_PAYROLL_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "220px",
                                             },
                                             {
                                                  name: "Tgl Awal Kredit",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.BUSINESS_LIST_INCEPTION_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Tgl Akhir Kredit",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.BUSINESS_LIST_DUE_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Tenor",
                                                  selector: (row: any) =>
                                                       row.BUSINESS_LIST_TENOR,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Rate",
                                                  selector: (row: any) =>
                                                       row.BUSINESS_LIST_RATE,
                                                  format: (row: any) => {
                                                       return new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            row.BUSINESS_LIST_RATE
                                                       );
                                                  },
                                                  right: "true",
                                                  sortable: true,
                                                  width: "220px",
                                             },
                                             {
                                                  name: "Premi",
                                                  selector: (row: any) =>
                                                       row.BUSINESS_LIST_AMOUNT,
                                                  format: (row: any) => {
                                                       return new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            row.BUSINESS_LIST_AMOUNT
                                                       );
                                                  },
                                                  right: "true",
                                                  sortable: true,
                                                  width: "220px",
                                             },
                                             {
                                                  name: "Nilai Pertanggungan",
                                                  selector: (row: any) =>
                                                       row.BUSINESS_LIST_SUM_INSURED,
                                                  format: (row: any) => {
                                                       return new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            row.BUSINESS_LIST_SUM_INSURED
                                                       );
                                                  },
                                                  right: "true",
                                                  sortable: true,
                                                  width: "220px",
                                             },
                                             {
                                                  name: "Kode Cabang",
                                                  selector: (row: any) =>
                                                       row.BankBranchCode,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Nama Cabang",
                                                  selector: (row: any) =>
                                                       row.BankBranchName,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Kode Office",
                                                  selector: (row: any) =>
                                                       row.BankOfficeCode,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Nama Office",
                                                  selector: (row: any) =>
                                                       row.BankOfficeName,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Loan Type",
                                                  selector: (row: any) =>
                                                       row.loan_type_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Produk",
                                                  selector: (row: any) =>
                                                       row.product_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Sub Produk",
                                                  selector: (row: any) =>
                                                       row.scheme_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "CIF Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_CIF,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                        ]}
                                        url={"/getDataLaporanPenutupan"}
                                        search={dataFiltering}
                                        refreshTrigger={refreshTrigger}
                                        handleDoubleClick={undefined}
                                   />
                              </div>
                         </div>
                    </div>
               </section>
               {/* end for section laporan penutupan */}

               {/* End Section Penutupan */}
          </AuthenticatedLayout>
     );
}
