import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectTailwind from "react-tailwindcss-select";
import {
     FormEvent,
     PropsWithChildren,
     useEffect,
     useRef,
     useState,
} from "react";
import CurrencyInput from "react-currency-input-field";
import dateFormat from "dateformat";
import DatePickerFlowBite from "@/Components/DatePicker";
import axios from "axios";
import {
     ArrowDownTrayIcon,
     ArrowUpTrayIcon,
     CheckCircleIcon,
     MinusCircleIcon,
     PencilSquareIcon,
     XMarkIcon,
} from "@heroicons/react/20/solid";

export default function ViewPenawaran({
     arrInsurance,
     filterMekanis,
}: PropsWithChildren<{ arrInsurance: any; filterMekanis: any }>) {
     console.log(arrInsurance);

     return (
          <>
               <fieldset className="pb-10 pt-0 xs:mt-60 lg:mt-2 rounded-lg border-2">
                    <legend className="ml-5 px-3 font-semibold">
                         Penawaran Insurance
                    </legend>
                    <section className="min-w-20 overflow-x-auto custom-scrollbar">
                         {/* for lopping insurance */}
                         <div className="mr-4 mt-4 mb-4 pr-4 pl-4 flex justify-start gap-5">
                              <div className="flex gap-1 flex-col w-full"></div>
                              {arrInsurance?.map(
                                   (dataInsurance: any, index: number) => (
                                        <>
                                             <div key={index}>
                                                  <div className="p-4 bg-white shadow-lg rounded-t-lg w-60">
                                                       {/* nama asuransi */}
                                                       <div className="text-lg mb-10 font-semibold text-center">
                                                            <span>
                                                                 {
                                                                      dataInsurance?.INSURANCE_NAME
                                                                 }
                                                            </span>
                                                       </div>
                                                       {/* nama asuransi */}
                                                       <div className="flex justify-between">
                                                            <div className="text-slate-600">
                                                                 <span>
                                                                      Rate
                                                                 </span>
                                                            </div>
                                                            <div className="font-semibold">
                                                                 <span>
                                                                      3.40
                                                                 </span>
                                                            </div>
                                                       </div>
                                                       <div className="flex justify-between">
                                                            <div className="text-slate-600">
                                                                 <span>
                                                                      Premi
                                                                 </span>
                                                            </div>
                                                            <div className="font-semibold">
                                                                 <span>
                                                                      Rp.
                                                                      1.500.000
                                                                 </span>
                                                            </div>
                                                       </div>
                                                       <div className="text-[11px] mt-5 italic text-slate-400">
                                                            <span>
                                                                 *Perhitungan
                                                                 diatas adalah
                                                                 hasil simulasi
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div className="bg-slate-600 rounded-b-lg p-2 flex justify-center font-semibold text-white hover:cursor-pointer hover:bg-slate-400">
                                                       <span>
                                                            Select Insurance
                                                       </span>
                                                  </div>
                                             </div>
                                        </>
                                   )
                              )}
                         </div>
                         {/* end for looping insurance */}
                         {/* for table */}
                         <div className="mt-2 mr-4 ml-4 pr-4 pl-4 flex justify-between gap-2">
                              <div className="flex gap-1 flex-col w-full">
                                   {filterMekanis?.map(
                                        (dataMekanisme: any, index: number) => (
                                             <div
                                                  key={index}
                                                  className="flex flex-col gap-1"
                                             >
                                                  {/* Card: Jaminan */}
                                                  <div className="p-2 bg-white rounded-md shadow-md min-h-16">
                                                       {
                                                            dataMekanisme.MEKANISME_PRODUK_ASURANSI_JAMINAN
                                                       }
                                                  </div>
                                                  <div className="p-2 bg-white rounded-md shadow-md min-h-16">
                                                       {
                                                            dataMekanisme.MEKANISME_PRODUK_ASURANSI_KAPASITAS
                                                       }
                                                  </div>
                                                  <div className="p-2 bg-white rounded-md shadow-md min-h-16">
                                                       {
                                                            dataMekanisme.MEKANISME_PRODUK_ASURANSI_GANTI_RUGI
                                                       }
                                                  </div>
                                                  <div className="p-2 bg-white rounded-md shadow-md min-h-16">
                                                       {
                                                            dataMekanisme.MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI
                                                       }
                                                  </div>
                                             </div>
                                        )
                                   )}
                              </div>
                              {/* baris 2 */}
                              <div className="flex gap-5">
                                   {arrInsurance?.map(
                                        (dataInsurance: any, index: number) => (
                                             <div key={index} className="mb-8">
                                                  {/* Loop mekanisme */}
                                                  {dataInsurance?.product?.data_mekanisme_produk?.map(
                                                       (
                                                            mekanisme: any,
                                                            i: number
                                                       ) => (
                                                            <div
                                                                 key={i}
                                                                 className="flex flex-col gap-1"
                                                            >
                                                                 {filterMekanis?.map(
                                                                      (
                                                                           dataMekanisme: any,
                                                                           a: number
                                                                      ) => (
                                                                           <div
                                                                                key={
                                                                                     a
                                                                                }
                                                                                className="flex flex-col gap-1"
                                                                           >
                                                                                {/* Card: Jaminan */}
                                                                                <div className="p-2 bg-white rounded-md shadow-md w-60 flex justify-center min-h-16 items-center">
                                                                                     {dataMekanisme.MEKANISME_PRODUK_ASURANSI_JAMINAN ===
                                                                                     mekanisme.MEKANISME_PRODUK_ASURANSI_JAMINAN ? (
                                                                                          <span>
                                                                                               <CheckCircleIcon className="w-6" />
                                                                                          </span>
                                                                                     ) : (
                                                                                          <span>
                                                                                               <MinusCircleIcon className="w-6 text-slate-400" />
                                                                                          </span>
                                                                                     )}
                                                                                </div>
                                                                                <div className="p-2 bg-white rounded-md shadow-md w-60 flex justify-center min-h-16 items-center">
                                                                                     {dataMekanisme.MEKANISME_PRODUK_ASURANSI_KAPASITAS ===
                                                                                     mekanisme.MEKANISME_PRODUK_ASURANSI_KAPASITAS ? (
                                                                                          <span>
                                                                                               <CheckCircleIcon className="w-6" />
                                                                                          </span>
                                                                                     ) : (
                                                                                          <span>
                                                                                               <MinusCircleIcon className="w-6 text-slate-400" />
                                                                                          </span>
                                                                                     )}
                                                                                </div>
                                                                                <div className="p-2 bg-white rounded-md shadow-md w-60 flex justify-center min-h-16 items-center">
                                                                                     {dataMekanisme.MEKANISME_PRODUK_ASURANSI_GANTI_RUGI ===
                                                                                     mekanisme.MEKANISME_PRODUK_ASURANSI_GANTI_RUGI ? (
                                                                                          <span>
                                                                                               <CheckCircleIcon className="w-6" />
                                                                                          </span>
                                                                                     ) : (
                                                                                          <span>
                                                                                               <MinusCircleIcon className="w-6 text-slate-400" />
                                                                                          </span>
                                                                                     )}
                                                                                </div>
                                                                                <div className="p-2 bg-white rounded-md shadow-md w-60 flex justify-center min-h-16 items-center">
                                                                                     {dataMekanisme.MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI ===
                                                                                     mekanisme.MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI ? (
                                                                                          <span>
                                                                                               <CheckCircleIcon className="w-6" />
                                                                                          </span>
                                                                                     ) : (
                                                                                          <span>
                                                                                               <MinusCircleIcon className="w-6 text-slate-400" />
                                                                                          </span>
                                                                                     )}
                                                                                </div>
                                                                           </div>
                                                                      )
                                                                 )}
                                                            </div>
                                                       )
                                                  )}
                                             </div>
                                        )
                                   )}
                              </div>
                         </div>
                         {/* end for table */}
                    </section>
               </fieldset>
          </>
     );
}
