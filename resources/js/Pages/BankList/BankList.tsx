import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import DataTables from "@/Components/DataTables";
import { FormEvent, useState } from "react";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import AddBankList from "./AddBankList";
import ToastMessage from "@/Components/ToastMessage";
import TextInput from "@/Components/TextInput";
import ModalToAction from "@/Components/Modal/ModalToAction";
import DetailEditBankList from "./DetailEditBankList";

export default function BankList({ auth }: any) {
     const [modalBank, setModalBank] = useState<any>({
          add: false,
          edit: false,
          detail: false,
     });

     // for variabel add Bank List
     const [dataBank, setDataBank] = useState<any>({
          BANK_LIST_NAME: "",
          BANK_LIST_FEE_BASE_BANK: "",
          BANK_LIST_SLUG: "",
          BANK_LIST_LOGO: "",
          BANK_LIST_NOTE: "",
          BANK_LIST_CREATED_BY: "",
          BANK_LIST_CREATED_DATE: "",
     });
     // end for variabel add Bank List

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for success alert
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for success alert

     // for success when add Bank List
     const handleSuccessAddBankList = (message: string) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setRefreshTrigger(message[0]);
               setDataBank({
                    BANK_LIST_NAME: "",
                    BANK_LIST_FEE_BASE_BANK: "",
                    BANK_LIST_SLUG: "",
                    BANK_LIST_LOGO: "",
                    BANK_LIST_NOTE: "",
                    BANK_LIST_CREATED_BY: "",
                    BANK_LIST_CREATED_DATE: "",
               });
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setTimeout(() => {
                    setRefreshTrigger("");
               }, 1000);
          }
     };
     // end for success when add Bank List

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
          textTitle: "Detail Bank List",
     });

     // for edit
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

     // VARIABEL FOR DATA BANK EDIT
     const [dataEditBank, setDataEditBank] = useState<any>({
          BANK_LIST_NAME: "",
          BANK_LIST_FEE_BASE_BANK: "",
          BANK_LIST_SLUG: "",
          BANK_LIST_LOGO: "",
          BANK_LIST_NOTE: "",
          BANK_LIST_CREATED_BY: "",
          BANK_LIST_CREATED_DATE: "",
     });

     // for double click bank name
     const handleDoubleClick = async (data: any) => {
          setDataEditBank({
               BANK_LIST_ID: data.BANK_LIST_ID,
               BANK_LIST_NAME: data.BANK_LIST_NAME,
               BANK_LIST_FEE_BASE_BANK: data.BANK_LIST_FEE_BASE_BANK,
               BANK_LIST_LOGO: "",
          });
          setModalBank({
               add: false,
               edit: false,
               detail: true,
          });
          setTextButton({
               textButton: "Edit",
          });
          setTextTitle({
               textTitle: "Detail Bank List",
          });
     };

     // for handle success edit bank list
     const handleSuccessEditBankList = (message: string) => {
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

     return (
          <AuthenticatedLayout user={auth.user} header={"Bank List"}>
               <Head title={"Bank List"} />

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
                    show={modalBank.add}
                    onClose={() =>
                         setModalBank({
                              add: false,
                              edit: false,
                              detail: false,
                         })
                    }
                    title={"Add Bank List"}
                    url={`/addBankList`}
                    data={dataBank}
                    onSuccess={handleSuccessAddBankList}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[40%]"
                    }
                    body={
                         <AddBankList
                              dataBank={dataBank}
                              setDataBank={setDataBank}
                         />
                    }
               />
               {/* End Modal Add */}

               {/* Modal Detail */}
               <ModalToAction
                    show={modalBank.detail}
                    onClose={() => {
                         setModalBank({
                              add: false,
                              edit: false,
                              detail: false,
                         });
                    }}
                    buttonEdit={textButton}
                    actionEdit={actionEdit}
                    title={textTitle.textTitle}
                    url={`/editBankList/${dataEditBank.BANK_LIST_ID}`}
                    data={dataEditBank}
                    onSuccess={handleSuccessEditBankList}
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
                              <DetailEditBankList
                                   textButton={textButton}
                                   dataEditBank={dataEditBank}
                                   setDataEditBank={setDataEditBank}
                              />
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

               {/* SECTION BANK LIST */}
               <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                         <div className="bg-white mb-4 rounded-md p-4 gap-2">
                              <div
                                   className="bg-primary-adele w-full flex justify-center p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => {
                                        setModalBank({
                                             add: true,
                                             edit: false,
                                             detail: false,
                                        });
                                   }}
                              >
                                   <span>Add Bank</span>
                              </div>
                         </div>
                         <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                              <TextInput
                                   type="text"
                                   className="mt-2 ring-1"
                                   placeholder="Search Bank Name"
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
                    <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                         <DataTables
                              columns={[
                                   {
                                        name: "Bank Name",
                                        selector: (row: any) =>
                                             row.BANK_LIST_NAME,
                                        sortable: true,
                                   },
                                   {
                                        name: "Logo Bank",
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
                                        name: "Fee Bank (% of premium)",
                                        selector: (row: any) =>
                                             row?.BANK_LIST_FEE_BASE_BANK?.toFixed(
                                                  2
                                             ),
                                        sortable: true,
                                   },
                              ]}
                              url={"/getBankList"}
                              search={searchBankName}
                              refreshTrigger={refreshTrigger}
                              handleDoubleClick={handleDoubleClick}
                         />
                    </div>
               </div>
               {/* END SECTION BANK LIST */}
          </AuthenticatedLayout>
     );
}
