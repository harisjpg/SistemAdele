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
}: PropsWithChildren<{ arrInsurance: any }>) {
     console.log(arrInsurance);

     return (
          <>
               <fieldset className="pb-10 pt-0 xs:mt-60 lg:mt-2 rounded-lg border-2">
                    <legend className="ml-5 px-3 font-semibold">
                         Penawaran Insurance
                    </legend>
                    {/* for lopping insurance */}
                    <div className="mr-4 mt-4 mb-4 flex justify-end gap-5">
                         {arrInsurance?.map(
                              (dataInsurance: any, index: number) => {
                                   return (
                                        <div key={index}>
                                             <div className="p-4 bg-white shadow-lg rounded-t-lg w-60">
                                                  {/* nama asuransi */}
                                                  <div className="text-lg mb-10 font-semibold">
                                                       <span>
                                                            {
                                                                 dataInsurance?.INSURANCE_NAME
                                                            }
                                                       </span>
                                                  </div>
                                                  {/* nama asuransi */}
                                                  <div className="text-slate-600">
                                                       <span>Rate</span>
                                                  </div>
                                                  <div className="font-semibold">
                                                       <span>3.40</span>
                                                  </div>
                                                  <div className="text-slate-600">
                                                       <span>Premi</span>
                                                  </div>
                                                  <div className="font-semibold">
                                                       <span>
                                                            Rp. 1.500.000
                                                       </span>
                                                  </div>
                                                  <div className="text-[11px] mt-5 italic text-slate-400">
                                                       <span>
                                                            *Data diatas
                                                            perhitungan simulasi
                                                       </span>
                                                  </div>
                                             </div>
                                             <div className="bg-slate-600 rounded-b-lg p-2 flex justify-center font-semibold text-white hover:cursor-pointer hover:bg-slate-400">
                                                  <span>Select Insurance</span>
                                             </div>
                                        </div>
                                   );
                              }
                         )}
                    </div>
                    {/* end for looping insurance */}
                    {/* for table */}
                    <div className="mt-2 mr-4 ml-4 flex justify-between gap-2">
                         <div className="flex gap-1 flex-col w-full">
                              <div className="p-2 bg-white rounded-md shadow-md">
                                   <span>Test 3</span>
                              </div>
                              <div className="p-2 bg-white rounded-md shadow-md">
                                   <span>TEST 2</span>
                              </div>
                         </div>
                         <div className="flex gap-5">
                              {arrInsurance?.map(
                                   (dataInsurance: any, index: number) => {
                                        return (
                                             <div className="flex gap-1 flex-col w-60">
                                                  <div className="bg-white rounded-md p-2 font-semibold shadow-md flex justify-center">
                                                       <span>
                                                            {/* <MinusCircleIcon className="w-6 text-slate-600" /> */}
                                                            {
                                                                 dataInsurance?.INSURANCE_NAME
                                                            }
                                                       </span>
                                                  </div>
                                                  <div className="bg-white rounded-md p-2 font-semibold shadow-md flex justify-center">
                                                       <span>
                                                            {/* <CheckCircleIcon className="w-6 text-slate-600" /> */}
                                                            {
                                                                 dataInsurance?.INSURANCE_NAME
                                                            }
                                                       </span>
                                                  </div>
                                             </div>
                                        );
                                   }
                              )}
                         </div>
                    </div>
                    {/* end for table */}
               </fieldset>
          </>
     );
}
