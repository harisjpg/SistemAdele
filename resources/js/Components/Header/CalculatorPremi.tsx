import { useEffect, useRef, useState, Fragment, FormEvent } from "react";
import { Link, usePage } from "@inertiajs/react";

import {
     ArrowUpCircleIcon,
     CalculatorIcon,
     ChevronDownIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";

import Swal from "sweetalert2";
import SelectTailwind from "react-tailwindcss-select";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";

import axios from "axios";
import DatePickerFlowBite from "../DatePicker";
import dateFormat from "dateformat";
import CurrencyInput from "react-currency-input-field";
import ToastMessage from "../ToastMessage";
import ModalCalculatePremi from "../Modal/ModalCalculatePremi";

const CalculatorPremi = () => {
     const { auth }: any = usePage().props;

     // for run first function

     //  for modal calculator premi
     const [modalCalculator, setModalCalculatorPremi] = useState<any>({
          calculate: false,
     });

     const [isSuccess, setIsSuccess] = useState<string>("");

     const [resultCalculate, setResultCalculate] = useState<boolean>(false);
     const [topUpButton, setTopUpButton] = useState<boolean>(false);
     const bottomRef = useRef<HTMLDivElement>(null);
     const bottomUp = useRef<HTMLDivElement>(null);
     useEffect(() => {
          if (topUpButton === true) {
               bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          } else {
               bottomUp.current?.scrollIntoView({ behavior: "smooth" });
          }
     }, [topUpButton]);

     // get function type insurance
     const [insuranceType, setInsuranceType] = useState<any>([]);
     const getTypeInsurance = async () => {
          await axios
               .post(`/getInsuranceType`, {})
               .then((res) => {
                    setInsuranceType(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // get function sumber pembayaran
     const [tarifPayroll, setTarifPayroll] = useState<any>([]);
     const getSumberPembayaran = async () => {
          await axios
               .post(`/getSumberPembayaran`, {})
               .then((res) => {
                    setTarifPayroll(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // for function handle click modal calculator premi
     const handleClickForModalCalculatorPremi = async (e: FormEvent) => {
          e.preventDefault();
          setModalCalculatorPremi({
               calculate: !modalCalculator.calculate,
          });
          getTypeInsurance();
          getSumberPembayaran();
     };

     const selectTarifPayroll = tarifPayroll?.map((query: any) => {
          return {
               value: query.TARIF_PAYROLL_ID,
               label: query.TARIF_PAYROLL_NAME,
          };
     });

     const selectInsurance = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });

     // for data calculate premi
     const [dataCalculate, setDataCalculate] = useState<any>({
          TYPE_INSURANCE: null,
          TYPE_PAYROLL: null,
          TGL_LAHIR: null,
          RENCANA_TGL_PENCAIRAN: null,
          USIA_DEBITUR: null,
          TGL_AKHIR_KREDIT: "",
          TENOR: null,
          SUM_INSURED: null,
     });

     // for function handle rencana tanggal pencairan
     const handleDateTglRencana = async (date: Date) => {
          // perhitungan usia ketika tanggal pencairan
          let tglLahir = dataCalculate.TGL_LAHIR;
          let dob: any = new Date(tglLahir);
          let today: any = new Date(date.toLocaleDateString("en-CA"));

          // Menghitung usia berdasarkan tahun
          let age: any = today.getFullYear() - dob.getFullYear();

          // Mengecek apakah ulang tahun sudah lewat atau belum
          const currentMonth = today.getMonth();
          const currentDate = today.getDate();
          const birthMonth = dob.getMonth();
          const birthDay = dob.getDate();

          if (
               currentMonth < birthMonth ||
               (currentMonth === birthMonth && currentDate < birthDay)
          ) {
               age--;
          }

          // perhitungan usia tempo dan tanggal akhir menggunakan tenor
          var tenor: any = 0;
          let cekTenor = dataCalculate.TENOR;
          if (cekTenor !== null) {
               tenor = cekTenor;
          }
          let convertTanggalAwal = new Date(today);
          let akhir = convertTanggalAwal.setMonth(
               convertTanggalAwal.getMonth() + parseInt(tenor)
          );
          let akhirDate = new Date(akhir);

          setDataCalculate({
               ...dataCalculate,
               RENCANA_TGL_PENCAIRAN: date.toLocaleDateString("en-CA"),
               USIA_DEBITUR: age,
               TGL_AKHIR_KREDIT: akhirDate.toLocaleDateString("en-CA"),
          });
          // end perhitungan usia ketika tanggal pencairan
     };

     const getTglAkhirUsiaTempo = async (e: any) => {
          // get tanggal akhir
          let tanggalAwal = dataCalculate.RENCANA_TGL_PENCAIRAN;

          let convertTanggalAwal = new Date(tanggalAwal);
          let akhir = convertTanggalAwal.setMonth(
               convertTanggalAwal.getMonth() + parseInt(e)
          );
          let akhirDate = new Date(akhir);
          if (isNaN(akhirDate.getTime())) {
               setDataCalculate({
                    ...dataCalculate,
                    TGL_AKHIR_KREDIT: "",
                    TENOR: e,
               });
          } else {
               setDataCalculate({
                    ...dataCalculate,
                    TGL_AKHIR_KREDIT: akhirDate.toLocaleDateString("en-CA"),
                    TENOR: e,
               });
          }
          // end get tanggal akhir
     };

     const [resultArrayCalculate, setResultArrayCalculate] = useState<any>([]);
     const handleSuccessCalculate = async (message = "") => {
          if (message != "") {
               setResultArrayCalculate(message[1]);

               setIsSuccess("");
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 2000);
               setResultCalculate(true);
               setTopUpButton(true);
          }
     };

     // for function reset calculation
     const resetCalculate = async (e: FormEvent) => {
          setResultCalculate(false);
          setDataCalculate({
               TYPE_INSURANCE: null,
               TYPE_PAYROLL: null,
               TGL_LAHIR: null,
               RENCANA_TGL_PENCAIRAN: null,
               USIA_DEBITUR: "",
               TGL_AKHIR_KREDIT: "",
               TENOR: null,
               SUM_INSURED: null,
          });
     };

     return (
          <>
               {/* Modal Calculator Premi */}
               <ModalCalculatePremi
                    show={modalCalculator.calculate}
                    onClose={() => {
                         setModalCalculatorPremi({
                              calculate: false,
                         });
                         setResultCalculate(false);
                         setDataCalculate({
                              TYPE_INSURANCE: null,
                              TYPE_PAYROLL: null,
                              TGL_LAHIR: null,
                              RENCANA_TGL_PENCAIRAN: null,
                              USIA_DEBITUR: "",
                              TGL_AKHIR_KREDIT: "",
                              TENOR: null,
                              SUM_INSURED: null,
                         });
                    }}
                    buttonAddOns={"Reset"}
                    title={"Calculator Premi"}
                    url={`calculatePremi`}
                    data={dataCalculate}
                    onSuccess={handleSuccessCalculate}
                    method={"post"}
                    headers={null}
                    actionDelete={resetCalculate}
                    // buttonAddOns={"Reset"}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[53%] xs:w-full"
                    }
                    submitButtonName={"Calculate"}
                    body={
                         <>
                              {/* for alert success */}
                              {isSuccess && (
                                   <ToastMessage
                                        message={isSuccess}
                                        isShow={true}
                                        type={"success"}
                                   />
                              )}
                              <section ref={bottomUp}>
                                   <div className="grid lg:grid-cols-2 xs:grid-cols-1 lg:gap-4 xs:gap-0">
                                        <div>
                                             <InputLabel
                                                  value="Jenis Insurance"
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                       menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-primary-adele`
                                                                      : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectInsurance}
                                                  isSearchable={true}
                                                  isClearable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={
                                                       dataCalculate.TYPE_INSURANCE
                                                  }
                                                  onChange={(val: any) => {
                                                       setDataCalculate({
                                                            ...dataCalculate,
                                                            TYPE_INSURANCE: val,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                        </div>
                                        <div className="">
                                             <InputLabel
                                                  value="Sumber Pembayaran"
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                       menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-primary-adele`
                                                                      : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectTarifPayroll}
                                                  isSearchable={true}
                                                  isClearable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={
                                                       dataCalculate.TYPE_PAYROLL
                                                  }
                                                  onChange={(val: any) => {
                                                       setDataCalculate({
                                                            ...dataCalculate,
                                                            TYPE_PAYROLL: val,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                        </div>
                                   </div>
                                   <div className="grid lg:grid-cols-2 xs:grid-cols-1 lg:gap-4 xs:gap-0 mt-2">
                                        <div className="">
                                             <InputLabel
                                                  value="Tanggal Lahir"
                                                  required={true}
                                             />
                                             <DatePickerFlowBite
                                                  value={
                                                       dataCalculate.TGL_LAHIR
                                                            ? dateFormat(
                                                                   dataCalculate.TGL_LAHIR,
                                                                   "dd-mm-yyyy"
                                                              )
                                                            : "dd-mm-yyyy"
                                                  }
                                                  onSelectedDateChanged={(
                                                       date: Date
                                                  ) => {
                                                       setDataCalculate({
                                                            ...dataCalculate,
                                                            TGL_LAHIR:
                                                                 date.toLocaleDateString(
                                                                      "en-CA"
                                                                 ),
                                                       });
                                                  }}
                                                  className={
                                                       "ring-1 rounded-md focus:!ring-primary-adele"
                                                  }
                                             />
                                        </div>
                                        <div className="">
                                             <InputLabel
                                                  value="Rencana Tanggal Pencairan"
                                                  required={true}
                                             />
                                             <DatePickerFlowBite
                                                  value={
                                                       dataCalculate.RENCANA_TGL_PENCAIRAN
                                                            ? dateFormat(
                                                                   dataCalculate.RENCANA_TGL_PENCAIRAN,
                                                                   "dd-mm-yyyy"
                                                              )
                                                            : "dd-mm-yyyy"
                                                  }
                                                  onSelectedDateChanged={(
                                                       date: Date
                                                  ) => {
                                                       handleDateTglRencana(
                                                            date
                                                       );
                                                  }}
                                                  className={
                                                       "ring-1 rounded-md focus:!ring-primary-adele"
                                                  }
                                             />
                                        </div>
                                   </div>
                                   <div className="grid lg:grid-cols-2 xs:grid-cols-1 lg:gap-4 xs:gap-0 mt-2">
                                        <div className="">
                                             <InputLabel
                                                  value="Usia Debitur"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1 bg-gray-300"
                                                  disabled
                                                  placeholder="Usia Debitur"
                                                  value={
                                                       dataCalculate.USIA_DEBITUR !==
                                                       null
                                                            ? dataCalculate.USIA_DEBITUR
                                                            : ""
                                                  }
                                                  required
                                                  onChange={(e: any) => {}}
                                             />
                                        </div>
                                        <div className="">
                                             <InputLabel
                                                  value="Tanggal Akhir Kredit"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1 bg-gray-300"
                                                  disabled
                                                  placeholder="Tanggal Akhir Kredit"
                                                  value={
                                                       dataCalculate.TGL_AKHIR_KREDIT !==
                                                       ""
                                                            ? dateFormat(
                                                                   dataCalculate.TGL_AKHIR_KREDIT,
                                                                   "dd-mm-yyyy"
                                                              )
                                                            : ""
                                                  }
                                                  required
                                                  onChange={(e: any) => {}}
                                             />
                                        </div>
                                   </div>
                                   <div className="grid lg:grid-cols-2 xs:grid-cols-1 lg:gap-4 xs:gap-0 mt-2 xs:mb-2 lg:mb-0">
                                        <div className="">
                                             <InputLabel
                                                  value="Nilai Pertanggungan"
                                                  required={true}
                                             />
                                             <CurrencyInput
                                                  value={
                                                       dataCalculate.SUM_INSURED
                                                  }
                                                  decimalScale={2}
                                                  decimalsLimit={2}
                                                  onValueChange={(val: any) => {
                                                       setDataCalculate({
                                                            ...dataCalculate,
                                                            SUM_INSURED: val,
                                                       });
                                                  }}
                                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-right"
                                                  required
                                                  placeholder="0.00"
                                                  autoComplete="off"
                                             />
                                        </div>
                                        <div className="">
                                             <InputLabel
                                                  value="Tenor (Bulan)"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1"
                                                  placeholder="Tenor"
                                                  value={
                                                       dataCalculate.TENOR !==
                                                       null
                                                            ? dataCalculate.TENOR
                                                            : ""
                                                  }
                                                  required
                                                  onChange={(e: any) => {
                                                       getTglAkhirUsiaTempo(
                                                            e.target.value
                                                       );
                                                  }}
                                             />
                                        </div>
                                   </div>
                              </section>
                              {resultCalculate && (
                                   <section
                                        className="mt-10 ag-layouts-calculator"
                                        ref={bottomRef}
                                   >
                                        <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                             <legend className="ml-5 px-3 font-medium text-sm">
                                                  Result Calculate Premi
                                             </legend>
                                             <div className="px-4 py-2">
                                                  <div className="lg:grid-cols-2 xs:grid-cols-1 grid gap-2">
                                                       {resultArrayCalculate?.map(
                                                            (
                                                                 dataResult: any,
                                                                 index: number
                                                            ) => {
                                                                 return (
                                                                      <div
                                                                           className="card bg-white shadow-lg rounded-md p-3"
                                                                           key={
                                                                                index
                                                                           }
                                                                      >
                                                                           <div>
                                                                                <span className="text-sm font-semibold">
                                                                                     {
                                                                                          dataResult.InsuranceName
                                                                                     }
                                                                                </span>
                                                                           </div>
                                                                           <div className="-mt-3">
                                                                                <span className="text-[9px] text-gray-500">
                                                                                     {`(${dataResult.TyePayroll})`}
                                                                                </span>
                                                                           </div>
                                                                           <div className="flex justify-between mt-2">
                                                                                <div className="text-sm text-gray-700">
                                                                                     <span>
                                                                                          Premi
                                                                                     </span>
                                                                                </div>
                                                                                <div className="text-sm text-gray-700">
                                                                                     <span>
                                                                                          {new Intl.NumberFormat(
                                                                                               "en-US",
                                                                                               {
                                                                                                    style: "decimal",
                                                                                                    minimumFractionDigits: 2,
                                                                                                    maximumFractionDigits: 2,
                                                                                               }
                                                                                          ).format(
                                                                                               dataResult.totalPremi
                                                                                          )}
                                                                                     </span>
                                                                                </div>
                                                                           </div>
                                                                           <div className="flex justify-between">
                                                                                <div className="text-sm text-gray-700">
                                                                                     <span>
                                                                                          Rate
                                                                                     </span>
                                                                                </div>
                                                                                <div className="text-sm text-gray-700">
                                                                                     <span>
                                                                                          {new Intl.NumberFormat(
                                                                                               "en-US",
                                                                                               {
                                                                                                    style: "decimal",
                                                                                                    minimumFractionDigits: 2,
                                                                                                    maximumFractionDigits: 2,
                                                                                               }
                                                                                          ).format(
                                                                                               dataResult.rateRegular
                                                                                          )}
                                                                                     </span>
                                                                                </div>
                                                                           </div>
                                                                      </div>
                                                                 );
                                                            }
                                                       )}
                                                  </div>
                                             </div>
                                        </fieldset>
                                        {topUpButton !== false ? (
                                             <div
                                                  className="fixed lg:bottom-20 xs:bottom-40 right-7 text-blue-700 hover:text-blue-800 hover:cursor-pointer"
                                                  onClick={(e) => {
                                                       e.preventDefault();
                                                       setTopUpButton(false);
                                                  }}
                                             >
                                                  <span>
                                                       <ArrowUpCircleIcon className="lg:w-9 xs:w-12" />
                                                  </span>
                                             </div>
                                        ) : null}
                                   </section>
                              )}
                         </>
                    }
               />
               {/* End Modal Calculator Premi */}

               {/* Icon Calculator */}
               <div
                    className="cursor-pointer"
                    title="Calculator Premi"
                    onClick={(e) => {
                         handleClickForModalCalculatorPremi(e);
                    }}
               >
                    <span>
                         <CalculatorIcon className="w-5 text-gray-400 hover:text-gray-500" />
                    </span>
               </div>
               {/* Icon Calculator */}
          </>
     );
};

export default CalculatorPremi;
