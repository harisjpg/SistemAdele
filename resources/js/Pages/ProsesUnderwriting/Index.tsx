import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import DataTables from "@/Components/DataTables";
import { FormEvent, useState } from "react";
import ToastMessage from "@/Components/ToastMessage";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { format } from "path";
import styled from "styled-components";
import {
     ArrowPathIcon,
     EyeIcon,
     FunnelIcon,
     PencilSquareIcon,
} from "@heroicons/react/20/solid";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import dateFormat from "dateformat";
import { userIcon } from "@progress/kendo-svg-icons";
import SelectTailwind from "react-tailwindcss-select";
import Loader from "@/Components/Loader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import TextSearch from "@/Components/TextSearch";

export default function ProsesUnderwriting({ auth }: any) {
     const {}: any = usePage().props;

     const [searchProsesUnderwriting, setSearchProsesUnderwriting] =
          useState<any>("");

     // for refresh table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("ada");

     // for Breadcrumbs
     const forBreadcrumbs = [
          { name: "Proses Underwriting", href: "#", current: true },
     ];

     return (
          <AuthenticatedLayout user={auth.user} header={"Proses Underwriting"}>
               <Head title={"Proses Underwriting"} />

               {/* for alert success */}
               {/* {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )} */}
               {/* section for index Proses underwriting debitur  */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-[#0A47FF]">
                                   Proses underwriting
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>
                         <div className="flex gap-2">
                              <div
                                   className="p-3 bg-[#0A47FF] text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-blue-800"
                                   // onClick={(e: any) => {
                                   //      handleProses underwritingDebitur(e);
                                   // }}
                              >
                                   <span>Tambah Proses underwriting</span>
                              </div>
                         </div>
                    </div>
                    {/* End Header */}
                    {/* body section*/}
                    <div className="bg-white mt-6 p-6 rounded-md content-body">
                         {/* Search */}
                         <div className="bg-slate-100 p-3 rounded-md flex items-center gap-2">
                              <div className="w-full">
                                   <TextSearch
                                        type="text"
                                        className="ring-1"
                                        placeholder="Search for Kode Aplikasi, Nama Nasabah, Status dll"
                                        value={searchProsesUnderwriting}
                                        onChange={(e: any) => {
                                             setSearchProsesUnderwriting(
                                                  e.target.value
                                             );
                                        }}
                                        onKeyDown={(e) => {
                                             if (e.key === "Enter") {
                                                  setRefreshTrigger("success");
                                                  setTimeout(() => {
                                                       setRefreshTrigger("");
                                                  }, 1000);
                                             }
                                        }}
                                        search={searchProsesUnderwriting}
                                        setSearch={setSearchProsesUnderwriting}
                                        setRefreshTrigger={setRefreshTrigger}
                                   />
                              </div>
                              <div>
                                   <ArrowPathIcon
                                        className="w-6 text-slate-500 hover:cursor-pointer hover:text-slate-300"
                                        onClick={(e) => {
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   />
                              </div>
                         </div>
                         {/* End Search */}

                         {/* Content */}
                         <div className="mt-2">
                              <DataTables
                                   columns={[
                                        {
                                             name: "Action",
                                             selector: (row: any) => "",
                                             sortable: true,
                                             cell: (row: any) => (
                                                  <>
                                                       {auth.user
                                                            .user_type_id ===
                                                       1 ? (
                                                            <div className="flex gap-2">
                                                                 <div
                                                                      className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                      title="Review"
                                                                      onClick={(
                                                                           e: any
                                                                      ) => {
                                                                           // handleClickReviewOffer(
                                                                           //      e,
                                                                           //      row.OFFER_ID
                                                                           // );
                                                                      }}
                                                                 >
                                                                      <span>
                                                                           <EyeIcon className="w-5 text-primary-adele" />
                                                                      </span>
                                                                 </div>
                                                                 <div
                                                                      className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                      title="Edit"
                                                                 >
                                                                      <span>
                                                                           <PencilSquareIcon className="w-5 text-primary-adele" />
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       ) : (
                                                            <>
                                                                 {(auth.user
                                                                      .user_type_id ===
                                                                      2 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           4) || // for bank dan terima konfirmasi dari broker
                                                                 (auth.user
                                                                      .user_type_id ===
                                                                      3 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           2) || // for broker dan terima broker dari cabang
                                                                 (auth.user
                                                                      .user_type_id ===
                                                                      4 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           6) || // for insurance dan diterima asuransi
                                                                 (auth.user
                                                                      .user_type_id ===
                                                                      3 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           9) ? ( // for broker dan diterima broker dari cabang
                                                                      <div
                                                                           className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                           title="Review"
                                                                           onClick={(
                                                                                e: any
                                                                           ) => {
                                                                                // handleClickReviewOffer(
                                                                                //      e,
                                                                                //      row.OFFER_ID
                                                                                // );
                                                                           }}
                                                                      >
                                                                           <span>
                                                                                <EyeIcon className="w-5 text-primary-adele" />
                                                                           </span>
                                                                      </div>
                                                                 ) : (
                                                                      <div className="flex gap-2">
                                                                           <div
                                                                                className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                                title="Review"
                                                                                onClick={(
                                                                                     e: any
                                                                                ) => {
                                                                                     // handleClickReviewOffer(
                                                                                     //      e,
                                                                                     //      row.OFFER_ID
                                                                                     // );
                                                                                }}
                                                                           >
                                                                                <span>
                                                                                     <EyeIcon className="w-5 text-primary-adele" />
                                                                                </span>
                                                                           </div>
                                                                           {auth
                                                                                .user
                                                                                .user_type_id ===
                                                                                2 && (
                                                                                <div
                                                                                     className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                                     title="Edit"
                                                                                     // onClick={(
                                                                                     //      e
                                                                                     // ) => {
                                                                                     //      handleClickEdit(
                                                                                     //           e,
                                                                                     //           row
                                                                                     //      );
                                                                                     // }}
                                                                                >
                                                                                     <span>
                                                                                          <PencilSquareIcon className="w-5 text-primary-adele" />
                                                                                     </span>
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 )}
                                                            </>
                                                       )}
                                                  </>
                                             ),
                                             // style: {
                                             //      width: "100px",
                                             //      position: "sticky",
                                             //      left: 0,
                                             //      backgroundColor: "#fff",
                                             //      zIndex: 1,
                                             // },
                                        },
                                        {
                                             name: (
                                                  <div className="flex gap-2 w-full items-center justify-between">
                                                       <div>
                                                            <span>
                                                                 Kode Aplikasi
                                                            </span>
                                                       </div>
                                                       <div
                                                            className="hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                 alert("alo");
                                                            }}
                                                       ></div>
                                                  </div>
                                             ),
                                             selector: (row: any) => {
                                                  var display = "";
                                                  var bankInsuranceId =
                                                       row.BANK_INSURANCE_ID;
                                                  var usia =
                                                       row.OFFER_AGE_ON_DUE_DATE.trim();
                                                  var usiaAge =
                                                       row.THE_INSURED_AGE;
                                                  var loanType =
                                                       row.LOAN_TYPE_ID;

                                                  var tglLahir =
                                                       row.THE_INSURED_DATE_OF_BIRTH;
                                                  var tglAkhirKredit =
                                                       row.OFFER_DUE_DATE;

                                                  var convertTglLahir =
                                                       new Date(tglLahir);
                                                  var converTglAkhirKredit =
                                                       new Date(tglAkhirKredit);

                                                  let age =
                                                       converTglAkhirKredit.getFullYear() -
                                                       convertTglLahir.getFullYear();
                                                  let month =
                                                       converTglAkhirKredit.getMonth() -
                                                       convertTglLahir.getMonth();
                                                  let day =
                                                       converTglAkhirKredit.getDate() -
                                                       convertTglLahir.getDate();

                                                  if (day < 0) {
                                                       month -= 1; // Pinjam satu month
                                                       let bulanSebelumnya =
                                                            new Date(
                                                                 converTglAkhirKredit.getFullYear(),
                                                                 converTglAkhirKredit.getMonth(),
                                                                 0
                                                            );
                                                       day +=
                                                            bulanSebelumnya.getDate(); // Tambahkan jumlah hari month sebelumnya
                                                  }

                                                  if (month < 0) {
                                                       age -= 1; // Pinjam satu tahun
                                                       month += 12; // Tambahkan 12 bulan
                                                  }

                                                  if (
                                                       usia ==
                                                       "NaN Tahun NaN Bulan NaN Hari"
                                                  ) {
                                                       display += "-";
                                                  } else {
                                                       if (
                                                            loanType >= "14" &&
                                                            loanType <= "17" &&
                                                            usiaAge > "55" &&
                                                            bankInsuranceId ==
                                                                 null
                                                       ) {
                                                            display += "-";
                                                       } else {
                                                            if (
                                                                 age >= 70 &&
                                                                 month >= 0 &&
                                                                 day >= 0
                                                            ) {
                                                                 if (
                                                                      age ==
                                                                           70 &&
                                                                      month ==
                                                                           0 &&
                                                                      day == 0
                                                                 ) {
                                                                      display +=
                                                                           row.OFFER_SUBMISSION_CODE;
                                                                 } else {
                                                                      // if (bankInsuranceId != null) {
                                                                      //     display += row.OFFER_SUBMISSION_CODE;
                                                                      // } else {
                                                                      display +=
                                                                           "-";
                                                                      // }
                                                                 }
                                                            } else {
                                                                 display +=
                                                                      row.OFFER_SUBMISSION_CODE;
                                                            }
                                                       }
                                                  }
                                                  return display;
                                             },
                                             // {}

                                             // row.OFFER_SUBMISSION_CODE,
                                             // sortable: true,
                                             width: "200px",
                                        },
                                        {
                                             name: "Nama Debitur",
                                             selector: (row: any) =>
                                                  row.THE_INSURED_NAME,
                                             sortable: true,
                                        },
                                        // {
                                        //      name: "Status Proses underwriting",
                                        //      selector: (row: any) =>
                                        //           row.staging_Proses underwriting_name,
                                        //      sortable: true,
                                        //      width: "250px",
                                        //      cell: (row: any) => (
                                        //           <>
                                        //                <span
                                        //                     className="underline hover:cursor-pointer"
                                        //                     onClick={(e) => {
                                        //                          // handleClickDetailStaging(
                                        //                          //      e,
                                        //                          //      row.OFFER_ID
                                        //                          // );
                                        //                     }}
                                        //                >
                                        //                     {
                                        //                          row.staging_Proses underwriting_name
                                        //                     }
                                        //                </span>
                                        //           </>
                                        //      ),
                                        // },
                                        {
                                             name: "Insurance",
                                             selector: (row: any) =>
                                                  row.INSURANCE_NAME === null
                                                       ? "-"
                                                       : row.INSURANCE_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Status Proses",
                                             selector: (row: any) =>
                                                  row.offer_status_name,
                                             sortable: true,
                                        },
                                        {
                                             name: "Tanggal Lahir",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.THE_INSURED_DATE_OF_BIRTH,
                                                       "dd mmm yyyy"
                                                  ),
                                             sortable: true,
                                        },
                                        {
                                             name: "Usia",
                                             selector: (row: any) =>
                                                  row.THE_INSURED_AGE,
                                             sortable: true,
                                        },
                                        {
                                             name: "Uang Pertanggungan",
                                             selector: (row: any) =>
                                                  row.OFFER_SUM_INSURED,
                                             format: (row: any) => {
                                                  return new Intl.NumberFormat(
                                                       "en-US",
                                                       {
                                                            style: "decimal",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                       }
                                                  ).format(
                                                       row.OFFER_SUM_INSURED
                                                  );
                                             },
                                             right: "true",
                                             sortable: true,
                                        },
                                        {
                                             name: "Tenor (Bulan)",
                                             selector: (row: any) =>
                                                  row.OFFER_TENOR,
                                             sortable: true,
                                        },
                                        {
                                             name: "Sumber Pembayaran",
                                             selector: (row: any) =>
                                                  row.TARIF_PAYROLL_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Jenis Asuransi",
                                             selector: (row: any) =>
                                                  row.JENIS_ASURANSI_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Tanggal Awal Kredit",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.OFFER_INCEPTION_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             sortable: true,
                                        },
                                        {
                                             name: "Tanggal Akhir Kredit",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.OFFER_DUE_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             sortable: true,
                                        },
                                        {
                                             name: "Usia Pada Jatuh Tempo",
                                             selector: (row: any) =>
                                                  row.OFFER_AGE_ON_DUE_DATE,
                                             sortable: true,
                                             width: "200px",
                                        },
                                        {
                                             name: "Loan Type",
                                             selector: (row: any) =>
                                                  row.loan_type_name,
                                             sortable: true,
                                        },
                                        {
                                             name: "Cabang",
                                             selector: (row: any) =>
                                                  row.OFFER_BANK_OFFICE_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Created",
                                             selector: (row: any) =>
                                                  row.user_login +
                                                  ", " +
                                                  dateFormat(
                                                       row.OFFER_CREATED_DATE,
                                                       "dd mmm yyyy HH:MM:ss"
                                                  ),
                                             sortable: true,
                                             width: "240px",
                                        },
                                   ]}
                                   url={"/getOfferUnderwriting"}
                                   search={searchProsesUnderwriting}
                                   refreshTrigger={refreshTrigger}
                                   // filter={filter}
                                   handleDoubleClick={undefined}
                              />
                         </div>
                         {/* End Content */}
                    </div>
                    {/* end body section */}
               </section>
               {/* end section for index Proses underwriting debitur */}
          </AuthenticatedLayout>
     );
}
