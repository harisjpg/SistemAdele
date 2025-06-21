import DataTables from "@/Components/DataTables";
import {
     ArrowDownTrayIcon,
     EyeIcon,
     PencilSquareIcon,
     PlusCircleIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import dateFormat from "dateformat";
import axios from "axios";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectTailwind from "react-tailwindcss-select";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import Loader from "@/Components/Loader";
import EditExtraPremi from "./EditExtraPremi";
import ViewPenawaran from "./viewPenawaran";

export default function ReviewPengajuanDebitur({
     auth,
     dataReviewPengajuan,
     arrDoc,
     setIsSuccess,
     isSuccess,
     getReviewPengajuanDebitur,
     urlOfferDetail,
     rateHistory,
     arrCatatan,
     setRefreshTrigger,
     setModalPengajuan,
     getOfferDetail,
     arrInsurance,
}: PropsWithChildren<{
     auth: any;
     dataReviewPengajuan: any;
     arrDoc: any;
     setIsSuccess: any;
     isSuccess: any;
     getReviewPengajuanDebitur: any;
     urlOfferDetail: any;
     rateHistory: any;
     arrCatatan: any;
     setRefreshTrigger: any;
     setModalPengajuan: any;
     getOfferDetail: any;
     arrInsurance: any;
}>) {
     console.log(arrInsurance, "<<< urlOfferDetail");

     const formatCurrency = new Intl.NumberFormat("default", {
          style: "currency",
          currency: "IDR",
     });
     // End Function Format Currency

     // for loader
     const [loaderFetch, setLoaderFetch] = useState<any>(false);

     const handleFileDownloadFile = async (idDocument: any) => {
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

     // for lihat file
     const handleFileViewFile = async (idDocument: any) => {
          await axios({
               url: `/downloadRate/${idDocument}`,
               method: "GET",
               responseType: "blob",
          })
               .then((response) => {
                    // console.log(response);

                    const url = window.URL.createObjectURL(response.data);
                    window.open(url, "_blank");
               })
               .catch((err) => {
                    console.log(err);
                    if (err.response.status === 404) {
                         alert("File not Found");
                    }
               });
     };
     // end for lihat file

     // for edit Document
     const [modalEditDocument, setModalEditDocument] = useState<any>({
          edit: false,
     });
     const [dataEditDocument, setDataEditDocument] = useState<any>([]);
     const handleEditDocument = async (e: FormEvent, dataDoc: any) => {
          e.preventDefault();

          setDataEditDocument(dataDoc);

          setModalEditDocument({
               edit: true,
          });
     };

     const handleSuccessEditDocument = async (message = "") => {
          setIsSuccess("");
          if (message != "") {
               getReviewPengajuanDebitur(message[1]);
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
          }
     };
     // end for edit document

     // for upload document
     const [dataUploadDocument, setDataUploadDocument] = useState<any>({
          OFFER_ID: dataReviewPengajuan.OFFER_ID,
          JENIS_DOCUMENT: "",
          UPLOAD_FILE: "",
     });
     const [modalUploadDocument, setModalUploadDocument] = useState<any>({
          modalUpload: false,
     });

     const [jenisDocument, setJenisDocument] = useState<any>([]);
     const getJenisDocumentTypeAll = async () => {
          await axios
               .post(`/getJenisDocumentTypeAll`, {})
               .then((res) => {
                    setJenisDocument(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const selectInsurance = jenisDocument?.map((query: any) => {
          return {
               value: query.DOCUMENT_TYPE_ID,
               label: query.DOCUMENT_TYPE_NAME,
          };
     });

     const selectDocumentCategory = jenisDocument
          ?.filter((filter: any) => filter.DOCUMENT_TYPE_ID.toString() === "7")
          ?.map((query: any) => {
               return {
                    value: query.DOCUMENT_TYPE_ID,
                    label: query.DOCUMENT_TYPE_NAME,
               };
          });

     const selectDocumentCategoryTolak = jenisDocument
          ?.filter((filter: any) => filter.DOCUMENT_TYPE_ID.toString() === "5")
          ?.map((query: any) => {
               return {
                    value: query.DOCUMENT_TYPE_ID,
                    label: query.DOCUMENT_TYPE_NAME,
               };
          });

     const handleUploadDocument = async (e: FormEvent) => {
          e.preventDefault();
          getJenisDocumentTypeAll();
          setModalUploadDocument({
               modalUpload: true,
          });
     };

     const handleSuccessUploadDocument = async (message = "") => {
          setIsSuccess("");
          if (message != "") {
               getReviewPengajuanDebitur(message[1]);
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
          }
     };
     // end for upload document

     //for tambah catatan
     const [modalCatatan, setModalCatatan] = useState<any>({
          add: false,
     });
     const [dataCatatan, setDataCatatan] = useState<any>({
          OFFER_ID: "",
          CATATAN_BROKER_ISI: "",
          CATATAN_BROKER_FOR: "",
     });
     const handleAddCatatan = async (e: FormEvent, dataFor: any) => {
          e.preventDefault();
          setDataCatatan({
               ...dataCatatan,
               OFFER_ID: "",
               CATATAN_BROKER_ISI: "",
               CATATAN_BROKER_FOR: dataFor,
          });
          setModalCatatan({
               add: true,
          });
     };
     // end for tambah catatan

     // for ajukan ke asuransi
     const ajukanKeAsuransi = async (idOfferDetail: any) => {
          await axios
               .post(`/ajukanKeAsuransi`, { idOfferDetail })
               .then((res) => {
                    setModalPengajuan({
                         add: false,
                         detail: false,
                         edit: false,
                         review: false,
                    });
                    setIsSuccess("");
                    setIsSuccess(res.data[0]);
                    setRefreshTrigger(res.data[0]);
                    setTimeout(() => {
                         setIsSuccess("");
                    }, 5000);
                    setTimeout(() => {
                         setRefreshTrigger("");
                    }, 1000);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // for ajukan ke asuransi
     const forInsuranceReview = async (dataSelectRow: any) => {
          setLoaderFetch(true);
          await axios
               .post(`/forInsuranceReview`, { dataSelectRow })
               .then((res) => {
                    setLoaderFetch(false);
                    setModalPengajuan({
                         add: false,
                         detail: false,
                         edit: false,
                         review: false,
                    });
                    setIsSuccess("");
                    setIsSuccess(res.data[0]);
                    setRefreshTrigger(res.data[0]);
                    setTimeout(() => {
                         setIsSuccess("");
                    }, 5000);
                    setTimeout(() => {
                         setRefreshTrigger("");
                    }, 1000);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const handleForSelectInsurance = async (dataSelectRow: any) => {
          Swal.fire({
               title: "Are you sure?",
               text: "",
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes",
          }).then((result) => {
               if (result.isConfirmed) {
                    forInsuranceReview(dataSelectRow);
               }
          });
     };

     const handleAjukanKeAsuransi = async (
          e: FormEvent,
          idOfferDetail: any
     ) => {
          e.preventDefault();
          Swal.fire({
               title: "Are you sure?",
               text: "",
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes",
          }).then((result) => {
               if (result.isConfirmed) {
                    ajukanKeAsuransi(idOfferDetail);
               }
          });
     };
     // end for ajukan ke asuransi

     // button handle setuju
     // end for loader
     const insuranceApprovePengajuan = async (idOfferDetail: any) => {
          setLoaderFetch(true);
          await axios
               .post(`/insuranceApprovePengajuan`, { idOfferDetail })
               .then((res) => {
                    setLoaderFetch(false);
                    setModalPengajuan({
                         add: false,
                         detail: false,
                         edit: false,
                         review: false,
                    });
                    setIsSuccess("");
                    setIsSuccess(res.data[0]);
                    setRefreshTrigger(res.data[0]);
                    setTimeout(() => {
                         setIsSuccess("");
                    }, 5000);
                    setTimeout(() => {
                         setRefreshTrigger("");
                    }, 1000);
               })
               .catch((err) => {
                    console.log(err);
               });
     };
     const handleButtonSetuju = async (e: FormEvent, idOfferDetail: any) => {
          e.preventDefault();
          Swal.fire({
               title: "Are you sure?",
               text: "",
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes",
          }).then((result) => {
               if (result.isConfirmed) {
                    insuranceApprovePengajuan(idOfferDetail);
               }
          });
     };
     // end button handle setuju

     // handle for pending pengajuan
     const [modalUploadPending, setModalPending] = useState<any>({
          add: false,
     });
     const [dataUploadPending, setDataUploadPending] = useState<any>({
          OFFER_ID: dataReviewPengajuan.OFFER_ID,
          JENIS_DOCUMENT: "",
          UPLOAD_FILE: "",
     });
     const handleSuccessPending = async (message = "") => {
          if (message != "") {
               setModalPending({
                    add: false,
               });
               setModalPengajuan({
                    add: false,
                    detail: false,
                    edit: false,
                    review: false,
               });
               setIsSuccess("");
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
     const handlePendingPengajuan = async (
          e: FormEvent,
          idOfferDetail: any
     ) => {
          e.preventDefault();
          Swal.fire({
               title: "Are you sure?",
               text: "",
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes",
          }).then((result) => {
               if (result.isConfirmed) {
                    getJenisDocumentTypeAll();
                    setModalPending({
                         add: true,
                    });
               }
          });
     };
     // end handle for pending pengajuan

     // handle for pending pengajuan
     const [modalTolak, setModalTolak] = useState<any>({
          add: false,
     });
     const [dataUploadTolak, setDataUploadTolak] = useState<any>({
          OFFER_ID: dataReviewPengajuan.OFFER_ID,
          JENIS_DOCUMENT: "",
          UPLOAD_FILE: "",
     });
     const handleSuccessTolak = async (message = "") => {
          if (message != "") {
               setModalTolak({
                    add: false,
               });
               setModalPengajuan({
                    add: false,
                    detail: false,
                    edit: false,
                    review: false,
               });
               setIsSuccess("");
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
     const handleTolakPengajuan = async (e: FormEvent, idOfferDetail: any) => {
          e.preventDefault();
          Swal.fire({
               title: "Are you sure?",
               text: "",
               icon: "question",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes",
          }).then((result) => {
               if (result.isConfirmed) {
                    getJenisDocumentTypeAll();
                    setModalTolak({
                         add: true,
                    });
               }
          });
     };

     const totalPremi = () => {
          let totalPremi = 0;
          if (rateHistory.length === 0) {
               var amountCombination =
                    getOfferDetail?.OFFER_DETAIL_AMOUNT_COMBINATION === null
                         ? 0
                         : getOfferDetail?.OFFER_DETAIL_AMOUNT_COMBINATION;
               totalPremi =
                    parseInt(getOfferDetail?.OFFER_DETAIL_AMOUNT) +
                    parseInt(amountCombination) +
                    parseInt(getOfferDetail.OFFER_DETAIL_AMOUNT_EXTRA_PREMI);
          } else {
               var extraPremi =
                    rateHistory[0]?.rate_history_premium_combination !== null
                         ? rateHistory[0]?.rate_history_premium_combination
                         : "0";

               totalPremi =
                    parseInt(rateHistory[0]?.rate_history_premium_regular) +
                    parseInt(extraPremi) +
                    parseInt(getOfferDetail.OFFER_DETAIL_AMOUNT_EXTRA_PREMI);
          }
          return totalPremi;
          // console.log(totalPremi);
     };

     // end handle for pending pengajuan

     // handle for edit extra premi
     const [modalExtraPremi, setModalExtraPremi] = useState<any>({
          edit: false,
     });

     // get data edit premi
     const [dataEditPremi, setDataEditPremi] = useState<any>({
          dataOfferDetail: [],
          dataRateHistory: [],
     });
     const getDetailDataEditPremi = async (idOfferDetail: any) => {
          await axios
               .post(`/getDetailDataEditPremi`, { idOfferDetail })
               .then((res) => {
                    setDataEditPremi({
                         dataOfferDetail: [res.data.detailOffer],
                         dataRateHistory: [res.data.arrRateHistory],
                    });
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const handleEditExtraPremi = async (e: FormEvent, idOfferDetail: any) => {
          e.preventDefault();
          setModalExtraPremi({
               edit: !modalExtraPremi.edit,
          });

          getDetailDataEditPremi(idOfferDetail);
     };
     // handle end for edit extra premi

     // for selected insurance yang di pilih
     const [dataSelectRow, setDataSelectRow] = useState<any>([]);
     const handleSelectRow = async (data: any) => {
          var offerDetailId = data.selectedRows;
          setDataSelectRow(offerDetailId);
     };

     return (
          <>
               {loaderFetch && <Loader />}
               {/* modal for upload tolak */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalTolak.add}
                    onClose={() =>
                         setModalTolak({
                              add: false,
                         })
                    }
                    title={"Upload Document Tolak"}
                    url={`/uploadTolakDocument`}
                    data={dataUploadTolak}
                    onSuccess={handleSuccessTolak}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[30%]"
                    }
                    body={
                         <>
                              <div>
                                   <div className="grid grid-cols-1">
                                        <InputLabel value="Jenis Dokumen" />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-[var(--dynamic-color)]`
                                                                 : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                       }`,
                                             }}
                                             options={
                                                  selectDocumentCategoryTolak
                                             }
                                             isSearchable={true}
                                             placeholder={"--Pilih--"}
                                             value={
                                                  dataUploadTolak.JENIS_DOCUMENT
                                             }
                                             onChange={(e) => {
                                                  setDataUploadTolak({
                                                       ...dataUploadTolak,
                                                       JENIS_DOCUMENT: e,
                                                       OFFER_ID:
                                                            dataReviewPengajuan.OFFER_ID,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                                   <div className="grid grid-cols-1 mt-2">
                                        <InputLabel value="Jenis Dokumen" />
                                        <input
                                             className="block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                             id="file_input"
                                             type="file"
                                             required
                                             onChange={(e: any) => {
                                                  setDataUploadTolak({
                                                       ...dataUploadTolak,
                                                       UPLOAD_FILE:
                                                            e.target.files,
                                                  });
                                             }}
                                        ></input>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end modal for upload tolak */}

               {/* modal for upload pending */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalUploadPending.add}
                    onClose={() =>
                         setModalPending({
                              add: false,
                         })
                    }
                    title={"Upload Document Pending"}
                    url={`/uploadPendingDocument`}
                    data={dataUploadPending}
                    onSuccess={handleSuccessPending}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[30%]"
                    }
                    body={
                         <>
                              <div>
                                   <div className="grid grid-cols-1">
                                        <InputLabel value="Jenis Dokumen" />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-[var(--dynamic-color)]`
                                                                 : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                       }`,
                                             }}
                                             options={selectDocumentCategory}
                                             isSearchable={true}
                                             placeholder={"--Pilih--"}
                                             value={
                                                  dataUploadPending.JENIS_DOCUMENT
                                             }
                                             onChange={(e) => {
                                                  setDataUploadPending({
                                                       ...dataUploadPending,
                                                       JENIS_DOCUMENT: e,
                                                       OFFER_ID:
                                                            dataReviewPengajuan.OFFER_ID,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                                   <div className="grid grid-cols-1 mt-2">
                                        <InputLabel value="Jenis Dokumen" />
                                        <input
                                             className="block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                             id="file_input"
                                             type="file"
                                             required
                                             onChange={(e: any) => {
                                                  setDataUploadPending({
                                                       ...dataUploadPending,
                                                       UPLOAD_FILE:
                                                            e.target.files,
                                                  });
                                             }}
                                        ></input>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end modal for upload pending */}

               {/* for edit document */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalCatatan.add}
                    onClose={() =>
                         setModalCatatan({
                              add: false,
                         })
                    }
                    title={"Tambah Catatan"}
                    url={`/addCatatan`}
                    data={dataCatatan}
                    onSuccess={handleSuccessEditDocument}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[30%]"
                    }
                    body={
                         <>
                              <div>
                                   <div className="grid grid-cols-1">
                                        <InputLabel value="Catatan" />
                                        <TextArea
                                             className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-primary-adele sm:text-sm sm:leading-6 h-[179px]"
                                             id="relation_description"
                                             name="relation_description"
                                             defaultValue={
                                                  dataCatatan.CATATAN_BROKER_ISI
                                             }
                                             onChange={(e: any) => {
                                                  setDataCatatan({
                                                       ...dataCatatan,
                                                       OFFER_ID:
                                                            dataReviewPengajuan?.OFFER_ID,
                                                       CATATAN_BROKER_ISI:
                                                            e.target.value,
                                                  });
                                             }}
                                        />
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end for edit document */}

               {/* for edit document */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalEditDocument.edit}
                    onClose={() =>
                         setModalEditDocument({
                              edit: false,
                         })
                    }
                    title={"Edit Document"}
                    url={`/editDocument`}
                    data={dataEditDocument}
                    onSuccess={handleSuccessEditDocument}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[30%]"
                    }
                    body={
                         <>
                              <div>
                                   <div className="grid grid-cols-1">
                                        <InputLabel value="Jenis Dokumen" />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-400"
                                             disabled
                                             value={
                                                  dataEditDocument.DOCUMENT_TYPE_NAME
                                             }
                                             onChange={(e: any) => {}}
                                        />
                                   </div>
                                   <div className="grid grid-cols-1 mt-2">
                                        <InputLabel value="Jenis Dokumen" />
                                        <span
                                             className="text-xs italic mb-1 hover:text-blue-600 hover:cursor-pointer w-fit"
                                             onClick={() => {
                                                  handleFileViewFile(
                                                       dataEditDocument.DOCUMENT_ID
                                                  );
                                             }}
                                        >
                                             {
                                                  dataEditDocument?.DOCUMENT_FILENAME
                                             }
                                        </span>
                                        <input
                                             className="block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                             id="file_input"
                                             type="file"
                                             required
                                             onChange={(e: any) => {
                                                  setDataEditDocument({
                                                       ...dataEditDocument,
                                                       UPLOAD_FILE:
                                                            e.target.files,
                                                  });
                                             }}
                                        ></input>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end for edit document */}

               {/* for upload document */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalUploadDocument.modalUpload}
                    onClose={() =>
                         setModalUploadDocument({
                              modalUpload: false,
                         })
                    }
                    title={"Upload Document"}
                    url={`/uploadDocument`}
                    data={dataUploadDocument}
                    onSuccess={handleSuccessUploadDocument}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[30%]"
                    }
                    body={
                         <>
                              <div>
                                   <div className="grid grid-cols-1">
                                        <InputLabel value="Jenis Dokumen" />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-[var(--dynamic-color)]`
                                                                 : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                       }`,
                                             }}
                                             options={selectInsurance}
                                             isSearchable={true}
                                             placeholder={"--Pilih--"}
                                             value={
                                                  dataUploadDocument.JENIS_DOCUMENT
                                             }
                                             onChange={(e) => {
                                                  setDataUploadDocument({
                                                       ...dataUploadDocument,
                                                       JENIS_DOCUMENT: e,
                                                       OFFER_ID:
                                                            dataReviewPengajuan.OFFER_ID,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                                   <div className="grid grid-cols-1 mt-2">
                                        <InputLabel value="Jenis Dokumen" />
                                        <input
                                             className="block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                             id="file_input"
                                             type="file"
                                             required
                                             onChange={(e: any) => {
                                                  setDataUploadDocument({
                                                       ...dataUploadDocument,
                                                       UPLOAD_FILE:
                                                            e.target.files,
                                                  });
                                             }}
                                        ></input>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end for upload document */}

               {/* for modal edit premi */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalExtraPremi.edit}
                    onClose={() =>
                         setModalExtraPremi({
                              edit: false,
                         })
                    }
                    title={"Edit Extra Premi"}
                    url={`/saveEditPremi`}
                    data={dataEditPremi}
                    onSuccess={handleSuccessEditDocument}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[70%]"
                    }
                    body={
                         <>
                              <EditExtraPremi
                                   dataEditPremi={dataEditPremi}
                                   setDataEditPremi={setDataEditPremi}
                              />
                         </>
                    }
               />
               {/* end for modal edit premi */}

               {/* For Detail Data Debitur */}
               <fieldset className="pb-10 pt-0 rounded-lg border-2">
                    <legend className="ml-5 px-3 font-semibold">
                         Data Debitur
                    </legend>
                    <div className="grid lg:grid-cols-3 xs:grid-cols-1 xs:px-1 lg:px-5 py-2 gap-4">
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Nama Debitur
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dataReviewPengajuan?.THE_INSURED_NAME}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Tanggal Lahir
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dateFormat(
                                             dataReviewPengajuan?.THE_INSURED_DATE_OF_BIRTH,
                                             "dd mmm yyyy"
                                        )}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   NIK Debitur
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {
                                             dataReviewPengajuan?.THE_INSURED_ID_NUMBER
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="grid lg:grid-cols-3 xs:grid-cols-1 lg:px-5 xs:px-1 py-2 gap-4">
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Usia Sekarang
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dataReviewPengajuan?.THE_INSURED_AGE}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   CIF Debitur
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dataReviewPengajuan?.THE_INSURED_CIF}
                                   </div>
                              </div>
                         </div>
                    </div>
               </fieldset>
               {/* End For Detail Data Debitur */}
               {/* For Detail Data Kredit */}
               <fieldset className="pb-10 pt-0 rounded-lg border-2">
                    <legend className="ml-5 px-3 font-semibold">
                         Data Kredit
                    </legend>
                    <div className="grid lg:grid-cols-3 xs:grid-cols-1 lg:px-5 xs:px-1 py-2 gap-4">
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Jenis Asuransi
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {
                                             dataReviewPengajuan?.JENIS_ASURANSI_NAME
                                        }
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Nama Kantor
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {
                                             dataReviewPengajuan?.OFFER_BANK_OFFICE_NAME
                                        }
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Sumber Pembayaran
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {
                                             dataReviewPengajuan?.TARIF_PAYROLL_NAME
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="grid lg:grid-cols-3 xs:grid-cols-1 lg:px-5 xs:px-1 py-2 gap-4">
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Loan Type
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dataReviewPengajuan?.loan_type_name}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Nilai Pertanggungan
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {formatCurrency.format(
                                             dataReviewPengajuan?.OFFER_SUM_INSURED
                                        )}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Rencana Tgl Pencairan
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dateFormat(
                                             dataReviewPengajuan?.OFFER_INCEPTION_DATE,
                                             "dd mmm yyyy"
                                        )}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">Tenor</div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dataReviewPengajuan?.OFFER_TENOR} Bulan
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Tgl Akhir Kredit
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {dateFormat(
                                             dataReviewPengajuan?.OFFER_DUE_DATE,
                                             "dd mmm yyyy"
                                        )}
                                   </div>
                              </div>
                         </div>
                         <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                              <div className="col-span-2 xs:text-sm">
                                   Usia Pada Saat Jatuh Tempo
                              </div>
                              <div className="col-span-3 flex gap-3 xs:text-sm">
                                   <div>:</div>
                                   <div>
                                        {
                                             dataReviewPengajuan?.OFFER_AGE_ON_DUE_DATE
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
               </fieldset>
               {/* End For Detail Data Kredit */}
               {/* for detail of insruance */}
               {dataReviewPengajuan.JENIS_ASURANSI_ID === 1 ||
               dataReviewPengajuan.JENIS_ASURANSI_ID === "1" ? (
                    <>
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-semibold">
                                   Detail for Insurance Life
                              </legend>
                              <div className="grid lg:grid-cols-3 xs:grid-cols-1 xs:px-1 lg:px-5 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2 xs:text-sm">
                                             Kode AO
                                        </div>
                                        <div className="col-span-3 flex gap-3 xs:text-sm">
                                             <div>:</div>
                                             <div>
                                                  {dataReviewPengajuan?.KODE_AO}
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2 xs:text-sm">
                                             Email Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3 xs:text-sm">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       dataReviewPengajuan?.THE_INSURED_EMAIL
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2 xs:text-sm">
                                             Gender Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3 xs:text-sm">
                                             <div>:</div>
                                             <div>
                                                  {dataReviewPengajuan?.THE_INSURED_GENDER ===
                                                  "1"
                                                       ? "Female"
                                                       : "Male"}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="grid lg:grid-cols-3 xs:grid-cols-1 lg:px-5 xs:px-1 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2 xs:text-sm">
                                             Height Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3 xs:text-sm">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       dataReviewPengajuan?.THE_INSURED_WEIGHT
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2 xs:text-sm">
                                             Weight Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3 xs:text-sm">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       dataReviewPengajuan?.THE_INSURED_HEIGHT
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2 xs:text-sm">
                                             Martital Status
                                        </div>
                                        <div className="col-span-3 flex gap-3 xs:text-sm">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       dataReviewPengajuan?.MARITAL_STATUS_NAME
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                    </>
               ) : null}

               {/* end for detail of insurance */}
               {/* For data Document dan Catatan */}
               <div
                    className={`grid xs:grid-cols-1 gap-4 mix-h-[300px] ${
                         auth.user.user_type_id === 4
                              ? `lg:grid-cols-3`
                              : `lg:grid-cols-2`
                    }`}
               >
                    {auth.user.user_type_id === 4 ? (
                         <>
                              <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                   <legend className="ml-5 px-3 font-semibold">
                                        Extra Premi
                                   </legend>
                                   <div className="px-5 py-3 relative h-full">
                                        {/* judul */}
                                        <div className="grid grid-cols-3 gap-3">
                                             <div></div>
                                             <div className="text-sm flex justify-end font-semibold">
                                                  <span>Premi Original</span>
                                             </div>
                                             <div className="text-sm flex justify-end font-semibold">
                                                  <span>Premi Update</span>
                                             </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-10">
                                             <div className="text-sm flex justify-start">
                                                  <span>Tenor Regular</span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {rateHistory.length === 0
                                                            ? Math.ceil(
                                                                   dataReviewPengajuan?.OFFER_TENOR /
                                                                        12
                                                              ) + " Tahun"
                                                            : Math.ceil(
                                                                   rateHistory[0]
                                                                        ?.rate_history_tenor_regular /
                                                                        12
                                                              ) + " Tahun"}
                                                  </span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {Math.ceil(
                                                            dataReviewPengajuan?.OFFER_TENOR /
                                                                 12
                                                       ) + " Tahun"}
                                                  </span>
                                             </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-10">
                                             <div className="text-sm flex justify-start">
                                                  <span>Rate Regular</span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {rateHistory.length === 0
                                                            ? new Intl.NumberFormat(
                                                                   "en-US",
                                                                   {
                                                                        style: "decimal",
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                   }
                                                              ).format(
                                                                   getOfferDetail?.OFFER_DETAIL_RATE
                                                              )
                                                            : new Intl.NumberFormat(
                                                                   "en-US",
                                                                   {
                                                                        style: "decimal",
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                   }
                                                              ).format(
                                                                   rateHistory[0]
                                                                        ?.rate_history_rate_regular
                                                              )}
                                                  </span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            getOfferDetail?.OFFER_DETAIL_RATE
                                                       )}
                                                  </span>
                                             </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-10">
                                             <div className="text-sm flex justify-start">
                                                  <span>Premi Regular</span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {rateHistory.length === 0
                                                            ? new Intl.NumberFormat(
                                                                   "en-US",
                                                                   {
                                                                        style: "decimal",
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                   }
                                                              ).format(
                                                                   getOfferDetail?.OFFER_DETAIL_AMOUNT
                                                              )
                                                            : new Intl.NumberFormat(
                                                                   "en-US",
                                                                   {
                                                                        style: "decimal",
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                   }
                                                              ).format(
                                                                   rateHistory[0]
                                                                        ?.rate_history_premium_regular
                                                              )}
                                                  </span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            getOfferDetail?.OFFER_DETAIL_AMOUNT
                                                       )}
                                                  </span>
                                             </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-10">
                                             <div className="text-sm flex justify-start">
                                                  <span>Extra Premi</span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>0.00</span>
                                             </div>
                                             <div className="text-sm flex justify-end">
                                                  <span>
                                                       {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            getOfferDetail?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI
                                                       )}
                                                  </span>
                                             </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mt-10">
                                             <div className="text-sm flex justify-start font-semibold">
                                                  <span>Total Premi</span>
                                             </div>
                                             <div className="text-sm flex justify-end font-semibold">
                                                  <span>
                                                       {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            getOfferDetail?.OFFER_DETAIL_AMOUNT
                                                       )}
                                                  </span>
                                             </div>
                                             <div className="text-sm flex justify-end font-semibold">
                                                  <span>
                                                       {new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(totalPremi())}
                                                  </span>
                                             </div>
                                        </div>
                                        <div
                                             className="absolute bottom-0 right-0 px-5 text-primary-adele cursor-pointer"
                                             onClick={(e) => {
                                                  handleEditExtraPremi(
                                                       e,
                                                       getOfferDetail?.OFFER_DETAIL_ID
                                                  );
                                             }}
                                        >
                                             <div className="bg-primary-adele p-2 text-white w-fit rounded-md shadow-md hover:bg-blue-700 text-sm">
                                                  <span>Edit Extra Premi</span>
                                             </div>
                                        </div>
                                   </div>
                              </fieldset>
                         </>
                    ) : null}
                    <fieldset className="pb-10 pt-0 rounded-lg border-2">
                         <legend className="ml-5 px-3 font-semibold">
                              Dokumen
                         </legend>
                         <div className="px-5 py-3 relative h-full">
                              <div className="grid grid-cols-14 gap-2 bg-white shadow-md rounded-md p-2">
                                   <div className="col-span-2 text-center">
                                        No.
                                   </div>
                                   <div className="col-span-5">Action</div>
                                   <div className="col-span-7">
                                        Tipe Dokumen
                                   </div>
                              </div>

                              {arrDoc?.map((dataDoc: any, index: number) => {
                                   return (
                                        <div key={index}>
                                             <div className="grid grid-cols-14 gap-2 p-2">
                                                  <div className="col-span-1 text-center">
                                                       {index + 1}.
                                                  </div>
                                                  <div className="col-span-6">
                                                       <div className="flex gap-2">
                                                            <span>
                                                                 <ArrowDownTrayIcon
                                                                      onClick={() => {
                                                                           handleFileDownloadFile(
                                                                                dataDoc.DOCUMENT_ID
                                                                           );
                                                                      }}
                                                                      className="w-5 hover:cursor-pointer hover:text-primary-adele"
                                                                      title="Download"
                                                                 />
                                                            </span>
                                                            <span>
                                                                 <EyeIcon
                                                                      onClick={() => {
                                                                           handleFileViewFile(
                                                                                dataDoc.DOCUMENT_ID
                                                                           );
                                                                      }}
                                                                      className="w-5 hover:cursor-pointer hover:text-primary-adele"
                                                                      title="Lihat"
                                                                 />
                                                            </span>
                                                            {auth.user
                                                                 .user_type_id !==
                                                                 4 && (
                                                                 <span>
                                                                      <PencilSquareIcon
                                                                           onClick={(
                                                                                e
                                                                           ) => {
                                                                                handleEditDocument(
                                                                                     e,
                                                                                     dataDoc
                                                                                );
                                                                           }}
                                                                           className="w-5 hover:cursor-pointer hover:text-primary-adele"
                                                                           title="Edit"
                                                                      />
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </div>
                                                  <div className="col-span-7">
                                                       {
                                                            dataDoc.DOCUMENT_TYPE_NAME
                                                       }
                                                  </div>
                                             </div>
                                        </div>
                                   );
                              })}
                              <div
                                   className="absolute bottom-0 right-0 px-5 text-primary-adele cursor-pointer"
                                   onClick={(e) => {
                                        handleUploadDocument(e);
                                   }}
                              >
                                   <PlusCircleIcon className="w-10" />
                              </div>
                         </div>
                    </fieldset>
                    <fieldset className="pb-0 pt-0 rounded-lg border-2">
                         <legend className="ml-5 px-3 font-semibold">
                              Catatan
                         </legend>
                         <div className="px-5 py-4">
                              {auth.user.user_type_id === 2 ||
                              auth.user.user_type_id === 3 ? (
                                   <fieldset
                                        className={`pb-10 pt-0 rounded-lg border-2 relative ${
                                             auth.user.user_type_id === 2
                                                  ? "xs:h-[300px] lg:h-[520px]"
                                                  : "h-[260px]"
                                        }`}
                                   >
                                        <legend className="ml-5 px-3 font-semibold text-xs">
                                             Catatan From Bank
                                        </legend>
                                        <div className="h-full overflow-y-auto custom-scrollbar px-4">
                                             {arrCatatan?.map(
                                                  (
                                                       dataCatatan: any,
                                                       index: number
                                                  ) => {
                                                       return dataCatatan?.CATATAN_BROKER_FOR.toString() ===
                                                            "0" ? (
                                                            <div
                                                                 key={index}
                                                                 className={`p-1 rounded-md shadow-md mt-2 ${
                                                                      auth.user.id.toString() ===
                                                                      dataCatatan.CATATAN_BROKER_CREATED_BY.toString()
                                                                           ? `bg-blue-300`
                                                                           : `bg-white`
                                                                 }`}
                                                            >
                                                                 <p className="text-xs">
                                                                      {
                                                                           dataCatatan?.CATATAN_BROKER_ISI
                                                                      }
                                                                 </p>
                                                                 <div className="flex justify-end text-xs italic">
                                                                      <span>
                                                                           {
                                                                                dataCatatan.user_login
                                                                           }
                                                                           {
                                                                                ", "
                                                                           }
                                                                           {
                                                                                dataCatatan.CATATAN_BROKER_CREATED_DATE
                                                                           }
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       ) : null;
                                                  }
                                             )}
                                        </div>
                                        <div
                                             className="absolute bottom-0 right-0 px-5 text-primary-adele cursor-pointer"
                                             onClick={(e) => {
                                                  handleAddCatatan(e, 0);
                                             }}
                                        >
                                             <PlusCircleIcon className="w-10" />
                                        </div>
                                   </fieldset>
                              ) : null}
                              {auth.user.user_type_id === 4 ||
                              auth.user.user_type_id === 3 ? (
                                   <fieldset
                                        className={`pb-10 pt-0 rounded-lg border-2 relative ${
                                             auth.user.user_type_id === 4
                                                  ? "xs:h-[300px] lg:h-[520px]"
                                                  : "h-[260px]"
                                        }`}
                                   >
                                        <legend className="ml-5 px-3 font-semibold text-xs">
                                             Catatan From Insurance
                                        </legend>
                                        <div className="h-full overflow-y-auto custom-scrollbar px-4">
                                             {arrCatatan?.map(
                                                  (
                                                       dataCatatan: any,
                                                       index: number
                                                  ) => {
                                                       return dataCatatan?.CATATAN_BROKER_FOR.toString() ===
                                                            "1" ? (
                                                            <div
                                                                 key={index}
                                                                 className={`p-1 rounded-md shadow-md mt-2 ${
                                                                      auth.user.id.toString() ===
                                                                      dataCatatan.CATATAN_BROKER_CREATED_BY.toString()
                                                                           ? `bg-blue-300`
                                                                           : `bg-white`
                                                                 }`}
                                                            >
                                                                 <p className="text-xs">
                                                                      {
                                                                           dataCatatan?.CATATAN_BROKER_ISI
                                                                      }
                                                                 </p>
                                                                 <div className="flex justify-end text-xs italic">
                                                                      <span>
                                                                           {
                                                                                dataCatatan.user_login
                                                                           }
                                                                           {
                                                                                ", "
                                                                           }
                                                                           {
                                                                                dataCatatan.CATATAN_BROKER_CREATED_DATE
                                                                           }
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       ) : null;
                                                  }
                                             )}
                                        </div>
                                        <div
                                             className="absolute bottom-0 right-0 px-5 text-primary-adele cursor-pointer"
                                             onClick={(e) => {
                                                  handleAddCatatan(e, 1);
                                             }}
                                        >
                                             <PlusCircleIcon className="w-10" />
                                        </div>
                                   </fieldset>
                              ) : null}
                         </div>
                    </fieldset>
               </div>
               {/* End For data Document dan Catatan */}

               {/* For Data Penawaran */}
               <>
                    <ViewPenawaran arrInsurance={arrInsurance} />
               </>
               {/* End For Data Penawaran */}
               {/* For Data List insurance */}
               {/* {auth.user.user_type_id !== 2 ? (
                    <>
                         <fieldset className="pb-10 pt-0 xs:mt-60 lg:mt-2 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-semibold">
                                   List Insurance
                              </legend>
                              <div className="flex justify-end">
                                   {dataSelectRow.length !== 0 ? (
                                        <>
                                             <div
                                                  className="ml-5 p-2 bg-green-900 w-fit rounded-md text-white text-xs hover:cursor-pointer hover:bg-green-950"
                                                  onClick={() => {
                                                       handleForSelectInsurance(
                                                            dataSelectRow
                                                       );
                                                  }}
                                             >
                                                  <span>Select Insurance</span>
                                             </div>
                                        </>
                                   ) : null}
                              </div>
                              {urlOfferDetail !== "" ? (
                                   <>
                                        <div className="lg:px-5 xs:px-1 py-2 xs:w-[275px] lg:w-full">
                                             <DataTables
                                                  columns={[
                                                       {
                                                            name: "Nama Asuransi",
                                                            selector: (
                                                                 row: any
                                                            ) =>
                                                                 row.INSURANCE_NAME,
                                                            sortable: true,
                                                       },
                                                       {
                                                            name: "Rate",
                                                            cell: (
                                                                 row: any
                                                            ) => (
                                                                 <>
                                                                      {auth.user
                                                                           .user_type_id ===
                                                                      2 ? (
                                                                           <span>
                                                                                -
                                                                           </span>
                                                                      ) : (
                                                                           <span>
                                                                                {new Intl.NumberFormat(
                                                                                     "en-US",
                                                                                     {
                                                                                          style: "decimal",
                                                                                          minimumFractionDigits: 2,
                                                                                          maximumFractionDigits: 2,
                                                                                     }
                                                                                ).format(
                                                                                     row.OFFER_DETAIL_RATE
                                                                                )}
                                                                           </span>
                                                                      )}
                                                                 </>
                                                            ),
                                                            right: "true",
                                                            sortable: true,
                                                       },
                                                       {
                                                            name: "Premi",
                                                            cell: (
                                                                 row: any
                                                            ) => (
                                                                 <>
                                                                      {auth.user
                                                                           .user_type_id ===
                                                                      2 ? (
                                                                           <span>
                                                                                -
                                                                           </span>
                                                                      ) : (
                                                                           <span>
                                                                                {new Intl.NumberFormat(
                                                                                     "en-US",
                                                                                     {
                                                                                          style: "decimal",
                                                                                          minimumFractionDigits: 2,
                                                                                          maximumFractionDigits: 2,
                                                                                     }
                                                                                ).format(
                                                                                     row.OFFER_DETAIL_AMOUNT
                                                                                )}
                                                                           </span>
                                                                      )}
                                                                 </>
                                                            ),
                                                            right: "true",
                                                            sortable: true,
                                                       },
                                                       // {
                                                       //      name: "Action",
                                                       //      selector: (
                                                       //           row: any
                                                       //      ) => "asdad",
                                                       //      cell: (
                                                       //           row: any
                                                       //      ) => (
                                                       //           // <div
                                                       //           //      className="bg-green-700 text-white p-2 rounded-md hover:cursor-pointer hover:bg-green-800 shadow-lg"
                                                       //           //      onClick={(
                                                       //           //           e
                                                       //           //      ) => {
                                                       //           //           handleAjukanKeAsuransi(
                                                       //           //                e,
                                                       //           //                row.OFFER_DETAIL_ID
                                                       //           //           );
                                                       //           //      }}
                                                       //           // >
                                                       //           //      <span>
                                                       //           //           Ajukan
                                                       //           //           Ke
                                                       //           //           Asuransi
                                                       //           //      </span>
                                                       //           // </div>
                                                       //           <div
                                                       //                className="bg-green-700 text-white p-2 rounded-md hover:cursor-pointer hover:bg-green-800 shadow-lg"
                                                       //                onClick={(
                                                       //                     e
                                                       //                ) => {
                                                       //                     handleAjukanKeAsuransi(
                                                       //                          e,
                                                       //                          row.OFFER_DETAIL_ID
                                                       //                     );
                                                       //                }}
                                                       //           >
                                                       //                <span>
                                                       //                     Select
                                                       //                     Insurance
                                                       //                </span>
                                                       //           </div>
                                                       //      ),
                                                       //      sortable: true,
                                                       //      omit:
                                                       //           auth.user
                                                       //                .user_type_id !==
                                                       //           3,
                                                       // },
                                                       // {
                                                       //      name: "Action",
                                                       //      selector: (
                                                       //           row: any
                                                       //      ) => "asdad",
                                                       //      cell: (
                                                       //           row: any
                                                       //      ) => (
                                                       //           <div className="grid grid-cols-3 gap-2">
                                                       //                <div
                                                       //                     className="flex items-center justify-center bg-green-700 text-white p-2 rounded-md hover:cursor-pointer hover:bg-green-800 shadow-lg"
                                                       //                     onClick={(
                                                       //                          e
                                                       //                     ) => {
                                                       //                          handleButtonSetuju(
                                                       //                               e,
                                                       //                               row.OFFER_DETAIL_ID
                                                       //                          );
                                                       //                     }}
                                                       //                >
                                                       //                     <span>
                                                       //                          Setuju
                                                       //                     </span>
                                                       //                </div>
                                                       //                <div
                                                       //                     className="flex items-center justify-center bg-yellow-400 text-white p-2 rounded-md hover:cursor-pointer hover:bg-yellow-500 shadow-lg"
                                                       //                     onClick={(
                                                       //                          e
                                                       //                     ) => {
                                                       //                          handlePendingPengajuan(
                                                       //                               e,
                                                       //                               row.OFFER_DETAIL_ID
                                                       //                          );
                                                       //                     }}
                                                       //                >
                                                       //                     <span>
                                                       //                          Pending
                                                       //                     </span>
                                                       //                </div>
                                                       //                <div
                                                       //                     className="flex items-center justify-center bg-red-700 text-white p-2 rounded-md hover:cursor-pointer hover:bg-red-900 shadow-lg"
                                                       //                     onClick={(
                                                       //                          e
                                                       //                     ) => {
                                                       //                          handleTolakPengajuan(
                                                       //                               e,
                                                       //                               row.OFFER_DETAIL_ID
                                                       //                          );
                                                       //                     }}
                                                       //                >
                                                       //                     <span>
                                                       //                          Tolak
                                                       //                     </span>
                                                       //                </div>
                                                       //           </div>
                                                       //      ),
                                                       //      sortable: true,
                                                       //      omit:
                                                       //           auth.user
                                                       //                .user_type_id !==
                                                       //           4,
                                                       // },
                                                  ]}
                                                  url={urlOfferDetail}
                                                  search={undefined}
                                                  refreshTrigger={"aaa"}
                                                  handleDoubleClick={undefined}
                                                  handleSelectRow={
                                                       handleSelectRow
                                                  }
                                                  selectableRows={true}
                                             />
                                        </div>
                                   </>
                              ) : null}
                         </fieldset>
                    </>
               ) : null} */}

               {/* End For Data List Insurance */}
          </>
     );
}
