import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import DataTables from "@/Components/DataTables";
import { FormEvent, useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import ToastMessage from "@/Components/ToastMessage";
import TextInput from "@/Components/TextInput";
import ModalToAction from "@/Components/Modal/ModalToAction";
import AddRateSetting from "./AddRateSetting";
import axios from "axios";
import {
     ArrowDownIcon,
     ArrowDownTrayIcon,
     ArrowUpTrayIcon,
} from "@heroicons/react/20/solid";
import DetailEditRateSetting from "./DetailEditRateSetting";

export default function RateSetting({ auth }: any) {
     const [modalRateSetting, setModalRateSetting] = useState<any>({
          add: false,
          edit: false,
          detail: false,
     });

     const { dataInsurance }: any = usePage().props;

     // for variabel add Rate Setting
     const [dataRateSetting, setDataRateSetting] = useState<any>({
          RATE_MANAGE_TYPE: "",
          RATE_MANAGE_NAME: "",
          USING_PAYROLL: 0,
          RATE_MANAGE_TEMPLATE_DOCUMENT_ID: "",
          TEMPLATE_RATE_COLUMN_NAME: [
               {
                    TEMPLATE_RATE_NAME: "",
                    TEMPLATE_RATE_DATA: "",
               },
          ],
          TEMPLATE_RATE_COLUMN: [
               {
                    RATE_COLUMN: "",
               },
          ],
          INSURANCE_ID: null,
     });
     // end for variabel add Rate Setting

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for success alert
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for success alert

     // for success when add Rate Setting
     const handleSuccessAddTemplateRate = (message: string) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataRateSetting({
                    RATE_MANAGE_TYPE: "",
                    RATE_MANAGE_NAME: "",
                    USING_PAYROLL: 0,
                    RATE_MANAGE_TEMPLATE_DOCUMENT_ID: "",
                    TEMPLATE_RATE_COLUMN_NAME: [
                         {
                              TEMPLATE_RATE_NAME: "",
                         },
                    ],
               });
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setTimeout(() => {
                    setRefreshTrigger("");
               }, 1000);
          }
     };
     // end for success when add Rate Setting

     // for search bank name
     const [searchBankName, setSearchBankName] = useState<any>({
          BANK_LIST_NAME: "",
     });

     // for Edit Button
     const [textButton, setTextButton] = useState<any>({
          textButton: "Edit",
     });

     // for text title
     const [textTitle, setTextTitle] = useState<any>({
          textTitle: "Detail Rate Setting",
     });

     // for edit
     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          // alert("aloo");
          setTextTitle({
               textTitle: "Edit Rate Setting",
          });
          setTextButton({
               textButton: "detail",
          });
     };

     // VARIABEL FOR DATA Rate Setting EDIT
     const [dataEditRateSetting, setDataEditRateSetting] = useState<any>([]);

     // for double click Rate
     const handleClickDetail = async (data: any) => {
          setDataEditRateSetting(data);
          setModalRateSetting({
               add: false,
               edit: false,
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Rate Setting",
          });
     };

     // for handle success edit bank list
     const handleSuccessRateSetting = (message: string) => {
          setIsSuccess("");
          if (message != "") {
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
     // end for handle success edit bank list

     const handleFileDownload = async (ussingPayroll: any) => {
          await axios({
               url: `/downloadTemplate/${ussingPayroll}`,
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

     const handleFileDownloadRate = async (idDocument: any) => {
          await axios({
               url: `/downloadRate/${idDocument}`,
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

     return (
          <AuthenticatedLayout user={auth.user} header={"Rate Setting"}>
               <Head title={"Rate Setting"} />

               {/* for alert success */}
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}

               {/* Modal Add */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalRateSetting.add}
                    onClose={() => {
                         setModalRateSetting({
                              add: false,
                              edit: false,
                              detail: false,
                         });
                         setDataRateSetting({
                              RATE_MANAGE_TYPE: "",
                              RATE_MANAGE_NAME: "",
                              USING_PAYROLL: 0,
                              RATE_MANAGE_TEMPLATE_DOCUMENT_ID: "",
                              TEMPLATE_RATE_COLUMN_NAME: [
                                   {
                                        TEMPLATE_RATE_NAME: "",
                                        TEMPLATE_RATE_DATA: "",
                                   },
                              ],
                              TEMPLATE_RATE_COLUMN: [
                                   {
                                        RATE_COLUMN: "",
                                   },
                              ],
                              INSURANCE_ID: null,
                         });
                    }}
                    title={"Add Rate Setting"}
                    url={`/addRateSetting`}
                    data={dataRateSetting}
                    onSuccess={handleSuccessAddTemplateRate}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    body={
                         <>
                              <AddRateSetting
                                   setDataRateSetting={setDataRateSetting}
                                   dataRateSetting={dataRateSetting}
                                   dataInsurance={dataInsurance}
                              />
                         </>
                    }
               />
               {/* End Modal Add */}

               {/* Modal Detail */}
               <ModalToAction
                    show={modalRateSetting.detail}
                    onClose={() => {
                         setModalRateSetting({
                              add: false,
                              edit: false,
                              detail: false,
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    title={textTitle.textTitle}
                    url={`/editRateSetting/${dataEditRateSetting.RATE_MANAGE_ID}`}
                    data={dataEditRateSetting}
                    onSuccess={handleSuccessRateSetting}
                    method={"post"}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    submitButtonName={
                         textButton?.textButton === "Edit" ? "" : "Submit"
                    }
                    body={
                         <>
                              <DetailEditRateSetting
                                   setDataEditRateSetting={
                                        setDataEditRateSetting
                                   }
                                   dataEditRateSetting={dataEditRateSetting}
                                   dataInsurance={dataInsurance}
                                   textButton={textButton}
                              />
                         </>
                    }
               />
               {/* Modal Detail */}

               {/* section rate manage */}
               <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                         <div className="bg-white mb-4 rounded-md p-4 gap-2">
                              <div
                                   className="bg-[var(--dynamic-color)] w-full flex justify-center p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => {
                                        setModalRateSetting({
                                             add: true,
                                             edit: false,
                                             detail: false,
                                        });
                                   }}
                              >
                                   <span>Add Rate Setting</span>
                              </div>
                         </div>
                         <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                              <TextInput
                                   type="text"
                                   className="mt-2 ring-1 bg-white"
                                   placeholder="Search Rate Setting"
                                   value={searchBankName.BANK_LIST_NAME}
                                   onChange={(e) => {
                                        setSearchBankName({
                                             ...searchBankName,
                                             BANK_LIST_NAME: e.target.value,
                                        });
                                   }}
                                   onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }
                                   }}
                              />
                              <div className="flex justify-end mt-2">
                                   <div
                                        className="bg-[var(--dynamic-color)] text-white p-2 w-fit rounded-md text-center hover:bg-primary-hover-adele cursor-pointer"
                                        onClick={() => {
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   >
                                        Search
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                         <DataTables
                              columns={[
                                   {
                                        name: "Name",
                                        selector: (row: any) =>
                                             row.RATE_MANAGE_NAME,
                                        sortable: true,
                                   },
                                   {
                                        name: "Template",
                                        selector: (row: any) => "",
                                        sortable: true,
                                        cell: (row: any) => (
                                             <>
                                                  {row.RATE_MANAGE_TEMPLATE_DOCUMENT_ID !==
                                                       null &&
                                                  row.RATE_MANAGE_TYPE === 2 ? (
                                                       <>
                                                            <span
                                                                 title="Download"
                                                                 onClick={(e) =>
                                                                      handleFileDownloadRate(
                                                                           row.RATE_MANAGE_TEMPLATE_DOCUMENT_ID
                                                                      )
                                                                 }
                                                                 style={{
                                                                      color: "#0004ff",
                                                                      cursor: "pointer",
                                                                 }}
                                                            >
                                                                 <ArrowDownTrayIcon className="w-5" />
                                                            </span>
                                                       </>
                                                  ) : row.RATE_MANAGE_TYPE ===
                                                    1 ? (
                                                       row.USING_PAYROLL ===
                                                       1 ? (
                                                            <>
                                                                 <span
                                                                      title="Download"
                                                                      onClick={(
                                                                           e
                                                                      ) =>
                                                                           handleFileDownload(
                                                                                1
                                                                           )
                                                                      }
                                                                      style={{
                                                                           color: "#0004ff",
                                                                           cursor: "pointer",
                                                                      }}
                                                                 >
                                                                      <ArrowDownTrayIcon className="w-5" />
                                                                 </span>
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <span
                                                                      title="Download"
                                                                      onClick={(
                                                                           e
                                                                      ) =>
                                                                           handleFileDownload(
                                                                                0
                                                                           )
                                                                      }
                                                                      style={{
                                                                           color: "#0004ff",
                                                                           cursor: "pointer",
                                                                      }}
                                                                 >
                                                                      <ArrowDownTrayIcon className="w-5" />
                                                                 </span>
                                                            </>
                                                       )
                                                  ) : (
                                                       "-"
                                                  )}
                                             </>
                                        ),
                                        width: "130px",
                                   },
                                   {
                                        name: "Rate Setting",
                                        selector: (row: any) =>
                                             row.RATE_MANAGE_FIX_DOCUMENT_ID,
                                        sortable: true,
                                        cell: (row: any) => (
                                             <div className="rateColumn">
                                                  {row.RATE_MANAGE_FIX_DOCUMENT_ID !==
                                                       null && (
                                                       <span
                                                            title="Download"
                                                            onClick={(e) =>
                                                                 handleFileDownloadRate(
                                                                      row.RATE_MANAGE_FIX_DOCUMENT_ID
                                                                 )
                                                            }
                                                            style={{
                                                                 color: "#0004ff",
                                                                 cursor: "pointer",
                                                            }}
                                                       >
                                                            <ArrowDownTrayIcon className="w-5" />
                                                       </span>
                                                  )}
                                                  <span
                                                       title="Upload"
                                                       onClick={(e) =>
                                                            handleClickDetail(
                                                                 row
                                                            )
                                                       }
                                                       style={{
                                                            color: "#0004ff",
                                                            cursor: "pointer",
                                                       }}
                                                  >
                                                       <ArrowUpTrayIcon className="w-5" />
                                                  </span>
                                             </div>
                                        ),
                                   },
                              ]}
                              url={"/getRateSetting"}
                              search={searchBankName.BANK_LIST_NAME}
                              refreshTrigger={refreshTrigger}
                              handleDoubleClick={undefined}
                         />
                    </div>
               </div>
               {/* end section rate manage */}
          </AuthenticatedLayout>
     );
}
