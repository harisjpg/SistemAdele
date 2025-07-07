import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import DataTables from "@/Components/DataTables";
import { FormEvent, useState } from "react";
import ToastMessage from "@/Components/ToastMessage";
import SelectTailwind from "react-tailwindcss-select";
import dateFormat from "dateformat";

import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DetailPenutupan from "./DetailPenutupan";
import TextSearch from "@/Components/TextSearch";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function Penutupan({ auth }: any) {
     const { arrInsuranceList }: any = usePage().props;

     const selectInsurance = arrInsuranceList?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.INSURANCE_NAME,
          };
     });

     const [searchPenutupan, setSearchPenutupan] = useState<any>("");

     // for refresh table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for refresh table

     const handleClickDownloadCoverNote = async (
          e: FormEvent,
          idDocument: any
     ) => {
          e.preventDefault();
          await axios({
               url: `/downloadCoverNote/${idDocument}`,
               method: "GET",
               responseType: "blob",
          })
               .then((response) => {
                    const url = window.URL.createObjectURL(
                         new Blob([response.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", response.headers.filename);
                    document.body.appendChild(link);
                    link.click();
               })
               .catch((err) => {
                    console.log(err);
                    if (err.response.status === 404) {
                         alert("File not Found");
                    }
               });
     };

     // for handle click
     const [modalDetail, setModalDetail] = useState<any>({
          detail: false,
     });
     const [idBusinessList, setIfBusinessList] = useState<number>(0);
     const handleClickDetail = async (e: FormEvent, idBusinessList: number) => {
          e.preventDefault();
          setModalDetail({
               detail: true,
          });
          setIfBusinessList(idBusinessList);
     };
     // end for handle click

     // for Breadcrumbs
     const forBreadcrumbs = [{ name: "Penutupan", href: "#", current: true }];
     return (
          <AuthenticatedLayout user={auth.user} header={"Penutupan"}>
               <Head title={"Penutupan"} />
               {/* for alert success */}
               {/* {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )} */}
               {/* Section Penutupan */}

               {/* modal detail */}
               <ModalToAction
                    show={modalDetail.detail}
                    onClose={() => {
                         setModalDetail({
                              detail: false,
                         });
                    }}
                    buttonAddOns={""}
                    title={"Detail Penutupan"}
                    url={``}
                    data={undefined}
                    onSuccess={undefined}
                    method={""}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                    }
                    submitButtonName={""}
                    body={
                         <>
                              <DetailPenutupan
                                   auth={auth}
                                   idBusinessList={idBusinessList}
                              />
                         </>
                    }
               />
               {/* end modal detail*/}

               {/* section for penutupan */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-primary-adele">
                                   Penutupan
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>
                         <div className="flex gap-2">
                              {/* <div
                                   className="p-3 bg-primary-adele text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-primary-hover-adele"
                                   onClick={() => {
                                        // handleClickAddNasabah();
                                   }}
                              >
                                   <span>Tambah Pengajuan</span>
                              </div> */}
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
                                        className="ring-1 ring-primary-adele focus:ring-primary-adele"
                                        placeholder="Search for Kode Aplikasi, Nama Nasabah, Asuransi dll"
                                        value={searchPenutupan}
                                        onChange={(e: any) => {
                                             setSearchPenutupan(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                             if (e.key === "Enter") {
                                                  setRefreshTrigger("success");
                                                  setTimeout(() => {
                                                       setRefreshTrigger("");
                                                  }, 1000);
                                             }
                                        }}
                                        search={searchPenutupan}
                                        setSearch={setSearchPenutupan}
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
                                                       <div className="flex gap-1">
                                                            <div
                                                                 className="bg-primary-adele text-white w-fit p-1 text-xs rounded-md shadow-md hover:cursor-pointer hover:bg-primary-hover-adele"
                                                                 onClick={(
                                                                      e
                                                                 ) => {
                                                                      handleClickDetail(
                                                                           e,
                                                                           row.BUSINESS_LIST_ID
                                                                      );
                                                                 }}
                                                            >
                                                                 <span>
                                                                      Detail
                                                                 </span>
                                                            </div>
                                                       </div>
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
                                             name: "Kode Aplikasi",
                                             selector: (row: any) =>
                                                  row.BUSINESS_LIST_SUBMISSION_CODE,
                                             sortable: true,
                                             width: "210px",
                                        },
                                        {
                                             name: "Office",
                                             selector: (row: any) =>
                                                  row.BankOfficeName,
                                             // right: "true",
                                             sortable: true,
                                        },
                                        {
                                             name: "Nama Debitur",
                                             selector: (row: any) =>
                                                  row.THE_INSURED_NAME,
                                             // right: "true",
                                             sortable: true,
                                             width: "190px",
                                        },
                                        {
                                             name: "Tanggal Active Cover Note",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.covernote_date,
                                                       "dd mmm yyyy"
                                                  ) +
                                                  " s/d " +
                                                  dateFormat(
                                                       row.covernote_due_date,
                                                       "dd mmm yyyy"
                                                  ),
                                             // right: "true",
                                             sortable: true,
                                             width: "310px",
                                        },
                                        {
                                             name: "Cover Note",
                                             selector: (row: any) =>
                                                  row.covernote_number,
                                             cell: (row: any) => (
                                                  <>
                                                       {auth.user
                                                            .user_type_id ===
                                                            3 ||
                                                       auth.user
                                                            .user_type_id ===
                                                            4 ||
                                                       auth.user
                                                            .user_type_id ===
                                                            1 ? (
                                                            <div
                                                                 className="flex gap-2 justify-center items-center hover:cursor-pointer"
                                                                 onClick={(
                                                                      e
                                                                 ) => {
                                                                      handleClickDownloadCoverNote(
                                                                           e,
                                                                           row.document_id
                                                                      );
                                                                 }}
                                                            >
                                                                 <div>
                                                                      <span>
                                                                           {
                                                                                row.covernote_number
                                                                           }
                                                                      </span>
                                                                 </div>
                                                                 <div>
                                                                      <span>
                                                                           <ArrowDownTrayIcon className="w-5" />
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       ) : (
                                                            <div className="flex gap-2 justify-center items-center hover:cursor-pointer">
                                                                 <div
                                                                      onClick={(
                                                                           e
                                                                      ) => {
                                                                           handleClickDownloadCoverNote(
                                                                                e,
                                                                                row.document_id
                                                                           );
                                                                      }}
                                                                 >
                                                                      <span>
                                                                           <ArrowDownTrayIcon className="w-5" />
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       )}
                                                  </>
                                             ),
                                             // right: "true",
                                             sortable: true,
                                             width: "230px",
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
                                             name: "Sumber Pembayaran",
                                             selector: (row: any) =>
                                                  row.TARIF_PAYROLL_NAME,
                                             // right: "true",
                                             sortable: true,
                                             width: "240px",
                                        },
                                        {
                                             name: "Awal Kredit",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.BUSINESS_LIST_INCEPTION_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             // right: "true",
                                             sortable: true,
                                             width: "150px",
                                        },
                                        {
                                             name: "Akhir Kredit",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.BUSINESS_LIST_DUE_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             // right: "true",
                                             sortable: true,
                                             width: "150px",
                                        },
                                        {
                                             name: "Uang Tertanggung",
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
                                             width: "199px",
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
                                             width: "150px",
                                        },
                                        {
                                             name: "Asuransi",
                                             selector: (row: any) =>
                                                  row.INSURANCE_NAME,
                                             // right: "true",
                                             sortable: true,
                                             width: "140px",
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
                                             name: "Register Date",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.BUSINESS_LIST_CREATED_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             // right: "true",
                                             sortable: true,
                                             width: "180px",
                                        },
                                   ]}
                                   url={"/getBusinessList"}
                                   search={searchPenutupan}
                                   refreshTrigger={refreshTrigger}
                                   handleDoubleClick={undefined}
                              />
                         </div>
                         {/* End Content */}
                    </div>
                    {/* end body section */}
               </section>
               {/* end for section penutupan */}

               {/* <section>
                    <div
                         className={`grid xs:grid-cols-1 xs:gap-0 ${
                              auth.user.user_type_id !== 4 &&
                              `lg:grid-cols-5 lg:gap-4`
                         }`}
                    >
                         {auth.user.user_type_id !== 4 && (
                              <>
                                   <div className="col bg-white p-2 rounded-md shadow-md xs:mb-2 lg:mb-0">
                                        <div>
                                             <InputLabel value="Asuransi" />
                                             <SelectTailwind
                                                  classNames={{
                                                       // Menggunakan truncate dan max-w-full pada menuButton untuk memastikan teks tidak keluar dari input
                                                       menuButton: () =>
                                                            `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 text-wrap max-w-full truncate`, // Menambahkan truncate dan max-w-full

                                                       // Menu dropdown tetap sama, jika ada masalah pada dropdown, kamu bisa sesuaikan lagi
                                                       menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",

                                                       // Menyesuaikan listItem seperti sebelumnya untuk opsi dropdown
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-primary-adele`
                                                                      : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectInsurance}
                                                  isSearchable={true}
                                                  isClearable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={
                                                       searchPenutupan.JENIS_INSURANCE
                                                  }
                                                  onChange={(e: any) => {
                                                       setSearchPenutupan({
                                                            ...searchPenutupan,
                                                            JENIS_INSURANCE: e,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                        </div>
                                        <div className="flex justify-end mt-2 gap-1">
                                             <div
                                                  className="bg-primary-adele p-2 w-fit text-white shadow-md rounded-md hover:cursor-pointer "
                                                  onClick={() => {
                                                       setSearchPenutupan({
                                                            JENIS_INSURANCE:
                                                                 null,
                                                       });
                                                       setRefreshTrigger(
                                                            "success"
                                                       );
                                                       setTimeout(() => {
                                                            setRefreshTrigger(
                                                                 ""
                                                            );
                                                       }, 1000);
                                                  }}
                                             >
                                                  <span>Clear Search</span>
                                             </div>
                                             <div
                                                  className="bg-primary-adele p-2 w-fit text-white shadow-md rounded-md hover:cursor-pointer"
                                                  onClick={() => {
                                                       setRefreshTrigger(
                                                            "success"
                                                       );
                                                       setTimeout(() => {
                                                            setRefreshTrigger(
                                                                 ""
                                                            );
                                                       }, 1000);
                                                  }}
                                             >
                                                  <span>Search</span>
                                             </div>
                                        </div>
                                   </div>
                              </>
                         )}
                         <div className="col col-span-4 bg-white shadow-md rounded-md p-2 content-body">
                              <div>
                                   <DataTables
                                        columns={[
                                             {
                                                  name: "Action",
                                                  selector: (row: any) => "",
                                                  sortable: true,
                                                  cell: (row: any) => (
                                                       <>
                                                            <div className="flex gap-1">
                                                                 <div
                                                                      className="bg-primary-adele text-white w-fit p-1 text-xs rounded-md shadow-md hover:cursor-pointer hover:bg-primary-hover-adele"
                                                                      onClick={(
                                                                           e
                                                                      ) => {
                                                                           handleClickDetail(
                                                                                e,
                                                                                row.BUSINESS_LIST_ID
                                                                           );
                                                                      }}
                                                                 >
                                                                      <span>
                                                                           Detail
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       </>
                                                  ),
                                                  style: {
                                                       width: "100px",
                                                       position: "sticky",
                                                       left: 0,
                                                       backgroundColor: "#fff",
                                                       zIndex: 1,
                                                  },
                                             },
                                             {
                                                  name: "Kode Aplikasi",
                                                  selector: (row: any) =>
                                                       row.BUSINESS_LIST_SUBMISSION_CODE,
                                                  sortable: true,
                                                  width: "210px",
                                             },
                                             {
                                                  name: "Office",
                                                  selector: (row: any) =>
                                                       row.BankOfficeName,
                                                  // right: "true",
                                                  sortable: true,
                                             },
                                             {
                                                  name: "Nama Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Tanggal Active Cover Note",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.covernote_date,
                                                            "dd mmm yyyy"
                                                       ) +
                                                       " s/d " +
                                                       dateFormat(
                                                            row.covernote_due_date,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "310px",
                                             },
                                             {
                                                  name: "Cover Note",
                                                  selector: (row: any) =>
                                                       row.covernote_number,
                                                  cell: (row: any) => (
                                                       <>
                                                            {auth.user
                                                                 .user_type_id ===
                                                                 3 ||
                                                            auth.user
                                                                 .user_type_id ===
                                                                 4 ||
                                                            auth.user
                                                                 .user_type_id ===
                                                                 1 ? (
                                                                 <div
                                                                      className="flex gap-2 justify-center items-center hover:cursor-pointer"
                                                                      onClick={(
                                                                           e
                                                                      ) => {
                                                                           handleClickDownloadCoverNote(
                                                                                e,
                                                                                row.document_id
                                                                           );
                                                                      }}
                                                                 >
                                                                      <div>
                                                                           <span>
                                                                                {
                                                                                     row.covernote_number
                                                                                }
                                                                           </span>
                                                                      </div>
                                                                      <div>
                                                                           <span>
                                                                                <ArrowDownTrayIcon className="w-5" />
                                                                           </span>
                                                                      </div>
                                                                 </div>
                                                            ) : (
                                                                 <div className="flex gap-2 justify-center items-center hover:cursor-pointer">
                                                                      <div
                                                                           onClick={(
                                                                                e
                                                                           ) => {
                                                                                handleClickDownloadCoverNote(
                                                                                     e,
                                                                                     row.document_id
                                                                                );
                                                                           }}
                                                                      >
                                                                           <span>
                                                                                <ArrowDownTrayIcon className="w-5" />
                                                                           </span>
                                                                      </div>
                                                                 </div>
                                                            )}
                                                       </>
                                                  ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "230px",
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
                                                  name: "Sumber Pembayaran",
                                                  selector: (row: any) =>
                                                       row.TARIF_PAYROLL_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "240px",
                                             },
                                             {
                                                  name: "Awal Kredit",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.BUSINESS_LIST_INCEPTION_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "150px",
                                             },
                                             {
                                                  name: "Akhir Kredit",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.BUSINESS_LIST_DUE_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "150px",
                                             },
                                             {
                                                  name: "Uang Tertanggung",
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
                                                  width: "199px",
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
                                                  width: "150px",
                                             },
                                             {
                                                  name: "Asuransi",
                                                  selector: (row: any) =>
                                                       row.INSURANCE_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
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
                                                  name: "Register Date",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.BUSINESS_LIST_CREATED_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "180px",
                                             },
                                        ]}
                                        url={"/getBusinessList"}
                                        search={searchPenutupan}
                                        refreshTrigger={refreshTrigger}
                                        handleDoubleClick={undefined}
                                   />
                              </div>
                         </div>
                    </div>
               </section> */}
               {/* End Section Penutupan */}
          </AuthenticatedLayout>
     );
}
