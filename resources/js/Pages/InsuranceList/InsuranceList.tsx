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
import AddInsuranceList from "./AddInsuranceList";
import DetailEditInsuranceList from "./DetailEditInsurance";
import TextSearch from "@/Components/TextSearch";
import Breadcrumbs from "@/Components/Breadcrumbs";
import axios from "axios";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import AddInsuranceBundling from "./AddInsuranceBundling";
import DetailEditInsuranceBundling from "./DetailEditInsuranceBundling";
import ModalInsuranceBundling from "./ModalInsuranceBundling";

export default function InsuranceList({ auth }: any) {
     const { comboInsurance, comboUnderwriting }: any = usePage().props;

     const [modalInsurance, setModalInsurance] = useState<any>({
          add: false,
          edit: false,
          detail: false,
          bundling: false,
     });

     // for search datatable
     const [search, setSearch] = useState<any>("");

     // for variabel add Insurance List
     const [dataInsurance, setDataInsurance] = useState<any>({
          INSURANCE_NAME: "",
          INSURANCE_TYPE_ID: null,
          PRODUK_ASURANSI_ID: null,
          INSURANCE_PARENT_ID: null,
          UNDERWRITING_ID: null,
          INSURANCE_CODE: "",
          INSURANCE_SLUG: "",
          INSURANCE_LOGO: "",
          INSURANCE_NOTE: "",
          INSURANCE_CREATED_BY: "",
          INSURANCE_CREATED_DATE: "",
     });
     // end for variabel add Insurance List

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for success alert
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for success alert

     // for insurance type
     const [insuranceType, setInsuranceType] = useState<any>([]);
     const getInsuranceType = async () => {
          await axios
               .post(`/getInsuranceTypeProduct`, {})
               .then((res) => {
                    setInsuranceType(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // for get insurance bundling
     const [insuranceTypeBundling, setInsuranceTypeBundling] = useState<any>(
          []
     );
     const getInsuranceTypeBundling = async () => {
          await axios
               .post(`/getInsuranceTypeBundling`, {})
               .then((res) => {
                    setInsuranceTypeBundling(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // for insurance type
     const [produkAsuransi, setProdukAsuransi] = useState<any>([]);
     const getProdukAsuransi = async () => {
          await axios
               .post(`/getProdukAsuransi`, {})
               .then((res) => {
                    setProdukAsuransi(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // for success when add Insurance List
     const handleSuccessAddInsuranceList = (message: string) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataInsurance({
                    INSURANCE_NAME: "",
                    INSURANCE_TYPE_ID: null,
                    PRODUK_ASURANSI_ID: null,
                    INSURANCE_PARENT_ID: null,
                    UNDERWRITING_ID: null,
                    INSURANCE_CODE: "",
                    INSURANCE_SLUG: "",
                    INSURANCE_LOGO: "",
                    INSURANCE_NOTE: "",
                    INSURANCE_CREATED_BY: "",
                    INSURANCE_CREATED_DATE: "",
               });
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setTimeout(() => {
                    setRefreshTrigger("");
               }, 1000);
          }
     };
     // end for success when add Insurance List

     // for search bank name
     const [searchInsuranceName, setSearchInsuranceName] = useState<any>({
          INSURANCE_NAME: "",
     });

     // for Edit Button
     const [textButton, setTextButton] = useState<any>({
          textButton: "Edit",
     });

     // for text title
     const [textTitle, setTextTitle] = useState<any>({
          textTitle: "Detail Insurance List",
     });

     // for edit
     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          // alert("aloo");
          setTextTitle({
               textTitle: "Edit Insurance List",
          });
          setTextButton({
               textButton: "Detail",
          });
     };

     // VARIABEL FOR DATA INSURANCE EDIT
     const [dataEditInsurance, setDataEditInsurance] = useState<any>({
          INSURANCE_NAME: "",
          INSURANCE_TYPE_ID: null,
          PRODUK_ASURANSI_ID: null,
          INSURANCE_PARENT_ID: null,
          UNDERWRITING_ID: null,
          INSURANCE_CODE: "",
          INSURANCE_SLUG: "",
          INSURANCE_LOGO: "",
          INSURANCE_NOTE: "",
          INSURANCE_CREATED_BY: "",
          INSURANCE_CREATED_DATE: "",
     });

     // VARIABEL FOR INSURANCE BUNDLING
     const [dataInsuranceBundling, setDataInsuranceBundling] = useState<any>({
          INSURANCE_NAME: "",
          INSURANCE_TYPE_ID: null,
          INSURANCE_BUNDLING_ID: null,
          INSURANCE_LEADER_BUNDLING: null,
          PRODUK_ASURANSI_ID: null,
          UNDERWRITING_ID: null,
          INSURANCE_SLUG: "",
          INSURANCE_CREATED_BY: "",
          INSURANCE_CREATED_DATE: "",
     });

     // VARIABEL FOR DETAIL INSURANCE BUNDLING
     const [dataEditInsuranceBundling, setDataEditInsuranceBundling] =
          useState<any>({
               INSURANCE_NAME: "",
               JENIS_ASURANSI_ID: null,
               t_insurance_bundling: null,
               t_insurance_produk_bundling: null,
          });

     const [insuranceBundling, setInsuranceBundling] = useState<any>([]);
     const [insuranceBundlingProduk, setInsuranceBundlingProduk] =
          useState<any>([]);

     // for double click bank name
     const handleDoubleClick = async (data: any) => {
          getInsuranceType();
          getProdukAsuransi();
          setDataEditInsurance({
               INSURANCE_ID: data.INSURANCE_ID,
               INSURANCE_NAME: data.INSURANCE_NAME,
               INSURANCE_TYPE_ID: data.INSURANCE_TYPE_ID,
               PRODUK_ASURANSI_ID: data.PRODUK_ASURANSI_ID,
               UNDERWRITING_ID: data.UNDERWRITING_ID,
               INSURANCE_PARENT_ID: data.INSURANCE_PARENT_ID,
               INSURANCE_CODE: data.INSURANCE_CODE,
               INSURANCE_LOGO: "",
          });
          setDataEditInsuranceBundling({
               INSURANCE_NAME: data.INSURANCE_NAME,
               JENIS_ASURANSI_ID: data.t_insurance_bundling,
               t_insurance_bundling: null,
               t_insurance_produk_bundling: null,
          });
          setInsuranceBundling(data.t_insurance_bundling);
          setInsuranceBundlingProduk(data.t_insurance_produk_bundling);
          setModalInsurance({
               add: false,
               edit: false,
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          if (
               data.t_insurance_bundling.length === 0 &&
               data.t_insurance_produk_bundling.length === 0
          ) {
               setTextTitle({
                    textTitle: "Detail Insurance List",
               });
          } else {
               setTextTitle({
                    textTitle: "Detail Insurance Bundling",
               });
          }
     };

     // for handle success edit Insurance List
     const handleSuccessEditInsuranceList = (message: string) => {
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
     // end for handle success edit Insurance List

     // for modal insurance bundling
     const [modalBundling, setModalBundling] = useState<any>({
          modal: false,
     });

     // for Breadcrumbs
     const forBreadcrumbs = [{ name: "Asuransi", href: "#", current: true }];
     return (
          <AuthenticatedLayout user={auth.user} header={"Asuransi"}>
               <Head title={"Asuransi"} />

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
                    show={modalInsurance.add}
                    onClose={() =>
                         setModalInsurance({
                              add: false,
                              edit: false,
                              detail: false,
                              bundling: false,
                         })
                    }
                    title={"Add Insurance List"}
                    url={`/addInsuranceList`}
                    data={dataInsurance}
                    onSuccess={handleSuccessAddInsuranceList}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                    }
                    body={
                         <AddInsuranceList
                              dataInsurance={dataInsurance}
                              setDataInsurance={setDataInsurance}
                              insuranceType={insuranceType}
                              produkAsuransi={produkAsuransi}
                              comboInsurance={comboInsurance}
                              comboUnderwriting={comboUnderwriting}
                         />
                    }
               />
               {/* End Modal Add */}

               {/* modal add insurance bundling */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalInsurance.bundling}
                    onClose={() =>
                         setModalInsurance({
                              add: false,
                              edit: false,
                              detail: false,
                              bundling: false,
                         })
                    }
                    title={"Add Insurance Bundling"}
                    url={`/addInsuranceBundling`}
                    data={dataInsuranceBundling}
                    onSuccess={handleSuccessAddInsuranceList}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[45%]"
                    }
                    body={
                         <AddInsuranceBundling
                              dataInsuranceBundling={dataInsuranceBundling}
                              setDataInsuranceBundling={
                                   setDataInsuranceBundling
                              }
                              insuranceType={insuranceTypeBundling}
                              produkAsuransi={produkAsuransi}
                              comboInsurance={comboInsurance}
                              comboUnderwriting={comboUnderwriting}
                         />
                    }
               />
               {/* end modal add insurance bundling */}

               {/* Modal Detail */}
               <ModalToAction
                    show={modalInsurance.detail}
                    onClose={() => {
                         setModalInsurance({
                              add: false,
                              edit: false,
                              detail: false,
                              bundling: false,
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    title={textTitle.textTitle}
                    url={`/editInsuranceList/${dataEditInsurance.INSURANCE_ID}`}
                    data={dataEditInsurance}
                    onSuccess={handleSuccessEditInsuranceList}
                    method={"post"}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[50%]"
                    }
                    submitButtonName={
                         textButton?.textButton === "Edit" ? "" : "Submit"
                    }
                    body={
                         <>
                              {insuranceBundling.length === 0 &&
                              insuranceBundlingProduk.length === 0 ? (
                                   <DetailEditInsuranceList
                                        textButton={textButton}
                                        dataEditInsurance={dataEditInsurance}
                                        setDataEditInsurance={
                                             setDataEditInsurance
                                        }
                                        insuranceType={insuranceType}
                                        produkAsuransi={produkAsuransi}
                                        comboInsurance={comboInsurance}
                                        comboUnderwriting={comboUnderwriting}
                                   />
                              ) : (
                                   <DetailEditInsuranceBundling
                                        textButton={textButton}
                                        dataEditInsurance={dataEditInsurance}
                                        setDataEditInsurance={
                                             setDataEditInsurance
                                        }
                                        insuranceType={insuranceType}
                                        produkAsuransi={produkAsuransi}
                                        comboInsurance={comboInsurance}
                                        comboUnderwriting={comboUnderwriting}
                                   />
                              )}

                              {/* <DetailReminder
                            dataDetailReminder={dataDetailReminder}
                            setDataDetailReminder={setDataDetailReminder}
                            textButton={textButton}
                            idReminder={idReminder.idReminder}
                        /> */}
                         </>
                    }
               />
               {/* End Modal Detail */}

               {/* Modal Bundling Insurance */}
               <ModalToAction
                    show={modalBundling.modal}
                    onClose={() => {
                         setModalBundling({
                              modal: false,
                         });
                    }}
                    buttonEdit={""}
                    actionEdit={""}
                    title={"Asuransi Gabungan"}
                    url={``}
                    data={""}
                    onSuccess={""}
                    method={""}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                    }
                    submitButtonName={""}
                    body={
                         <>
                              <ModalInsuranceBundling
                                   insuranceType={insuranceTypeBundling}
                                   produkAsuransi={produkAsuransi}
                                   comboInsurance={comboInsurance}
                                   comboUnderwriting={comboUnderwriting}
                                   setIsSuccess={setIsSuccess}
                              />
                         </>
                    }
               />
               {/* End Modal Bundling Insurance */}

               {/* SECTION Insurance List */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-primary-adele">
                                   Asuransi
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>
                         <div className="flex gap-2">
                              <div
                                   className="p-3 bg-primary-adele text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-primary-hover-adele"
                                   onClick={() => {
                                        setModalBundling({
                                             modal: true,
                                        });
                                        // setModalInsurance({
                                        //      add: true,
                                        //      edit: false,
                                        //      detail: false,
                                        //      bundling: true,
                                        // });
                                        getInsuranceTypeBundling();
                                        getProdukAsuransi();
                                   }}
                              >
                                   <span>Asuransi Gabungan</span>
                              </div>
                              <div
                                   className="p-3 bg-primary-adele text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-primary-hover-adele"
                                   onClick={() => {
                                        setModalInsurance({
                                             add: true,
                                             edit: false,
                                             detail: false,
                                             bundling: false,
                                        });
                                        getInsuranceType();
                                        getProdukAsuransi();
                                   }}
                              >
                                   <span>Tambah Asuransi</span>
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
                                        placeholder="Search for Nama Asuransi, dll"
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
                                             name: "Insurance Name",
                                             selector: (row: any) =>
                                                  row.INSURANCE_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Insurance Type",
                                             selector: (row: any) =>
                                                  row.JENIS_ASURANSI_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Logo Insurance",
                                             selector: (row: any) =>
                                                  window.location.origin +
                                                  "/storage/" +
                                                  row.document
                                                       ?.DOCUMENT_DIRNAME +
                                                  row.document
                                                       ?.DOCUMENT_FILENAME,
                                             sortable: true,
                                             cell: (row: any) => (
                                                  <img
                                                       src={
                                                            window.location
                                                                 .origin +
                                                            "/storage/" +
                                                            row.document
                                                                 ?.DOCUMENT_DIRNAME +
                                                            row.document
                                                                 ?.DOCUMENT_FILENAME
                                                       }
                                                       style={{
                                                            width: 50,
                                                            height: 50,
                                                            objectFit:
                                                                 "contain",
                                                       }} // Set style to make it look good
                                                  />
                                             ),
                                        },
                                        {
                                             name: "Insurance Code",
                                             selector: (row: any) =>
                                                  row.INSURANCE_CODE,
                                             sortable: true,
                                        },
                                   ]}
                                   url={"/getInsuranceList"}
                                   search={search}
                                   refreshTrigger={refreshTrigger}
                                   handleDoubleClick={handleDoubleClick}
                              />
                         </div>
                         {/* End Content */}
                    </div>
                    {/* end body section */}
               </section>
               {/* <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                         <div className="bg-white mb-4 rounded-md p-4 gap-2">
                              <div
                                   className="bg-primary-adele w-full flex justify-center p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => {
                                        setModalInsurance({
                                             add: true,
                                             edit: false,
                                             detail: false,
                                             bundling: false,
                                        });
                                   }}
                              >
                                   <span>Add Insurance</span>
                              </div>
                         </div>
                         <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                              <TextInput
                                   type="text"
                                   className="mt-2 ring-1"
                                   placeholder="Search Insurance Name"
                                   value={searchInsuranceName.INSURANCE_NAME}
                                   onChange={(e) => {
                                        setSearchInsuranceName({
                                             ...searchInsuranceName,
                                             INSURANCE_NAME: e.target.value,
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
                                        className="bg-primary-adele text-white p-2 w-fit rounded-md text-center hover:bg-primary-hover-adele cursor-pointer"
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
                    <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0 content-body">
                         <DataTables
                              columns={[
                                   {
                                        name: "Insurance Name",
                                        selector: (row: any) =>
                                             row.INSURANCE_NAME,
                                        sortable: true,
                                   },
                                   {
                                        name: "Logo Insurance",
                                        selector: (row: any) =>
                                             window.location.origin +
                                             "/storage/" +
                                             row.document?.DOCUMENT_DIRNAME +
                                             row.document?.DOCUMENT_FILENAME,
                                        sortable: true,
                                        cell: (row: any) => (
                                             <img
                                                  src={
                                                       window.location.origin +
                                                       "/storage/" +
                                                       row.document
                                                            ?.DOCUMENT_DIRNAME +
                                                       row.document
                                                            ?.DOCUMENT_FILENAME
                                                  }
                                                  style={{
                                                       width: 50,
                                                       height: 50,
                                                       objectFit: "contain",
                                                  }} // Set style to make it look good
                                             />
                                        ),
                                   },
                                   {
                                        name: "Insurance Code",
                                        selector: (row: any) =>
                                             row.INSURANCE_CODE,
                                        sortable: true,
                                   },
                              ]}
                              url={"/getInsuranceList"}
                              search={searchInsuranceName.INSURANCE_NAME}
                              refreshTrigger={refreshTrigger}
                              handleDoubleClick={handleDoubleClick}
                         />
                    </div>
               </div> */}
               {/* END SECTION Insurance List */}
          </AuthenticatedLayout>
     );
}
