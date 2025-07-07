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
// import AddBroker from "./AddBroker";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
// import DetailEditBroker from "./DetailEditBroker";
import Breadcrumbs from "@/Components/Breadcrumbs";
import AddBroker from "./AddOrganisasi";

export default function Broker({ auth }: any) {
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

     // get data work type
     const [dataWork, setDataWork] = useState<any>([]);
     const getDataWork = async () => {
          await axios
               .post(`/getDataWork`, {})
               .then((res) => {
                    setDataWork(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // handle action add Broker
     const handleClickAddBroker = async () => {
          getDataWork();
          setModalAction({
               ...modalAction,
               add: true,
          });
     };

     // for data Broker
     const [dataOrganisasi, setDataOrganisasi] = useState<any>({
          ORGANIZATION_PARENT_ID: "",
          ORGANIZATION_NAME: "",
          ORGANIZATION_MAPPING: "",
     });

     // for if success add Broker
     const handleSuccessAddBroker = async (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataOrganisasi({
                    ORGANIZATION_PARENT_ID: "",
                    ORGANIZATION_NAME: "",
                    ORGANIZATION_MAPPING: "",
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
          textTitle: "Detail Broker",
     });

     // for edit
     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          setTextTitle({
               textTitle: "Edit Broker",
          });
          setTextButton({
               textButton: "detail",
          });
     };

     const [dataEditBroker, setDataEditBroker] = useState<any>([]);
     const handleSuccessEditBroker = async (message: any) => {
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

     // for double click data Broker
     const handleDoubleClick = async (data: any) => {
          setDataEditBroker({
               THE_INSURED_ID: data.THE_INSURED_ID,
               THE_INSURED_NAME: data.THE_INSURED_NAME,
               THE_INSURED_ID_NUMBER: data.THE_INSURED_ID_NUMBER,
               THE_INSURED_DATE_OF_BIRTH: data.THE_INSURED_DATE_OF_BIRTH,
               THE_INSURED_GENDER: data.THE_INSURED_GENDER,
               THE_INSURED_WORK: data.THE_INSURED_WORK,
               THE_INSURED_WORK_PLACE: data.THE_INSURED_WORK_PLACE,
               THE_INSURED_LAMA_BEKERJA: data.THE_INSURED_LAMA_BEKERJA,
               THE_INSURED_JABATAN: data.THE_INSURED_JABATAN,
               THE_INSURED_CIF: data.THE_INSURED_CIF,
               DOCUMENT_KTP_ID: data.documentktp,
          });
          setModalAction({
               ...modalAction,
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Broker",
          });
          getDataWork();
     };

     // for Breadcrumbs
     const forBreadcrumbs = [{ name: "Broker", href: "#", current: true }];

     return (
          <AuthenticatedLayout user={auth.user} header={"Broker"}>
               <Head title={"Broker"} />
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
                    title={"Tambah Broker"}
                    url={`/addBroker`}
                    data={dataOrganisasi}
                    onSuccess={handleSuccessAddBroker}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    body={
                         <>
                              <AddBroker
                                   setDataOrganisasi={setDataOrganisasi}
                                   dataOrganisasi={dataOrganisasi}
                              />
                         </>
                    }
               />
               {/* end for modal add nambah */}

               {/* for modal detail edit Broker */}
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
                    url={`/editBroker/${dataEditBroker.THE_INSURED_ID}`}
                    data={dataEditBroker}
                    onSuccess={handleSuccessEditBroker}
                    method={"post"}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[55%]"
                    }
                    submitButtonName={
                         textButton?.textButton === "Edit" ? "" : "Submit"
                    }
                    body={
                         <>
                              {/* <DetailEditBroker
                                   textButton={textButton}
                                   dataEditBroker={dataEditBroker}
                                   setDataEditBroker={setDataEditBroker}
                                   dataWork={dataWork}
                              /> */}
                         </>
                    }
               />
               {/* end for modal detail edit Broker */}

               {/* section master Broker */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-primary-adele">
                                   Broker
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>
                         <div className="flex gap-2">
                              <div
                                   className="p-3 bg-primary-adele text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-primary-hover-adele"
                                   onClick={() => {
                                        handleClickAddBroker();
                                   }}
                              >
                                   <span>Tambah Broker</span>
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
                                        placeholder="Search for Nama Broker"
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
                                             name: "Nama Broker",
                                             selector: (row: any) =>
                                                  row.ORGANIZATION_NAME,
                                             sortable: true,
                                             //  width: "230px",
                                        },
                                   ]}
                                   url={"/getOrganisasi"}
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
