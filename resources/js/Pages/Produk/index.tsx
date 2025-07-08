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
// import AddProduk from "./AddProduk";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
// import DetailEditProduk from "./DetailEditProduk";
import Breadcrumbs from "@/Components/Breadcrumbs";
import AddProdukAsuransi from "./AddProdukAsuransi";
import DetailEditProdukAsuransi from "./DetailEditProdukAsuransi";

export default function MasterProduk({ auth }: any) {
     const {
          comboUnderwriting,
          dataParameterProduk,
          dataParameterCategory,
          arrRateManageId,
     }: any = usePage().props;

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for refresh data table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");

     // for search datatable
     const [search, setSearch] = useState<any>("");

     // for modal action
     const [modalAction, setModalAction] = useState<any>({
          add: false,
          detail: false,
     });

     // handle action add Produk Asuransi
     const handleClickAddProdukAsuransi = async () => {
          setModalAction({
               ...modalAction,
               add: true,
          });
     };

     // for data Produk
     const [dataProdukAsuransi, setDataProdukAsuransi] = useState<any>({
          PRODUK_ASURANSI_NAME: "",
          UNDERWRITING_ID: "",
          RATE_MANAGE_ID: "",
          UPLOAD_FILE_PRODUK: "",
          PARAMETER_PRODUK_ID: "",
          PARAMETER_CATEGORY_ID: "",
          DATA_MEKANISME_PRODUK: [
               {
                    PARAMETER_PRODUK_ID: "",
                    PARAMETER_CATEGORY_ID: "",
               },
          ],
     });

     // for if success add Produk Asuransi
     const handleSuccessAddProdukAsuransi = async (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataProdukAsuransi({
                    PRODUK_ASURANSI_NAME: "",
                    UNDERWRITING_ID: "",
                    UPLOAD_FILE_PRODUK: "",
                    DATA_MEKANISME_PRODUK: [
                         {
                              PARAMETER_PRODUK_ID: "",
                              PARAMETER_CATEGORY_ID: "",
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

     // for Edit Button
     const [textButton, setTextButton] = useState<any>({
          textButton: "Edit",
     });

     // for text title
     const [textTitle, setTextTitle] = useState<any>({
          textTitle: "Detail Produk",
     });

     // for edit
     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          setTextTitle({
               textTitle: "Edit Produk Asuransi",
          });
          setTextButton({
               textButton: "detail",
          });
     };

     const [dataEditProdukAsuransi, setDataEditProdukAsuransi] = useState<any>({
          PRODUK_ASURANSI_ID: "",
          UNDERWRITING_ID: "",
          PRODUK_ASURANSI_NAME: "",
          DATA_MEKANISME_PRODUK: "",
          PRODUK_ASURANSI_DOCUMENT_ID: "",
          DOCUMENT: "",
          UPLOAD_FILE_PRODUK: "",
     });
     const handleSuccessEditProdukAsuransi = async (message: any) => {
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

     // for double click data Produk
     const handleDoubleClick = async (data: any) => {
          setDataEditProdukAsuransi({
               PRODUK_ASURANSI_ID: data.PRODUK_ASURANSI_ID,
               UNDERWRITING_ID: data.UNDERWRITING_ID,
               PRODUK_ASURANSI_NAME: data.PRODUK_ASURANSI_NAME,
               DATA_MEKANISME_PRODUK: data.data_mekanisme_produk,
               PRODUK_ASURANSI_DOCUMENT_ID: data.PRODUK_ASURANSI_DOCUMENT_ID,
               DOCUMENT: data.document_template,
               UPLOAD_FILE_PRODUK: "",
          });
          setModalAction({
               ...modalAction,
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Produk Asuransi",
          });
     };

     // for Breadcrumbs
     const forBreadcrumbs = [
          { name: "Produk Asuransi", href: "#", current: true },
     ];

     return (
          <AuthenticatedLayout user={auth.user} header={"Produk Asuransi"}>
               <Head title={"Produk Asuransi"} />
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
                    title={"Tambah Produk Asuransi"}
                    url={`/addProduk`}
                    data={dataProdukAsuransi}
                    onSuccess={handleSuccessAddProdukAsuransi}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                    }
                    body={
                         <>
                              <AddProdukAsuransi
                                   setDataProdukAsuransi={setDataProdukAsuransi}
                                   dataProdukAsuransi={dataProdukAsuransi}
                                   comboUnderwriting={comboUnderwriting}
                                   dataParameterProduk={dataParameterProduk}
                                   dataParameterCategory={dataParameterCategory}
                                   arrRateManageId={arrRateManageId}
                              />
                         </>
                    }
               />
               {/* end for modal add nambah */}

               {/* for modal detail edit Produk */}
               <ModalToAction
                    show={modalAction.detail}
                    onClose={() => {
                         setModalAction({
                              ...modalAction,
                              detail: false,
                         });
                         setDataEditProdukAsuransi({
                              PRODUK_ASURANSI_ID: "",
                              UNDERWRITING_ID: "",
                              PRODUK_ASURANSI_NAME: "",
                              DATA_MEKANISME_PRODUK: [],
                              PRODUK_ASURANSI_DOCUMENT_ID: "",
                              DOCUMENT: "",
                              UPLOAD_FILE_PRODUK: "",
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    title={textTitle.textTitle}
                    url={`/editProduk/${dataEditProdukAsuransi.PRODUK_ASURANSI_ID}`}
                    data={dataEditProdukAsuransi}
                    onSuccess={handleSuccessEditProdukAsuransi}
                    method={"post"}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[90%]"
                    }
                    submitButtonName={
                         textButton?.textButton === "Edit" ? "" : "Submit"
                    }
                    body={
                         <>
                              <DetailEditProdukAsuransi
                                   setDataEditProdukAsuransi={
                                        setDataEditProdukAsuransi
                                   }
                                   dataEditProdukAsuransi={
                                        dataEditProdukAsuransi
                                   }
                                   textButton={textButton}
                                   comboUnderwriting={comboUnderwriting}
                                   dataParameterCategory={dataParameterCategory}
                                   dataParameterProduk={dataParameterProduk}
                              />
                              {/* <DetailEditProduk
                                   textButton={textButton}
                                   dataEditProdukAsuransi={dataEditProdukAsuransi}
                                   setDataEditProdukAsuransi={setDataEditProdukAsuransi}
                                   dataWork={dataWork}
                              /> */}
                         </>
                    }
               />
               {/* end for modal detail edit Produk */}

               {/* section master Produk */}
               <section>
                    <section>
                         {/* Header */}
                         <div className="flex justify-between items-center">
                              <div className="">
                                   <span className="text-lg font-bold text-primary-adele">
                                        Produk Asuransi
                                   </span>
                                   <Breadcrumbs
                                        forBreadcrumbs={forBreadcrumbs}
                                   />
                              </div>
                              <div className="flex gap-2">
                                   <div
                                        className="p-3 bg-primary-adele text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-primary-hover-adele"
                                        onClick={() => {
                                             handleClickAddProdukAsuransi();
                                        }}
                                   >
                                        <span>Tambah Produk Asuransi</span>
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
                                             className="ring-1 ring-primary-adele focus:ring-ring-adele"
                                             placeholder="Search for Nama Produk Asuransi dll"
                                             value={search}
                                             onChange={(e: any) => {
                                                  setSearch(e.target.value);
                                             }}
                                             onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                       setRefreshTrigger(
                                                            "success"
                                                       );
                                                       setTimeout(() => {
                                                            setRefreshTrigger(
                                                                 ""
                                                            );
                                                       }, 1000);
                                                  }
                                             }}
                                             search={search}
                                             setSearch={setSearch}
                                             setRefreshTrigger={
                                                  setRefreshTrigger
                                             }
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
                                                  name: "Nama Produk Asuransi",
                                                  selector: (row: any) =>
                                                       row.PRODUK_ASURANSI_NAME,
                                                  sortable: true,
                                                  //  width: "230px",
                                             },
                                        ]}
                                        url={"/getProdukAsuransi"}
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
               </section>
               {/* end section master nasaah */}
          </AuthenticatedLayout>
     );
}
