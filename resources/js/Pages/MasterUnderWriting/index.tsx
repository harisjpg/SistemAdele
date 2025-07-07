import DatePickerFlowBite from "@/Components/DatePicker";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { FormEvent, useEffect, useState } from "react";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import DataTables from "@/Components/DataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loader from "@/Components/Loader";
import TextInput from "@/Components/TextInput";
import TextSearch from "@/Components/TextSearch";
import { ArrowPathIcon, EyeIcon } from "@heroicons/react/20/solid";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
// import AddNasabah from "./AddNasabah";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import AddUnderWriting from "./AddUnderWriting";
import DetailEditUnderWriting from "./DetailEditUnderWriting";
import Breadcrumbs from "@/Components/Breadcrumbs";
// import DetailEditNasabah from "./DetailEditNasabah";

export default function MasterNasabah({ auth }: any) {
     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for refresh data table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");

     // for show nik
     const [showNik, setShowNik] = useState<boolean>(false);
     const [getIndex, setGetIndex] = useState<any>("");

     // for search datatable
     const [search, setSearch] = useState<any>("");

     // for modal action
     const [modalAction, setModalAction] = useState<any>({
          add: false,
          detail: false,
     });

     // handle action add nasabah
     const handleClickAddNasabah = async () => {
          setModalAction({
               ...modalAction,
               add: true,
          });
     };

     // for data nasabah
     const [dataUnderWriting, setDataUnderWriting] = useState<any>({
          UNDERWRITING_NAME: "",
     });

     // for if success add nasabah
     const handleSuccessAddUnderWriting = async (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataUnderWriting({
                    UNDERWRITING_NAME: "",
               });
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setTimeout(() => {
                    setRefreshTrigger("");
               }, 1000);
          }
     };

     // for Edit Button
     const [textButton, setTextButton] = useState<any>({
          textButton: "Edit",
     });

     // for text title
     const [textTitle, setTextTitle] = useState<any>({
          textTitle: "Detail Under Writing",
     });

     // for edit
     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          setTextTitle({
               textTitle: "Edit Under Writing",
          });
          setTextButton({
               textButton: "detail",
          });
     };

     const [dataEditUnderWriting, setDataEditUnderWriting] = useState<any>([]);
     const handleSuccessEditUnderWriting = async (message: any) => {
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

     // for double click data nasabah
     const handleDoubleClick = async (data: any) => {
          setDataEditUnderWriting({
               UNDERWRITING_ID: data.UNDERWRITING_ID,
               UNDERWRITING_NAME: data.UNDERWRITING_NAME,
          });
          setModalAction({
               ...modalAction,
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Under Writing",
          });
     };

     // for Breadcrumbs
     const forBreadcrumbs = [
          { name: "Underwriting", href: "#", current: true },
     ];

     return (
          <AuthenticatedLayout user={auth.user} header={"Underwriting"}>
               <Head title={"Underwriting"} />
               {/* for alert success */}
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}
               {/* {loaderFetch && <Loader />} */}

               {/* for modal add nambah */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalAction.add}
                    onClose={() =>
                         setModalAction({
                              ...modalAction,
                              add: false,
                         })
                    }
                    title={"Tambah Under Writing"}
                    url={`/addUnderWriting`}
                    data={dataUnderWriting}
                    onSuccess={handleSuccessAddUnderWriting}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    body={
                         <AddUnderWriting
                              setDataUnderWriting={setDataUnderWriting}
                              dataUnderWriting={dataUnderWriting}
                         />
                    }
               />
               {/* end for modal add nambah */}

               {/* for modal detail edit nasabah */}
               <ModalToAction
                    show={modalAction.detail}
                    onClose={() => {
                         setModalAction({
                              ...modalAction,
                              detail: false,
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    title={textTitle.textTitle}
                    url={`/editUnderWriting/${dataEditUnderWriting.UNDERWRITING_ID}`}
                    data={dataEditUnderWriting}
                    onSuccess={handleSuccessEditUnderWriting}
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
                              <DetailEditUnderWriting
                                   textButton={textButton}
                                   dataEditUnderWriting={dataEditUnderWriting}
                                   setDataEditUnderWriting={
                                        setDataEditUnderWriting
                                   }
                              />
                         </>
                    }
               />
               {/* end for modal detail edit nasabah */}

               {/* section master nasabah */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-primary-adele">
                                   Underwriting
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>

                         <div
                              className="p-3 bg-primary-adele text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-primary-hover-adele"
                              onClick={() => {
                                   handleClickAddNasabah();
                              }}
                         >
                              <span>Tambah Underwriting</span>
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
                                        className="ring-1 ring-primary-adele focus:ring-ring-adele"
                                        placeholder="Search for Nama Underwriting, dll"
                                        value={search}
                                        onChange={(e: any) => {
                                             setSearch(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                             if (e.key === "Enter") {
                                                  setRefreshTrigger("success");
                                                  setTimeout(() => {
                                                       setRefreshTrigger("");
                                                  }, 1000);
                                             }
                                        }}
                                        search={search}
                                        setSearch={setSearch}
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
                                             name: "Nama Underwriting",
                                             selector: (row: any) =>
                                                  row.UNDERWRITING_NAME,
                                             sortable: true,
                                             //  width: "230px",
                                        },
                                   ]}
                                   url={"/getUnderWriting"}
                                   search={search}
                                   refreshTrigger={refreshTrigger}
                                   filter={""}
                                   handleDoubleClick={handleDoubleClick}
                              />
                         </div>
                         {/* End Content */}
                    </div>
                    {/* end body section */}
               </section>
               {/* end section master nasaah */}
          </AuthenticatedLayout>
     );
}
