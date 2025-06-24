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

export default function DetailProsesUnderwriting({
     detailProsesUnderwriting,
}: PropsWithChildren<{ detailProsesUnderwriting: any }>) {
     const formatCurrency = new Intl.NumberFormat("default", {
          style: "currency",
          currency: "IDR",
     });
     console.log(detailProsesUnderwriting, "<< ada");

     return (
          <>
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
                                        {
                                             detailProsesUnderwriting?.THE_INSURED_NAME
                                        }
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
                                             detailProsesUnderwriting?.THE_INSURED_DATE_OF_BIRTH,
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
                                             detailProsesUnderwriting?.THE_INSURED_ID_NUMBER
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
                                        {
                                             detailProsesUnderwriting?.THE_INSURED_AGE
                                        }
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
                                        {
                                             detailProsesUnderwriting?.THE_INSURED_CIF
                                        }
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
                                             detailProsesUnderwriting?.JENIS_ASURANSI_NAME
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
                                             detailProsesUnderwriting?.OFFER_BANK_OFFICE_NAME
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
                                             detailProsesUnderwriting?.TARIF_PAYROLL_NAME
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
                                        {
                                             detailProsesUnderwriting?.loan_type_name
                                        }
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
                                             detailProsesUnderwriting?.OFFER_SUM_INSURED
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
                                             detailProsesUnderwriting?.OFFER_INCEPTION_DATE,
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
                                        {detailProsesUnderwriting?.OFFER_TENOR}{" "}
                                        Bulan
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
                                             detailProsesUnderwriting?.OFFER_DUE_DATE,
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
                                             detailProsesUnderwriting?.OFFER_AGE_ON_DUE_DATE
                                        }
                                   </div>
                              </div>
                         </div>
                    </div>
               </fieldset>
               {/* End For Detail Data Kredit */}

               {/* for proses underwriting */}
               <fieldset className="pb-10 pt-0 rounded-lg border-2">
                    <legend className="ml-5 px-3 font-semibold">
                         Proses Underwriting Insurance{" "}
                         {detailProsesUnderwriting?.INSURANCE_NAME}
                    </legend>
                    {/* list proses underwriting */}
                    <section className="ml-5 mt-2">
                         <div className="grid grid-cols-2 gap-2 text-sm border-b-2 py-5">
                              <div>Apakah debitur dalam keadaan sehat</div>
                              <div className="">
                                   <div>Tidak</div>
                              </div>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm border-b-2 py-5">
                              <div>
                                   Apakah debitur telah menerima vaksin covid 19
                                   sampai dengan dosis 2
                              </div>
                              <div className="">
                                   <div>Tidak</div>
                              </div>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm border-b-2 py-5">
                              <div>
                                   Apakah dalam 5 tahun terakhir Anda pernah
                                   dioperasi/dirawat di Rumah Sakit atau dalam
                                   masa pengobatan/perawatan yang membutuhkan
                                   obat-obatan dalam masa yang lama
                              </div>
                              <div className="">
                                   <div>Tidak</div>
                              </div>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm border-b-2 py-5">
                              <div>
                                   Apakah berat badan Anda berubah dalam 12
                                   bulan terakhir ini
                              </div>
                              <div className="">
                                   <div>Tidak</div>
                              </div>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm border-b-2 py-5">
                              <div>
                                   Apakah Anda pernah atau sedang menderita
                                   penyakit : cacat, tumor/kanker, TBC, asma,
                                   kencing manis, hati, ginjal, stroke, tekanan
                                   darah tinggi, gangguan jiwa atau penyakit
                                   lainnya
                              </div>
                              <div className="">
                                   <div>Tidak</div>
                              </div>
                         </div>
                         <div className="grid grid-cols-2 gap-2 text-sm border-b-2 py-5">
                              <div>
                                   Khusus untuk wanita : Apakah Anda sedang
                                   hamil
                              </div>
                              <div className="">
                                   <div>Tidak</div>
                              </div>
                         </div>
                    </section>
                    {/* end list proses underwriting */}
               </fieldset>
               {/* end for proses underwriting */}
          </>
     );
}
