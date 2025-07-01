import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import DataTables from "@/Components/DataTables";
import { FormEvent, useState } from "react";
import ToastMessage from "@/Components/ToastMessage";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import axios from "axios";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp, faListCheck } from "@fortawesome/free-solid-svg-icons";
import AddPengajuanDebitur from "./AddPengajuanDebitur";
import { format } from "path";
import styled from "styled-components";
import {
     ArrowPathIcon,
     EyeIcon,
     FunnelIcon,
     PencilSquareIcon,
} from "@heroicons/react/20/solid";
import ReviewPengajuanDebitur from "./ReviewPengajuanDebitur";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import dateFormat from "dateformat";
import { userIcon } from "@progress/kendo-svg-icons";
import EditPengajuanDebitur from "./EditPengajuanDebitur";
import SelectTailwind from "react-tailwindcss-select";
import Loader from "@/Components/Loader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import TextSearch from "@/Components/TextSearch";

export default function PengajuanDebitur({ auth }: any) {
     const {
          dataComboBankBranch,
          tarifPayroll,
          loanType,
          arrStatusPengajuan,
          arrStatusProses,
          filter,
          arrMaritalStatus,
     }: any = usePage().props;

     const selectArrPengajuan = arrStatusPengajuan?.map((query: any) => {
          return {
               value: query.staging_pengajuan_id,
               label: query.staging_pengajuan_name,
          };
     });

     const selectArrProses = arrStatusProses?.map((query: any) => {
          return {
               value: query.offer_status_id,
               label: query.offer_status_name,
          };
     });

     const [searchPengajuan, setSearchPengajuan] = useState<any>("");

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");
     // end for success alert

     // for refresh table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("ada");
     // end for refresh table

     // for model pengajuan
     const [modalPengajuan, setModalPengajuan] = useState<any>({
          add: false,
          detail: false,
          edit: false,
          review: false,
     });

     // state for modal add pengajuan
     const [dataPengajuanDebitur, setDataPengajuanDebitur] = useState<any>({
          DEBITUR_BARU: { label: "Buat Debitur Baru", value: "1" },
          data_debitur: [
               {
                    NAMA_DEBITUR: null,
                    NIK_DEBITUR: "",
                    CIF_DEBITUR: "",
                    TGL_LAHIR: "",
                    USIA_DEBITUR: "",
               },
          ],
          data_kredit: [
               {
                    JENIS_ASURANSI: null,
                    NAMA_KANTOR: null,
                    KODE_KANTOR: "",
                    NAMA_CABANG: "",
                    KODE_CABANG: "",
                    TARIF_PAYROLL: null,
                    LOAN_TYPE: null,
                    PRODUK: "",
                    SUB_PRODUK: "",
                    SUM_INSURED: "",
                    RENCANA_TANGGAL_PENCAIRAN: "",
                    TENOR: "",
                    TGL_AKHIR_KREDIT: "",
                    USIA_JATUH_TEMPO: "",
               },
          ],
          detail_insurance_life: [
               {
                    KODE_AO: "",
                    EMAIL_DEBITUR: "",
                    GENDER_DEBITUR: "",
                    HEIGHT_DEBITUR: "",
                    WEIGHT_DEBITUR: "",
                    MARITAL_STATUS: "",
               },
          ],
          UPLOAD_KTP: "",
          UPLOAD_SPAJK: "",
          UPLOAD_MCU: "",
     });

     // untuk cari data debitur the insured
     const [dataTheInsured, setDateTheInsured] = useState<any>([]);
     const getFindTheInsured = async () => {
          await axios
               .post(`/getFindTheInsured`, {})
               .then((res) => {
                    setDateTheInsured(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

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

     const handlePengajuanDebitur = async (e: FormEvent) => {
          e.preventDefault();
          getFindTheInsured();
          getInsuranceType();
          setModalPengajuan({
               add: true,
               detail: false,
               edit: false,
               review: false,
          });
     };

     const handleSuccessPengajuanDebitur = async (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setIsSuccess(message[0]);
               setDataPengajuanDebitur({
                    DEBITUR_BARU: { label: "Buat Debitur Baru", value: "1" },
                    data_debitur: [
                         {
                              NAMA_DEBITUR: null,
                              NIK_DEBITUR: "",
                              CIF_DEBITUR: "",
                              TGL_LAHIR: "",
                              USIA_DEBITUR: "",
                         },
                    ],
                    data_kredit: [
                         {
                              JENIS_ASURANSI: null,
                              NAMA_KANTOR: null,
                              KODE_KANTOR: "",
                              NAMA_CABANG: "",
                              KODE_CABANG: "",
                              TARIF_PAYROLL: null,
                              LOAN_TYPE: null,
                              PRODUK: "",
                              SUB_PRODUK: "",
                              SUM_INSURED: "",
                              RENCANA_TANGGAL_PENCAIRAN: "",
                              TENOR: "",
                              TGL_AKHIR_KREDIT: "",
                              USIA_JATUH_TEMPO: "",
                         },
                    ],
                    detail_insurance_life: [
                         {
                              KODE_AO: "",
                              EMAIL_DEBITUR: "",
                              GENDER_DEBITUR: null,
                              HEIGHT_DEBITUR: "",
                              WEIGHT_DEBITUR: "",
                              MARITAL_STATUS: null,
                         },
                    ],
                    UPLOAD_KTP: "",
                    UPLOAD_SPAJK: "",
                    UPLOAD_MCU: "",
               });
               setRefreshTrigger(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setTimeout(() => {
                    setRefreshTrigger("");
               }, 1000);
          }
     };

     // Function Format Currency
     const formatCurrency = new Intl.NumberFormat("default", {
          style: "currency",
          currency: "IDR",
     });
     // End Function Format Currency

     // fetch data review pengajuan debitur
     const [dataReviewPengajuan, setDataReviewPengajuan] = useState<any>([]);
     const [arrDoc, setArrDoc] = useState<any>([]);
     const [rateHistory, setRateHistory] = useState<any>([]);
     const [getOfferDetail, setGetOfferDetail] = useState<any>([]);
     const [urlOfferDetail, setUrlOfferDetail] = useState<any>("");
     const [arrCatatan, setArrCatatan] = useState<any>([]);
     const [arrInsurance, setArrInsurance] = useState<any>([]);
     const [arrGetAllMekanisme, setArrgetAllMekanisme] = useState<any>([]);
     // for loader
     const [loaderFetch, setLoaderFetch] = useState<any>(true);
     // end for loader
     const getReviewPengajuanDebitur = async (idOffer: any) => {
          setLoaderFetch(true);
          await axios
               .post(`/getReviewPengajuanDebitur`, { idOffer })
               .then((res) => {
                    setLoaderFetch(false);
                    setArrInsurance(res.data.getMappingInsurance);
                    setArrgetAllMekanisme(res.data.getAllMekanisme);
                    setDataReviewPengajuan(res.data.pengajuanDetail);
                    setArrDoc(res.data.arrDoc);
                    setRateHistory(res.data.arrRateHistory);
                    setGetOfferDetail(res.data.getOfferDetail);
                    setUrlOfferDetail(
                         `/getOfferDetail/${res.data.pengajuanDetail?.OFFER_ID}`
                    );
                    setArrCatatan(res.data.arrCatatan);
               })
               .catch((err) => {
                    console.log(err);
               });
     };
     // end fetch data review pengajuan debitur

     //handle click review button
     const handleClickReviewOffer = async (e: FormEvent, row: any) => {
          getReviewPengajuanDebitur(row);
          setModalPengajuan({
               add: false,
               detail: false,
               edit: false,
               review: true,
          });
     };

     // handle for terima pengajuan
     const terimaPengajuan = async (idOffer: any) => {
          await axios
               .post(`/terimaPengajuan`, { idOffer })
               .then((res) => {
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
     const handleTerimaPengajuan = async (e: FormEvent, idOffer: any) => {
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
                    terimaPengajuan(idOffer);
               }
          });
     };

     // action for konfirmasi broker ke bank
     const [modalCatatanKonfirmasi, setModalCatatanKonfirmasi] = useState<any>({
          add: false,
     });
     const [dataCatatanKonfirmasi, setDataCatatanKonfirmasi] = useState<any>({
          OFFER_ID: "",
          CATATAN_BROKER_ISI: "",
          CATATAN_BROKER_FOR: "",
     });
     const handleKonfirmasiKeBroker = async () => {
          setModalPengajuan({
               add: false,
               detail: false,
               edit: false,
               review: false,
          });
          setModalCatatanKonfirmasi({
               add: true,
          });
     };
     const handleSuccessKonfirmasiKeBroker = async (message: any) => {
          setModalCatatanKonfirmasi({
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
     };
     // end action for konfirmasi broker ke bank

     // for ajukan ke broker
     const [modalAjukanKeBroker, setModalAjukanKeBroker] = useState<any>({
          add: false,
     });
     const [dataCatatanAjukan, setDataCatatanAjukan] = useState<any>({
          OFFER_ID: "",
          CATATAN_BROKER_ISI: "",
          CATATAN_BROKER_FOR: "",
     });
     const handleAjukanKeBroker = async () => {
          setModalPengajuan({
               add: false,
               detail: false,
               edit: false,
               review: false,
          });
          setModalAjukanKeBroker({
               add: true,
          });
     };
     const handleSuccessAjukanKeBroker = async (message: any) => {
          setModalAjukanKeBroker({
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
     };
     // end for ajukan ke broker

     // for detail staging
     const [modalDetailStaging, setModalDetailStaging] = useState<any>({
          detail: false,
     });
     const [idOfferHistoryPengajuan, setIdOfferHistoryPengajuan] =
          useState<any>("");
     const handleClickDetailStaging = async (e: FormEvent, idOffer: any) => {
          e.preventDefault();
          setModalDetailStaging({
               detail: true,
          });
          setIdOfferHistoryPengajuan(idOffer);
     };
     // end for detail staging

     // for handle edit
     const [dataEditPengajuan, setDataEditPengajuan] = useState<any>({
          OFFER_ID: "",
          data_debitur: [
               {
                    NAMA_DEBITUR: "",
                    NIK_DEBITUR: "",
                    CIF_DEBITUR: "",
                    TGL_LAHIR: "",
                    USIA_DEBITUR: "",
               },
          ],
          data_kredit: [
               {
                    JENIS_ASURANSI: null,
                    NAMA_KANTOR: null,
                    KODE_KANTOR: "",
                    NAMA_CABANG: "",
                    KODE_CABANG: "",
                    TARIF_PAYROLL: null,
                    LOAN_TYPE: null,
                    PRODUK: "",
                    SUB_PRODUK: "",
                    SUM_INSURED: "",
                    RENCANA_TANGGAL_PENCAIRAN: "",
                    TENOR: "",
                    TGL_AKHIR_KREDIT: "",
                    USIA_JATUH_TEMPO: "",
               },
          ],
          detail_insurance_life: [
               {
                    KODE_AO: "",
                    EMAIL_DEBITUR: "",
                    GENDER_DEBITUR: null,
                    HEIGHT_DEBITUR: "",
                    WEIGHT_DEBITUR: "",
                    MARITAL_STATUS: null,
               },
          ],
     });
     const handleClickEdit = async (e: FormEvent, data: any) => {
          e.preventDefault();
          getInsuranceType();
          setDataEditPengajuan({
               OFFER_ID: data.OFFER_ID,
               OLD_USIA: data.THE_INSURED_AGE,
               data_debitur: [
                    {
                         NAMA_DEBITUR: data.THE_INSURED_NAME,
                         NIK_DEBITUR: data.THE_INSURED_ID_NUMBER,
                         CIF_DEBITUR: data.THE_INSURED_CIF,
                         TGL_LAHIR: data.THE_INSURED_DATE_OF_BIRTH,
                         USIA_DEBITUR: data.THE_INSURED_AGE,
                    },
               ],
               data_kredit: [
                    {
                         JENIS_ASURANSI: data.JENIS_ASURANSI_ID,
                         NAMA_KANTOR: data.OFFER_BANK_OFFICE_NAME,
                         KODE_KANTOR: data.OFFER_BANK_OFFICE_CODE,
                         NAMA_CABANG: data.OFFER_BANK_BRANCH_NAME,
                         KODE_CABANG: data.OFFER_BANK_BRANCH_CODE,
                         TARIF_PAYROLL: data.TARIF_PAYROLL_ID,
                         LOAN_TYPE: data.LOAN_TYPE_ID,
                         PRODUK: data.product_name,
                         SUB_PRODUK: data.scheme_name,
                         SUM_INSURED: data.OFFER_SUM_INSURED,
                         RENCANA_TANGGAL_PENCAIRAN: data.OFFER_INCEPTION_DATE,
                         TENOR: data.OFFER_TENOR,
                         TGL_AKHIR_KREDIT: data.OFFER_DUE_DATE,
                         USIA_JATUH_TEMPO: data.OFFER_AGE_ON_DUE_DATE,
                    },
               ],
               detail_insurance_life: [
                    {
                         KODE_AO: data.KODE_AO,
                         EMAIL_DEBITUR: data.THE_INSURED_EMAIL,
                         GENDER_DEBITUR: data.THE_INSURED_GENDER,
                         HEIGHT_DEBITUR: data.THE_INSURED_HEIGHT,
                         WEIGHT_DEBITUR: data.THE_INSURED_WEIGHT,
                         MARITAL_STATUS: data.MARITAL_STATUS_ID,
                    },
               ],
          });
          setModalPengajuan({
               add: false,
               detail: false,
               edit: true,
               review: false,
          });
     };

     const handleEditSuccessPengajuan = async (message = "") => {
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
     // end for handle edit

     // for batal pengajuan
     const batalPengajuan = async (idOffer: any) => {
          await axios
               .post(`/batalPengajuan`, { idOffer })
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
     const handleBatal = async (e: FormEvent) => {
          e.preventDefault();
          let idOffer = dataReviewPengajuan.OFFER_ID;
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
                    batalPengajuan(idOffer);
               }
          });
     };
     // end for batal pengajuan

     // for Breadcrumbs
     const forBreadcrumbs = [{ name: "Pengajuan", href: "#", current: true }];

     return (
          <AuthenticatedLayout user={auth.user} header={"Pengajuan Nasabah"}>
               <Head title={"Pengajuan Nasabah"} />

               {/* for alert success */}
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}

               {/* modal for edit pengajuan */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalPengajuan.edit}
                    onClose={() => {
                         setModalPengajuan({
                              add: false,
                              detail: false,
                              edit: false,
                              review: false,
                         });
                    }}
                    title={"Edit Pengajuan"}
                    url={`/editDataPengajuan`}
                    data={dataEditPengajuan}
                    onSuccess={handleEditSuccessPengajuan}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[60%]"
                    }
                    body={
                         <>
                              <EditPengajuanDebitur
                                   auth={auth}
                                   dataEditPengajuan={dataEditPengajuan}
                                   setDataEditPengajuan={setDataEditPengajuan}
                                   insuranceType={insuranceType}
                                   tarifPayroll={tarifPayroll}
                                   loanType={loanType}
                                   arrMaritalStatus={arrMaritalStatus}
                              />
                         </>
                    }
               />
               {/* end modal for model pengajuan */}

               {/* for detail staging */}
               <ModalToAction
                    show={modalDetailStaging.detail}
                    onClose={() => {
                         setModalDetailStaging({
                              detail: false,
                         });
                    }}
                    buttonAddOns={""}
                    title={"History Status Pengajuan"}
                    url={``}
                    data={undefined}
                    onSuccess={undefined}
                    method={""}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[45%]"
                    }
                    submitButtonName={""}
                    body={
                         <>
                              <div>
                                   <DataTables
                                        columns={[
                                             {
                                                  name: "Status Proses",
                                                  selector: (row: any) =>
                                                       row.staging_pengajuan_name,
                                                  sortable: true,
                                             },
                                             {
                                                  name: "Tanggal Proses",
                                                  selector: (row: any) =>
                                                       row.user_login +
                                                       ", " +
                                                       dateFormat(
                                                            row.offer_staging_date,
                                                            "dd mmm yyyy HH:MM:ss"
                                                       ),
                                                  sortable: true,
                                             },
                                        ]}
                                        url={`/getHistoryPengajuan/${idOfferHistoryPengajuan}`}
                                        search={undefined}
                                        refreshTrigger={"ada"}
                                        handleDoubleClick={undefined}
                                   />
                              </div>
                         </>
                    }
               />
               {/* end for detail staging */}

               {/* modal for Konfirmasi Broker Ke Bank */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalCatatanKonfirmasi.add}
                    onClose={() => {
                         setModalCatatanKonfirmasi({
                              add: false,
                         });
                         // setModalPengajuan({
                         //      add: false,
                         //      detail: false,
                         //      edit: false,
                         //      review: true,
                         // });
                    }}
                    title={"Catatan Konfirmasi Broker Ke Bank"}
                    url={`/addCatatanKonfirmasi`}
                    data={dataCatatanKonfirmasi}
                    onSuccess={handleSuccessKonfirmasiKeBroker}
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
                                                  dataCatatanKonfirmasi.CATATAN_BROKER_ISI
                                             }
                                             onChange={(e: any) => {
                                                  setDataCatatanKonfirmasi({
                                                       ...dataCatatanKonfirmasi,
                                                       OFFER_ID:
                                                            dataReviewPengajuan?.OFFER_ID,
                                                       CATATAN_BROKER_ISI:
                                                            e.target.value,
                                                       CATATAN_BROKER_FOR: 0,
                                                  });
                                             }}
                                        />
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end modal for Konfirmasi Broker Ke Bank */}

               {/* modal for Ajukan Ke Broker */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalAjukanKeBroker.add}
                    onClose={() => {
                         setModalAjukanKeBroker({
                              add: false,
                         });
                         // setModalPengajuan({
                         //      add: false,
                         //      detail: false,
                         //      edit: false,
                         //      review: true,
                         // });
                    }}
                    title={"Catatan Ajukan Ke Broker"}
                    url={`/addCatatanAjukanKeBroker`}
                    data={dataCatatanAjukan}
                    onSuccess={handleSuccessAjukanKeBroker}
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
                                                  dataCatatanKonfirmasi.CATATAN_BROKER_ISI
                                             }
                                             onChange={(e: any) => {
                                                  setDataCatatanAjukan({
                                                       ...dataCatatanAjukan,
                                                       OFFER_ID:
                                                            dataReviewPengajuan?.OFFER_ID,
                                                       CATATAN_BROKER_ISI:
                                                            e.target.value,
                                                       CATATAN_BROKER_FOR: 0,
                                                  });
                                             }}
                                        />
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end modal for Ajukan Ke Broker */}

               {/* for modal add pengajuan */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalPengajuan.add}
                    onClose={() =>
                         setModalPengajuan({
                              add: false,
                              detail: false,
                              edit: false,
                              review: false,
                         })
                    }
                    title={"Pengajuan Debitur Baru"}
                    url={`/addPengajuanDebitur`}
                    data={dataPengajuanDebitur}
                    onSuccess={handleSuccessPengajuanDebitur}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[60%]"
                    }
                    body={
                         <>
                              <AddPengajuanDebitur
                                   setDataPengajuanDebitur={
                                        setDataPengajuanDebitur
                                   }
                                   dataPengajuanDebitur={dataPengajuanDebitur}
                                   dataTheInsured={dataTheInsured}
                                   insuranceType={insuranceType}
                                   dataComboBankBranch={dataComboBankBranch}
                                   tarifPayroll={tarifPayroll}
                                   loanType={loanType}
                                   auth={auth}
                                   arrMaritalStatus={arrMaritalStatus}
                              />
                         </>
                    }
               />
               {/* end for modal add pengajuan */}
               <ModalToAction
                    show={modalPengajuan.review}
                    onClose={() => {
                         setModalPengajuan({
                              add: false,
                              detail: false,
                              edit: false,
                              review: false,
                         });
                         setUrlOfferDetail("");
                    }}
                    buttonAddOns={""}
                    actionKonfirmasiKeBroker={handleKonfirmasiKeBroker}
                    buttonKonfirmasiKeBroker={
                         (auth.user.user_type_id === 3 &&
                              dataReviewPengajuan?.OFFER_STAGING_ID === 3) ||
                         (auth.user.user_type_id === 3 &&
                              dataReviewPengajuan?.OFFER_STAGING_ID === 10)
                              ? "Konfirmasi Broker Ke Bank"
                              : ""
                    }
                    actionAjukanKeBroker={handleAjukanKeBroker}
                    buttonAjukanKeBroker={
                         auth.user.user_type_id !== 2 ||
                         dataReviewPengajuan?.OFFER_STAGING_ID !== 5
                              ? ""
                              : "Ajukan Ke Broker"
                    }
                    actionBatal={handleBatal}
                    buttonBatal={auth.user.user_type_id === 4 ? "" : "Batal"}
                    title={"Review Pengajuan Debitur"}
                    url={``}
                    data={undefined}
                    onSuccess={undefined}
                    method={""}
                    headers={null}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[95%]"
                    }
                    submitButtonName={""}
                    body={
                         <>
                              {loaderFetch === true ? (
                                   <Loader />
                              ) : (
                                   <ReviewPengajuanDebitur
                                        auth={auth}
                                        dataReviewPengajuan={
                                             dataReviewPengajuan
                                        }
                                        arrDoc={arrDoc}
                                        setIsSuccess={setIsSuccess}
                                        isSuccess={isSuccess}
                                        getReviewPengajuanDebitur={
                                             getReviewPengajuanDebitur
                                        }
                                        rateHistory={rateHistory}
                                        urlOfferDetail={urlOfferDetail}
                                        arrCatatan={arrCatatan}
                                        setRefreshTrigger={setRefreshTrigger}
                                        setModalPengajuan={setModalPengajuan}
                                        getOfferDetail={getOfferDetail}
                                        arrInsurance={arrInsurance}
                                        arrGetAllMekanisme={arrGetAllMekanisme}
                                   />
                              )}
                         </>
                    }
               />
               {/* Modal To Action */}
               {/* section for index pengajuan debitur  */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div className="">
                              <span className="text-lg font-bold text-[#0A47FF]">
                                   Pengajuan
                              </span>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>
                         <div className="flex gap-2">
                              <div
                                   className="p-3 bg-[#0A47FF] text-xs text-white rounded-md shadow-lg hover:cursor-pointer hover:bg-blue-800"
                                   onClick={(e: any) => {
                                        handlePengajuanDebitur(e);
                                   }}
                              >
                                   <span>Tambah Pengajuan</span>
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
                                        placeholder="Search for Kode Aplikasi, Nama Nasabah, Status dll"
                                        value={searchPengajuan}
                                        onChange={(e: any) => {
                                             setSearchPengajuan(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                             if (e.key === "Enter") {
                                                  setRefreshTrigger("success");
                                                  setTimeout(() => {
                                                       setRefreshTrigger("");
                                                  }, 1000);
                                             }
                                        }}
                                        search={searchPengajuan}
                                        setSearch={setSearchPengajuan}
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
                                                       {auth.user
                                                            .user_type_id ===
                                                       1 ? (
                                                            <div className="flex gap-2">
                                                                 <div
                                                                      className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                      title="Review"
                                                                      onClick={(
                                                                           e: any
                                                                      ) => {
                                                                           handleClickReviewOffer(
                                                                                e,
                                                                                row.OFFER_ID
                                                                           );
                                                                      }}
                                                                 >
                                                                      <span>
                                                                           <EyeIcon className="w-5 text-primary-adele" />
                                                                      </span>
                                                                 </div>
                                                                 <div
                                                                      className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                      title="Edit"
                                                                 >
                                                                      <span>
                                                                           <PencilSquareIcon className="w-5 text-primary-adele" />
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       ) : (
                                                            <>
                                                                 {(auth.user
                                                                      .user_type_id ===
                                                                      2 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           4) || // for bank dan terima konfirmasi dari broker
                                                                 (auth.user
                                                                      .user_type_id ===
                                                                      3 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           2) || // for broker dan terima broker dari cabang
                                                                 (auth.user
                                                                      .user_type_id ===
                                                                      4 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           6) || // for insurance dan diterima asuransi
                                                                 (auth.user
                                                                      .user_type_id ===
                                                                      3 &&
                                                                      row.OFFER_STAGING_ID ===
                                                                           9) ? ( // for broker dan diterima broker dari cabang
                                                                      <div
                                                                           className="bg-primary-adele text-white p-2 rounded-md shadow-md hover:cursor-pointer hover:bg-blue-800"
                                                                           onClick={(
                                                                                e
                                                                           ) => {
                                                                                handleTerimaPengajuan(
                                                                                     e,
                                                                                     row.OFFER_ID
                                                                                );
                                                                           }}
                                                                      >
                                                                           {row.OFFER_STAGING_ID ===
                                                                                2 ||
                                                                           row.OFFER_STAGING_ID ===
                                                                                6 ||
                                                                           row.OFFER_STAGING_ID ===
                                                                                9
                                                                                ? "Terima Pengajuan"
                                                                                : "Terima Konfirmasi"}
                                                                      </div>
                                                                 ) : (
                                                                      <div className="flex gap-2">
                                                                           <div
                                                                                className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                                title="Review"
                                                                                onClick={(
                                                                                     e: any
                                                                                ) => {
                                                                                     handleClickReviewOffer(
                                                                                          e,
                                                                                          row.OFFER_ID
                                                                                     );
                                                                                }}
                                                                           >
                                                                                <span>
                                                                                     <EyeIcon className="w-5 text-primary-adele" />
                                                                                </span>
                                                                           </div>
                                                                           {auth
                                                                                .user
                                                                                .user_type_id ===
                                                                                2 && (
                                                                                <div
                                                                                     className="text-xs p-2 w-fit hover:cursor-pointer"
                                                                                     title="Edit"
                                                                                     onClick={(
                                                                                          e
                                                                                     ) => {
                                                                                          handleClickEdit(
                                                                                               e,
                                                                                               row
                                                                                          );
                                                                                     }}
                                                                                >
                                                                                     <span>
                                                                                          <PencilSquareIcon className="w-5 text-primary-adele" />
                                                                                     </span>
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 )}
                                                            </>
                                                       )}
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
                                             name: (
                                                  <div className="flex gap-2 w-full items-center justify-between">
                                                       <div>
                                                            <span>
                                                                 Kode Aplikasi
                                                            </span>
                                                       </div>
                                                       <div
                                                            className="hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                 alert("alo");
                                                            }}
                                                       ></div>
                                                  </div>
                                             ),
                                             selector: (row: any) => {
                                                  var display = "";
                                                  var bankInsuranceId =
                                                       row.BANK_INSURANCE_ID;
                                                  var usia =
                                                       row.OFFER_AGE_ON_DUE_DATE.trim();
                                                  var usiaAge =
                                                       row.THE_INSURED_AGE;
                                                  var loanType =
                                                       row.LOAN_TYPE_ID;

                                                  var tglLahir =
                                                       row.THE_INSURED_DATE_OF_BIRTH;
                                                  var tglAkhirKredit =
                                                       row.OFFER_DUE_DATE;

                                                  var convertTglLahir =
                                                       new Date(tglLahir);
                                                  var converTglAkhirKredit =
                                                       new Date(tglAkhirKredit);

                                                  let age =
                                                       converTglAkhirKredit.getFullYear() -
                                                       convertTglLahir.getFullYear();
                                                  let month =
                                                       converTglAkhirKredit.getMonth() -
                                                       convertTglLahir.getMonth();
                                                  let day =
                                                       converTglAkhirKredit.getDate() -
                                                       convertTglLahir.getDate();

                                                  if (day < 0) {
                                                       month -= 1; // Pinjam satu month
                                                       let bulanSebelumnya =
                                                            new Date(
                                                                 converTglAkhirKredit.getFullYear(),
                                                                 converTglAkhirKredit.getMonth(),
                                                                 0
                                                            );
                                                       day +=
                                                            bulanSebelumnya.getDate(); // Tambahkan jumlah hari month sebelumnya
                                                  }

                                                  if (month < 0) {
                                                       age -= 1; // Pinjam satu tahun
                                                       month += 12; // Tambahkan 12 bulan
                                                  }

                                                  if (
                                                       usia ==
                                                       "NaN Tahun NaN Bulan NaN Hari"
                                                  ) {
                                                       display += "-";
                                                  } else {
                                                       if (
                                                            loanType >= "14" &&
                                                            loanType <= "17" &&
                                                            usiaAge > "55" &&
                                                            bankInsuranceId ==
                                                                 null
                                                       ) {
                                                            display += "-";
                                                       } else {
                                                            if (
                                                                 age >= 70 &&
                                                                 month >= 0 &&
                                                                 day >= 0
                                                            ) {
                                                                 if (
                                                                      age ==
                                                                           70 &&
                                                                      month ==
                                                                           0 &&
                                                                      day == 0
                                                                 ) {
                                                                      display +=
                                                                           row.OFFER_SUBMISSION_CODE;
                                                                 } else {
                                                                      // if (bankInsuranceId != null) {
                                                                      //     display += row.OFFER_SUBMISSION_CODE;
                                                                      // } else {
                                                                      display +=
                                                                           "-";
                                                                      // }
                                                                 }
                                                            } else {
                                                                 display +=
                                                                      row.OFFER_SUBMISSION_CODE;
                                                            }
                                                       }
                                                  }
                                                  return display;
                                             },
                                             // {}

                                             // row.OFFER_SUBMISSION_CODE,
                                             // sortable: true,
                                             width: "200px",
                                        },
                                        {
                                             name: "Nama Debitur",
                                             selector: (row: any) =>
                                                  row.THE_INSURED_NAME,
                                             sortable: true,
                                             width: "240px",
                                        },
                                        {
                                             name: "Status Pengajuan",
                                             selector: (row: any) =>
                                                  row.staging_pengajuan_name,
                                             sortable: true,
                                             width: "250px",
                                             cell: (row: any) => (
                                                  <>
                                                       <span
                                                            className="underline hover:cursor-pointer"
                                                            onClick={(e) => {
                                                                 handleClickDetailStaging(
                                                                      e,
                                                                      row.OFFER_ID
                                                                 );
                                                            }}
                                                       >
                                                            {
                                                                 row.staging_pengajuan_name
                                                            }
                                                       </span>
                                                  </>
                                             ),
                                        },
                                        {
                                             name: "Insurance",
                                             selector: (row: any) =>
                                                  row.INSURANCE_NAME === null
                                                       ? "-"
                                                       : row.INSURANCE_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Status Proses",
                                             selector: (row: any) =>
                                                  row.offer_status_name,
                                             sortable: true,
                                        },
                                        {
                                             name: "Tanggal Lahir",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.THE_INSURED_DATE_OF_BIRTH,
                                                       "dd mmm yyyy"
                                                  ),
                                             sortable: true,
                                        },
                                        {
                                             name: "Usia",
                                             selector: (row: any) =>
                                                  row.THE_INSURED_AGE,
                                             sortable: true,
                                        },
                                        {
                                             name: "Uang Pertanggungan",
                                             selector: (row: any) =>
                                                  row.OFFER_SUM_INSURED,
                                             format: (row: any) => {
                                                  return new Intl.NumberFormat(
                                                       "en-US",
                                                       {
                                                            style: "decimal",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                       }
                                                  ).format(
                                                       row.OFFER_SUM_INSURED
                                                  );
                                             },
                                             right: "true",
                                             sortable: true,
                                        },
                                        {
                                             name: "Tenor (Bulan)",
                                             selector: (row: any) =>
                                                  row.OFFER_TENOR,
                                             sortable: true,
                                        },
                                        {
                                             name: "Sumber Pembayaran",
                                             selector: (row: any) =>
                                                  row.TARIF_PAYROLL_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Jenis Asuransi",
                                             selector: (row: any) =>
                                                  row.JENIS_ASURANSI_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Tanggal Awal Kredit",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.OFFER_INCEPTION_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             sortable: true,
                                        },
                                        {
                                             name: "Tanggal Akhir Kredit",
                                             selector: (row: any) =>
                                                  dateFormat(
                                                       row.OFFER_DUE_DATE,
                                                       "dd mmm yyyy"
                                                  ),
                                             sortable: true,
                                        },
                                        {
                                             name: "Usia Pada Jatuh Tempo",
                                             selector: (row: any) =>
                                                  row.OFFER_AGE_ON_DUE_DATE,
                                             sortable: true,
                                             width: "200px",
                                        },
                                        {
                                             name: "Loan Type",
                                             selector: (row: any) =>
                                                  row.loan_type_name,
                                             sortable: true,
                                        },
                                        {
                                             name: "Cabang",
                                             selector: (row: any) =>
                                                  row.OFFER_BANK_OFFICE_NAME,
                                             sortable: true,
                                        },
                                        {
                                             name: "Created",
                                             selector: (row: any) =>
                                                  row.user_login +
                                                  ", " +
                                                  dateFormat(
                                                       row.OFFER_CREATED_DATE,
                                                       "dd mmm yyyy HH:MM:ss"
                                                  ),
                                             sortable: true,
                                             width: "240px",
                                        },
                                   ]}
                                   url={"/getOffer"}
                                   search={searchPengajuan}
                                   refreshTrigger={refreshTrigger}
                                   filter={filter}
                                   handleDoubleClick={undefined}
                              />
                         </div>
                         {/* End Content */}
                    </div>
                    {/* end body section */}
               </section>
               {/* end section for index pengajuan debitur */}
          </AuthenticatedLayout>
     );
}
