import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import DataTables from "@/Components/DataTables";
import { FormEvent, useEffect, useState } from "react";
import ToastMessage from "@/Components/ToastMessage";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import AddShareEffective from "./AddShareEffective";
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DetailShareEffective from "./DetailEditShareEffective";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faListCheck } from "@fortawesome/free-solid-svg-icons";
import dateFormat from "dateformat";

export default function ShareEffective({ auth }: any) {
     const { shareEffective, dataRate }: any = usePage().props;
     const [effectiveDateJiwa, setEffectiveDateJiwa] = useState<any>("");
     const [effectiveDateBundling, setEffectiveDateBundling] =
          useState<any>("");
     useEffect(() => {
          getDateInsuranceBundling();
          getDateInsuranceJiwa();
     }, []);

     const getDateInsuranceJiwa = async () => {
          await axios
               .post(`/getCurrentEffectiveDate`, {})
               .then((res) => {
                    if (res.data.length != 0) {
                         setEffectiveDateJiwa(
                              res.data[0]["SHARE_EFFECTIVE_DATE"]
                         );
                    }
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const getDateInsuranceBundling = async () => {
          await axios
               .post(`/getCurrentEffectiveDateKredit`, {})
               .then((res) => {
                    if (res.data.length != 0) {
                         setEffectiveDateBundling(
                              res.data[0]["SHARE_EFFECTIVE_DATE"]
                         );
                    }
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const [dataShareEffective, setDataShareEffective] = useState<any>([]);
     const [insuranceList, setInsuranceList] = useState<any>([]);

     const getInsuranceList = async () => {
          await axios
               .post(`/getInsuranceList`, {})
               .then((res) => {
                    if (dataShareEffective?.bank_insurance === undefined) {
                         let changeVal: any = [...dataShareEffective];
                         changeVal = res.data;
                         setDataShareEffective({
                              ...dataShareEffective,
                              bank_insurance: changeVal,
                         });
                    }
               })
               .catch((err) => {
                    console.log(err);
               });
     };
     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // Hover Asuransi Jiwa
     const [hoverJiwa, setHoverJiwa] = useState<boolean>(false);

     // for modal
     const [modalShareEffective, setModalShareEffective] = useState<any>({
          add: false,
          detail: false,
          edit: false,
          detailPrevious: false,
     });

     // for handle add create
     const handleAddCreateShareEffective = async (e: FormEvent) => {
          e.preventDefault();

          getInsuranceList();
          getInsuranceType();
          setModalShareEffective({
               add: !modalShareEffective.add,
               detail: false,
               edit: false,
               detailPrevious: false,
          });
     };

     // for insurance type
     const [insuranceType, setInsuranceType] = useState<any>([]);
     const getInsuranceType = async () => {
          await axios
               .post(`/getInsuranceType`, {})
               .then((res) => {
                    setInsuranceType(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const [refreshTrigger, setRefreshTrigger] = useState<string>("ada");

     const handleSuccessShareEffective = (message: any) => {
          setIsSuccess("");
          if (message != "") {
               if (message[1] === "share") {
                    Swal.fire({
                         title: "Warning",
                         text: message[0],
                         icon: "warning",
                    }).then((result: any) => {
                         if (result.value) {
                              // getInsuranceList();
                              let changeVal: any = [
                                   ...dataShareEffective.bank_insurance,
                              ];
                              changeVal = message[2];
                              setDataShareEffective({
                                   ...dataShareEffective,
                                   bank_insurance: changeVal,
                              });
                              setModalShareEffective({
                                   add: true,
                                   detail: false,
                                   edit: false,
                                   detailPrevious: false,
                              });
                         }
                    });
               } else {
                    setIsSuccess(message[0]);
                    setRefreshTrigger(message[0]);
                    setDataShareEffective([]);
                    getDateInsuranceBundling();
                    getDateInsuranceJiwa();
                    setTimeout(() => {
                         setIsSuccess("");
                    }, 5000);
                    setTimeout(() => {
                         setRefreshTrigger("");
                    }, 1000);
               }
          }
     };

     const [activeTab, setActiveTab] = useState<any>("current");
     const handleActiveTabs = async (e: FormEvent, name: string) => {
          e.preventDefault();
          setActiveTab(name);
     };

     const [dataEditShareEffective, setDataEditShareEffective] = useState<any>(
          []
     );

     const [textButton, setTextButton] = useState<any>({
          textButton: "Edit",
     });

     const [textTitle, setTextTitle] = useState<any>({
          textTitle: "Detail Bank List",
     });

     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          // alert("aloo");
          setTextTitle({
               textTitle: "Edit Bank List",
          });
          setTextButton({
               textButton: "detail",
          });
     };

     const handleDeleteSuccessEffective = (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setModalShareEffective({
                    add: false,
                    detail: false,
                    edit: false,
                    detailPrevious: false,
               });
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setTimeout(() => {
                    setRefreshTrigger("");
               }, 1000);
          }
     };

     const deleteShareEffective = async (idEffective: any) => {
          await axios
               .post(`/deleteShareEffective`, { idEffective })
               .then((res) => {
                    handleDeleteSuccessEffective(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const actionDelete = async (e: FormEvent) => {
          e.preventDefault();
          Swal.fire({
               title: "Are you sure?",
               text: "",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, delete it!",
          }).then((result) => {
               if (result.isConfirmed) {
                    deleteShareEffective(
                         dataEditShareEffective.SHARE_EFFECTIVE_DATE_ID
                    );
               }
          });
     };

     const handleDoubleClick = async (data: any) => {
          getInsuranceType();
          setDataEditShareEffective({
               SHARE_EFFECTIVE_DATE_ID: data.SHARE_EFFECTIVE_DATE_ID,
               SHARE_EFFECTIVE_DATE: data.SHARE_EFFECTIVE_DATE,
               JENIS_ASURANSI_ID: data.JENIS_ASURANSI_ID,
               bank_insurance: data.bank_insurance,
          });
          setModalShareEffective({
               add: false,
               detail: true,
               edit: false,
               detailPrevious: false,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Bank List",
          });
     };

     const handleDoubleClickPrevious = async (data: any) => {
          getInsuranceType();
          setDataEditShareEffective({
               SHARE_EFFECTIVE_DATE_ID: data.SHARE_EFFECTIVE_DATE_ID,
               SHARE_EFFECTIVE_DATE: data.SHARE_EFFECTIVE_DATE,
               JENIS_ASURANSI_ID: data.JENIS_ASURANSI_ID,
               bank_insurance: data.bank_insurance,
          });
          setModalShareEffective({
               add: false,
               detail: false,
               edit: false,
               detailPrevious: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Bank List",
          });
     };

     const handleSuccessEditShareEffective = (message: any) => {
          setIsSuccess("");
          if (message != "") {
               if (message[1] === "share") {
                    Swal.fire({
                         title: "Warning",
                         text: message[0],
                         icon: "warning",
                    }).then((result: any) => {
                         // console.log(result);
                         if (result.value) {
                              setModalShareEffective({
                                   add: false,
                                   detail: true,
                                   edit: false,
                                   detailPrevious: false,
                              });
                         }
                    });
               } else {
                    setIsSuccess(message[0]);
                    setRefreshTrigger(message[0]);
                    setTimeout(() => {
                         setIsSuccess("");
                    }, 5000);
                    setTimeout(() => {
                         setRefreshTrigger("");
                    }, 1000);
               }
          }
     };

     return (
          <AuthenticatedLayout user={auth.user} header={"Share Effective Date"}>
               <Head title={"Share Effective Date"} />

               {/* for alert success */}
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}

               {/* modal to add konfigurasi */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalShareEffective.add}
                    onClose={() =>
                         setModalShareEffective({
                              add: false,
                         })
                    }
                    title={"Create New Share Configuration"}
                    url={`/addCreateShareEffective`}
                    data={dataShareEffective}
                    onSuccess={handleSuccessShareEffective}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                    }
                    body={
                         <AddShareEffective
                              setDataShareEffective={setDataShareEffective}
                              dataShareEffective={dataShareEffective}
                              insuranceType={insuranceType}
                              insuranceList={insuranceList}
                              dataRate={dataRate}
                         />
                    }
               />
               {/* modal to add konfigurasi */}

               <ModalToAction
                    show={modalShareEffective.detail}
                    onClose={() => {
                         setModalShareEffective({
                              add: false,
                              detail: false,
                              edit: false,
                              detailPrevious: false,
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    actionDelete={actionDelete}
                    buttonAddOns={"Delete"}
                    title={textTitle.textTitle}
                    url={`/editShareEffective/${dataEditShareEffective.SHARE_EFFECTIVE_DATE_ID}`}
                    data={dataEditShareEffective}
                    onSuccess={handleSuccessEditShareEffective}
                    method={"post"}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                    }
                    submitButtonName={
                         textButton?.textButton === "Edit" ? "" : "Submit"
                    }
                    body={
                         <>
                              <DetailShareEffective
                                   setDataEditShareEffective={
                                        setDataEditShareEffective
                                   }
                                   dataEditShareEffective={
                                        dataEditShareEffective
                                   }
                                   insuranceType={insuranceType}
                                   insuranceList={insuranceList}
                                   dataRate={dataRate}
                                   textButton={textButton}
                              />
                         </>
                    }
               />

               <ModalToAction
                    show={modalShareEffective.detailPrevious}
                    onClose={() => {
                         setModalShareEffective({
                              add: false,
                              detail: false,
                              edit: false,
                              detailPrevious: false,
                         });
                    }}
                    buttonEdit={""}
                    actionEdit={actionEdit}
                    actionDelete={""}
                    buttonAddOns={""}
                    title={textTitle.textTitle}
                    url={`/editShareEffective/${dataEditShareEffective.SHARE_EFFECTIVE_DATE_ID}`}
                    data={dataEditShareEffective}
                    onSuccess={handleSuccessEditShareEffective}
                    method={"post"}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[80%]"
                    }
                    submitButtonName={""}
                    body={
                         <>
                              <DetailShareEffective
                                   setDataEditShareEffective={
                                        setDataEditShareEffective
                                   }
                                   dataEditShareEffective={
                                        dataEditShareEffective
                                   }
                                   insuranceType={insuranceType}
                                   insuranceList={insuranceList}
                                   dataRate={dataRate}
                                   textButton={textButton}
                              />
                         </>
                    }
               />

               <section>
                    <div className="">
                         <div className="grid lg:grid-cols-5 xs:grid-cols-1 lg:gap-4 xs:gap-0">
                              <div className="col bg-white shadow-md rounded-md p-4 xs:mb-2 lg:mb-0">
                                   {/* button create */}
                                   <div
                                        className="bg-[var(--dynamic-color)] p-2 rounded-md shadow-md flex justify-center hover:cursor-pointer hover:bg-blue-800"
                                        onClick={(e: any) =>
                                             handleAddCreateShareEffective(e)
                                        }
                                   >
                                        <span className="text-white text-sm">
                                             Tambah Konfigurasi Baru
                                        </span>
                                   </div>
                                   {/* end button create */}
                              </div>
                              <div className="col col-span-4 bg-white shadow-md rounded-md p-3">
                                   <div className="border-b border-gray-200 dark:border-gray-700">
                                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                             <li className="me-2">
                                                  <a
                                                       onClick={(e: any) =>
                                                            handleActiveTabs(
                                                                 e,
                                                                 "current"
                                                            )
                                                       }
                                                       className={
                                                            activeTab ===
                                                            "current"
                                                                 ? "inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group cursor-pointer"
                                                                 : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                                                       }
                                                  >
                                                       <FontAwesomeIcon
                                                            className={
                                                                 activeTab ===
                                                                 "current"
                                                                      ? "w-4 h-4 me-2 text-blue-600 dark:text-blue-500"
                                                                      : "w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                                            }
                                                            icon={faListCheck}
                                                       />
                                                       Current
                                                  </a>
                                             </li>
                                             <li className="me-2">
                                                  <a
                                                       onClick={(e: any) =>
                                                            handleActiveTabs(
                                                                 e,
                                                                 "upcoming"
                                                            )
                                                       }
                                                       className={
                                                            activeTab ===
                                                            "upcoming"
                                                                 ? "inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group cursor-pointer"
                                                                 : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                                                       }
                                                       aria-current="page"
                                                  >
                                                       <FontAwesomeIcon
                                                            className={
                                                                 activeTab ===
                                                                 "upcoming"
                                                                      ? "w-4 h-4 me-2 text-blue-600 dark:text-blue-500"
                                                                      : "w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                                            }
                                                            icon={faAnglesUp}
                                                       />
                                                       Upcoming Share
                                                       Configuration
                                                  </a>
                                             </li>
                                             <li className="me-2">
                                                  <a
                                                       onClick={(e: any) =>
                                                            handleActiveTabs(
                                                                 e,
                                                                 "previous"
                                                            )
                                                       }
                                                       className={
                                                            activeTab ===
                                                            "previous"
                                                                 ? "inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group cursor-pointer"
                                                                 : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                                                       }
                                                  >
                                                       <svg
                                                            className={
                                                                 activeTab ===
                                                                 "previous"
                                                                      ? "w-4 h-4 me-2 text-blue-600 dark:text-blue-500"
                                                                      : "w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                                            }
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                       >
                                                            <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
                                                       </svg>
                                                       Previous Share
                                                       Configuration
                                                  </a>
                                             </li>
                                        </ul>
                                   </div>
                                   {activeTab === "current" ? (
                                        <div className="mt-4">
                                             <div className="grid grid-cols-1 mt-2">
                                                  <div className="flex flex-col gap-4">
                                                       <span className="text-md italic font-semibold">
                                                            {effectiveDateJiwa !==
                                                            ""
                                                                 ? `Share Aktif Asuransi Jiwa, Efektif dari ${dateFormat(
                                                                        effectiveDateJiwa,
                                                                        "dd mmm yyyy"
                                                                   )}`
                                                                 : "(Please, Create share configuration Asuransi Jiwa first)"}
                                                       </span>
                                                       <div className="">
                                                            <DataTables
                                                                 columns={[
                                                                      {
                                                                           name: "Asuransi Jiwa",
                                                                           selector:
                                                                                (
                                                                                     row: any
                                                                                ) =>
                                                                                     row.INSURANCE_NAME,
                                                                           sortable:
                                                                                true,
                                                                      },
                                                                      {
                                                                           name: "Business Share",
                                                                           selector:
                                                                                (
                                                                                     row: any
                                                                                ) =>
                                                                                     row.BANK_INSURANCE_SHARE +
                                                                                     "%",
                                                                           sortable:
                                                                                true,
                                                                      },
                                                                      {
                                                                           name: "Status",
                                                                           selector:
                                                                                (
                                                                                     row: any
                                                                                ) =>
                                                                                     row.BANK_INSURANCE_REDFLAG ===
                                                                                     "true"
                                                                                          ? "Red Flag"
                                                                                          : "Good",
                                                                           sortable:
                                                                                true,
                                                                      },
                                                                 ]}
                                                                 url={
                                                                      "/getShareEffective"
                                                                 }
                                                                 search={
                                                                      undefined
                                                                 }
                                                                 refreshTrigger={
                                                                      refreshTrigger
                                                                 }
                                                                 handleDoubleClick={
                                                                      undefined
                                                                 }
                                                            />
                                                       </div>
                                                       <span className="text-md italic font-semibold">
                                                            {effectiveDateBundling !==
                                                            ""
                                                                 ? `Share Aktif Asuransi Bundling, Efektif dari ${dateFormat(
                                                                        effectiveDateBundling,
                                                                        "dd mmm yyyy"
                                                                   )}`
                                                                 : "(Please, Create share configuration Asuransi Umum first)"}
                                                       </span>
                                                       <div className="">
                                                            <DataTables
                                                                 columns={[
                                                                      {
                                                                           name: "Asuransi Bundling",
                                                                           selector:
                                                                                (
                                                                                     row: any
                                                                                ) =>
                                                                                     row.INSURANCE_NAME,
                                                                           sortable:
                                                                                true,
                                                                      },
                                                                      {
                                                                           name: "Business Share",
                                                                           selector:
                                                                                (
                                                                                     row: any
                                                                                ) =>
                                                                                     row.BANK_INSURANCE_SHARE +
                                                                                     "%",
                                                                           sortable:
                                                                                true,
                                                                      },
                                                                      {
                                                                           name: "Status",
                                                                           selector:
                                                                                (
                                                                                     row: any
                                                                                ) =>
                                                                                     row.BANK_INSURANCE_REDFLAG ===
                                                                                     "true"
                                                                                          ? "Red Flag"
                                                                                          : "Good",
                                                                           sortable:
                                                                                true,
                                                                      },
                                                                 ]}
                                                                 url={
                                                                      "/getShareEffectiveKredit"
                                                                 }
                                                                 search={
                                                                      undefined
                                                                 }
                                                                 refreshTrigger={
                                                                      refreshTrigger
                                                                 }
                                                                 handleDoubleClick={
                                                                      undefined
                                                                 }
                                                            />
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   ) : null}
                                   {activeTab === "upcoming" ? (
                                        <>
                                             <div className="mt-4">
                                                  <DataTables
                                                       columns={[
                                                            {
                                                                 name: "Tanggal Effective",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      dateFormat(
                                                                           row.SHARE_EFFECTIVE_DATE,
                                                                           "dd mmm yyyy"
                                                                      ),
                                                                 sortable: true,
                                                            },
                                                            {
                                                                 name: "Jenis Asuransi",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      row.JENIS_ASURANSI_NAME,
                                                                 sortable: true,
                                                            },
                                                            {
                                                                 name: "Dibuat",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      dateFormat(
                                                                           row.SHARE_EFFECTIVE_CREATED_DATE,
                                                                           "dd mmm yyyy"
                                                                      ) +
                                                                      " by " +
                                                                      row.user_login,
                                                                 sortable: true,
                                                            },
                                                            {
                                                                 name: "Diedit",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      row.SHARE_EFFECTIVE_UPDATED_BY ===
                                                                      null
                                                                           ? "-"
                                                                           : dateFormat(
                                                                                  row.SHARE_EFFECTIVE_UPDATED_DATE,
                                                                                  "dd mmm yyyy"
                                                                             ) +
                                                                             " by " +
                                                                             row.userLogin,
                                                                 sortable: true,
                                                            },
                                                       ]}
                                                       url={
                                                            "/upcomingShareEffective"
                                                       }
                                                       search={undefined}
                                                       refreshTrigger={
                                                            refreshTrigger
                                                       }
                                                       handleDoubleClick={
                                                            handleDoubleClick
                                                       }
                                                  />
                                             </div>
                                        </>
                                   ) : null}
                                   {activeTab === "previous" ? (
                                        <>
                                             <div className="mt-4">
                                                  <DataTables
                                                       columns={[
                                                            {
                                                                 name: "Tanggal Effective",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      dateFormat(
                                                                           row.SHARE_EFFECTIVE_DATE,
                                                                           "dd mmm yyyy"
                                                                      ),
                                                                 sortable: true,
                                                            },
                                                            {
                                                                 name: "Jenis Asuransi",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      row.JENIS_ASURANSI_NAME,
                                                                 sortable: true,
                                                            },
                                                            {
                                                                 name: "Dibuat",
                                                                 selector: (
                                                                      row: any
                                                                 ) =>
                                                                      dateFormat(
                                                                           row.SHARE_EFFECTIVE_CREATED_DATE,
                                                                           "dd mmm yyyy"
                                                                      ) +
                                                                      " by " +
                                                                      row.user_login,
                                                                 sortable: true,
                                                            },
                                                       ]}
                                                       url={
                                                            "/listOfPreviousShare"
                                                       }
                                                       search={undefined}
                                                       refreshTrigger={
                                                            refreshTrigger
                                                       }
                                                       handleDoubleClick={
                                                            handleDoubleClickPrevious
                                                       }
                                                  />
                                             </div>
                                        </>
                                   ) : null}
                              </div>
                         </div>
                    </div>
               </section>
          </AuthenticatedLayout>
     );
}
