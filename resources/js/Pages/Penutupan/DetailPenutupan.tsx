import axios from "axios";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import dateFormat from "dateformat";
import Loader from "@/Components/Loader";
import {
     ArrowDownCircleIcon,
     ArrowDownTrayIcon,
} from "@heroicons/react/20/solid";

export default function DetailPenutupan({
     auth,
     idBusinessList,
}: PropsWithChildren<{
     auth: any;
     idBusinessList: any;
}>) {
     useEffect(() => {
          getDetailBusinessList(idBusinessList);
     }, []);

     // for loader
     const [loaderFetch, setLoaderFetch] = useState<any>(true);
     // end for loader
     const [detailBusinessList, setDetailBusinessList] = useState<any>([]);
     const [detailDoc, setDetailDoc] = useState<any>([]);
     const getDetailBusinessList = async (idBusinessList: number) => {
          setLoaderFetch(true);
          await axios
               .post(`/getDetailBusinessList`, { idBusinessList })
               .then((res) => {
                    console.log(res.data.arrDoc);

                    setLoaderFetch(false);
                    setDetailBusinessList(res.data.arrData);
                    setDetailDoc(res.data.arrDoc);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const formatCurrency = new Intl.NumberFormat("default", {
          style: "currency",
          currency: "IDR",
     });

     const handleClickDownload = async (e: FormEvent, idDocument: any) => {
          e.preventDefault();
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
          <>
               {/* loader */}
               {loaderFetch && <Loader />}
               {/* end loader */}
               {!loaderFetch && (
                    <section>
                         {/* for detail debitur */}
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-semibold">
                                   Informasi Debitur
                              </legend>
                              <div className="grid grid-cols-3 px-5 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Nama Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.THE_INSURED_NAME
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Tanggal Lahir
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {dateFormat(
                                                       detailBusinessList?.THE_INSURED_DATE_OF_BIRTH,
                                                       "dd mmm yyyy"
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             NIK Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.THE_INSURED_ID_NUMBER
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="grid grid-cols-3 px-5 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Usia Sekarang
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.THE_INSURED_AGE
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             CIF Debitur
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.THE_INSURED_CIF
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Cabang BJB
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.BankOfficeName
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                         {/* end for detail debitur */}

                         {/* for detail asuransi */}
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-semibold">
                                   Informasi Asuransi
                              </legend>
                              <div className="grid grid-cols-3 px-5 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Nama Asuransi
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.INSURANCE_NAME
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Awal Cover Note
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {dateFormat(
                                                       detailBusinessList?.covernote_date,
                                                       "dd mmm yyyy"
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Akhir Cover Note
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {dateFormat(
                                                       detailBusinessList?.covernote_due_date,
                                                       "dd mmm yyyy"
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="grid grid-cols-3 px-5 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Plafond Kredit
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {formatCurrency.format(
                                                       detailBusinessList?.BUSINESS_LIST_SUM_INSURED
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Cover Note
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.covernote_number
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Status Asuransi
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {detailBusinessList?.BANK_INSURANCE_STATUS ===
                                                  "active"
                                                       ? "Active"
                                                       : "Inactive"}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="grid grid-cols-3 px-5 py-2 gap-4">
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">Rate</div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {new Intl.NumberFormat(
                                                       "en-US",
                                                       {
                                                            style: "decimal",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                       }
                                                  ).format(
                                                       detailBusinessList?.BUSINESS_LIST_RATE
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Usia Ketika Penutupan
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {
                                                       detailBusinessList?.OFFER_AGE_ON_DUE_DATE
                                                  }
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-5 gap-6 bg-white p-1 rounded-md shadow-md">
                                        <div className="col-span-2">
                                             Nilai Premi
                                        </div>
                                        <div className="col-span-3 flex gap-3">
                                             <div>:</div>
                                             <div>
                                                  {formatCurrency.format(
                                                       detailBusinessList?.BUSINESS_LIST_AMOUNT
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                         {/* end for detail asuransi */}

                         {/* for detail document */}
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-semibold">
                                   Informasi Dokumen
                              </legend>
                              <div className="grid grid-cols-12 gap-2 px-5 py-2">
                                   <div className="flex items-center justify-center font-semibold">
                                        No
                                   </div>
                                   <div className="col-span-8 font-semibold">
                                        Dokumen
                                   </div>
                                   <div className="font-semibold">Action</div>
                              </div>
                              {detailDoc?.map((arrDoc: any, index: number) => {
                                   return (
                                        <div
                                             className="grid grid-cols-12 gap-2 px-5 py-2"
                                             key={index}
                                        >
                                             <div className="flex items-center justify-center">
                                                  {index + 1}
                                             </div>
                                             <div className="col-span-8">
                                                  {arrDoc.DOCUMENT_TYPE_NAME}
                                             </div>
                                             <div
                                                  className="hover:cursor-pointer w-fit"
                                                  onClick={(e) => {
                                                       handleClickDownload(
                                                            e,
                                                            arrDoc.DOCUMENT_ID
                                                       );
                                                  }}
                                             >
                                                  <span title="Download">
                                                       <ArrowDownTrayIcon className="w-8 font-semibold rounded-md bg-primary-adele p-2 text-white hover:bg-blue-600" />
                                                  </span>
                                             </div>
                                        </div>
                                   );
                              })}
                         </fieldset>
                         {/* end for detail document */}
                    </section>
               )}
          </>
     );
}
