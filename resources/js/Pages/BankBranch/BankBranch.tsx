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
import AddBankBranch from "./AddBankBracnh";
import DetailEditBankBranch from "./DetailEditBankBranch";
import TextSearch from "@/Components/TextSearch";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

export default function BankBranch({ auth }: any) {
     // for search bank name
     const [searchBankBranch, setSearchBankBranch] = useState<any>({
          BANK_BRANCH_NAME: "",
     });

     const [modalBankBranch, setModalBankBranch] = useState<any>({
          add: false,
          edit: false,
          detail: false,
     });

     const [dataBankBranch, setDataBankBranch] = useState<any>({
          BANK_BRANCH_PARENT_ID: "",
          BANK_BRANCH_NAME: "",
          BANK_BRANCH_NAME_AO: "",
          BANK_BRANCH_CODE: "",
          BANK_BRANCH_ADDRESS: "",
          BANK_BRANCH_PHONENUMBER: "",
          BANK_BRANCH_KANWIL: "",
     });

     // for success alert
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for success alert

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for search datatable
     const [search, setSearch] = useState<any>("");

     // for success add bankbranch
     const handleSuccessAddBankBranch = (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataBankBranch({
                    BANK_BRANCH_PARENT_ID: "",
                    BANK_BRANCH_NAME: "",
                    BANK_BRANCH_NAME_AO: "",
                    BANK_BRANCH_CODE: "",
                    BANK_BRANCH_ADDRESS: "",
                    BANK_BRANCH_PHONENUMBER: "",
                    BANK_BRANCH_KANWIL: "",
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
          textTitle: "Detail Bank Branch",
     });

     // for edit
     const actionEdit = async (e: FormEvent) => {
          e.preventDefault();
          // alert("aloo");
          setTextTitle({
               textTitle: "Edit Bank Branch",
          });
          setTextButton({
               textButton: "detail",
          });
     };

     // for data edit dan detail bank branch
     const [dataEditDetailBankBranch, setDataEditDetailBankBranch] =
          useState<any>([]);

     // for handle double click
     const handleDoubleClickBankBranch = async (data: any) => {
          setDataEditDetailBankBranch(data);
          setModalBankBranch({
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Bank Branch",
          });
     };

     const handleSuccessEditBankBranch = (message: any) => {
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

     const handleClickAddBankBranch = async () => {
          setModalBankBranch({
               add: true,
               edit: false,
               detail: false,
          });
     };

     // for Breadcrumbs
     const forBreadcrumbs = [{ name: "Bank Branch", href: "#", current: true }];

     return (
          <AuthenticatedLayout user={auth.user} header={"Bank Branch"}>
               <Head title={"Bank Branch"} />

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
                    show={modalBankBranch.add}
                    onClose={() =>
                         setModalBankBranch({
                              add: false,
                              edit: false,
                              detail: false,
                         })
                    }
                    title={"Add Bank Branch"}
                    url={`/addBankBranch`}
                    data={dataBankBranch}
                    onSuccess={handleSuccessAddBankBranch}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    body={
                         <>
                              <AddBankBranch
                                   setDataBankBranch={setDataBankBranch}
                                   dataBankBranch={dataBankBranch}
                              />
                         </>
                    }
               />
               {/* End Modal Add */}

               {/* Modal Detail */}
               <ModalToAction
                    show={modalBankBranch.detail}
                    onClose={() => {
                         setModalBankBranch({
                              add: false,
                              edit: false,
                              detail: false,
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    title={textTitle.textTitle}
                    url={`/editBankBranch/${dataEditDetailBankBranch.BANK_BRANCH_ID}`}
                    data={dataEditDetailBankBranch}
                    onSuccess={handleSuccessEditBankBranch}
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
                              <DetailEditBankBranch
                                   textButton={textButton}
                                   dataEditDetailBankBranch={
                                        dataEditDetailBankBranch
                                   }
                                   setDataEditDetailBankBranch={
                                        setDataEditDetailBankBranch
                                   }
                              />
                         </>
                    }
               />
               {/* End Modal Detail */}

               {/* FOR SECTION BANK BRANCH */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-[#0A47FF]">
                                   Bank Branch
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>

                         <div
                              className="p-3 bg-[#0A47FF] text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-blue-800"
                              onClick={() => {
                                   handleClickAddBankBranch();
                              }}
                         >
                              <span>Tambah Cabang</span>
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
                                        placeholder="Search for Nama Cabang, Kode Cabang, Nama AO, dll"
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
                                             name: "Bank Branch Name",
                                             selector: (row: any) =>
                                                  row.BANK_BRANCH_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Bank Branch Name AO",
                                             selector: (row: any) =>
                                                  row.BANK_BRANCH_NAME_AO,
                                             sortable: true,
                                             width: "240px",
                                             cell: (row: any) => (
                                                  <span>
                                                       {row.BANK_BRANCH_NAME_AO ===
                                                            null ||
                                                       row.BANK_BRANCH_NAME_AO ===
                                                            ""
                                                            ? "-"
                                                            : row.BANK_BRANCH_NAME_AO}
                                                  </span>
                                             ),
                                        },
                                        {
                                             name: "Bank Branch Code",
                                             selector: (row: any) =>
                                                  row.BANK_BRANCH_CODE,
                                             sortable: true,
                                        },
                                        {
                                             name: "Bank Branch Address",
                                             selector: (row: any) =>
                                                  row.BANK_BRANCH_ADDRESS,
                                             sortable: true,
                                             cell: (row: any) => (
                                                  <span>
                                                       {row.BANK_BRANCH_ADDRESS ===
                                                            null ||
                                                       row.BANK_BRANCH_ADDRESS ===
                                                            ""
                                                            ? "-"
                                                            : row.BANK_BRANCH_ADDRESS}
                                                  </span>
                                             ),
                                        },
                                        {
                                             name: "Bank Branch Status",
                                             // selector: (row: any) => row.BANK_BRANCH_STATUS,
                                             sortable: true,
                                             cell: (row: any) => (
                                                  <span
                                                       style={{
                                                            color:
                                                                 row.BANK_BRANCH_STATUS ===
                                                                 1
                                                                      ? "green"
                                                                      : "red", // Warna hijau untuk Active dan merah untuk Inactive
                                                            fontWeight: "bold",
                                                       }}
                                                  >
                                                       {row.BANK_BRANCH_STATUS ===
                                                       1
                                                            ? "Active"
                                                            : "Inactive"}
                                                  </span>
                                             ),
                                        },
                                   ]}
                                   url={"/getBankBranchList"}
                                   search={search}
                                   refreshTrigger={refreshTrigger}
                                   handleDoubleClick={
                                        handleDoubleClickBankBranch
                                   }
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
                                   className="bg-[var(--dynamic-color)] w-full flex justify-center p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => {
                                        setModalBankBranch({
                                             add: true,
                                             edit: false,
                                             detail: false,
                                        });
                                   }}
                              >
                                   <span>Add Bank Branch</span>
                              </div>
                         </div>
                         <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                              <TextInput
                                   type="text"
                                   className="mt-2 ring-1"
                                   placeholder="Search Bank Branch Name"
                                   value={searchBankBranch.BANK_BRANCH_NAME}
                                   onChange={(e) => {
                                        setSearchBankBranch({
                                             ...searchBankBranch,
                                             BANK_BRANCH_NAME: e.target.value,
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
                    <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0 content-body">
                         <DataTables
                              columns={[
                                   {
                                        name: "Bank Branch Name",
                                        selector: (row: any) =>
                                             row.BANK_BRANCH_NAME,
                                        sortable: true,
                                   },
                                   {
                                        name: "Bank Branch Code",
                                        selector: (row: any) =>
                                             row.BANK_BRANCH_CODE,
                                        sortable: true,
                                   },
                                   {
                                        name: "Bank Branch Address",
                                        selector: (row: any) =>
                                             row.BANK_BRANCH_ADDRESS,
                                        sortable: true,
                                        cell: (row: any) => (
                                             <span>
                                                  {row.BANK_BRANCH_ADDRESS ===
                                                       null ||
                                                  row.BANK_BRANCH_ADDRESS === ""
                                                       ? "-"
                                                       : row.BANK_BRANCH_ADDRESS}
                                             </span>
                                        ),
                                   },
                                   {
                                        name: "Bank Branch Status",
                                        // selector: (row: any) => row.BANK_BRANCH_STATUS,
                                        sortable: true,
                                        cell: (row: any) => (
                                             <span
                                                  style={{
                                                       color:
                                                            row.BANK_BRANCH_STATUS ===
                                                            1
                                                                 ? "green"
                                                                 : "red", // Warna hijau untuk Active dan merah untuk Inactive
                                                       fontWeight: "bold",
                                                  }}
                                             >
                                                  {row.BANK_BRANCH_STATUS === 1
                                                       ? "Active"
                                                       : "Inactive"}
                                             </span>
                                        ),
                                   },
                              ]}
                              url={"/getBankBranchList"}
                              search={searchBankBranch.BANK_BRANCH_NAME}
                              refreshTrigger={refreshTrigger}
                              handleDoubleClick={handleDoubleClickBankBranch}
                         />
                    </div>
               </div> */}
               {/* END FOR SECTION BANK BRANCH */}
          </AuthenticatedLayout>
     );
}
