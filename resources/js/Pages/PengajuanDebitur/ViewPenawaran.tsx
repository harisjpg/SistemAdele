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
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import CardCarousel from "@/Components/Carausel/Carausel";
import ModalToAction from "@/Components/Modal/ModalToAction";

export default function ViewPenawaran({
     arrInsurance,
     filterMekanis,
     setIsSuccess,
     setModalPengajuan,
     setRefreshTrigger,
}: PropsWithChildren<{
     arrInsurance: any;
     filterMekanis: any;
     setIsSuccess: any;
     setModalPengajuan: any;
     setRefreshTrigger: any;
}>) {
     console.log(arrInsurance);

     const prosesSelectInsurance = async (dataInsurance: any) => {
          await axios
               .post(`/selectInsurance`, { dataInsurance })
               .then((res) => {
                    if (res.data[1].original[1] === "Underwriting") {
                         Swal.fire({
                              title: "",
                              text: res.data[1].original[0],
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes",
                         }).then((result) => {
                              if (result.isConfirmed) {
                                   alert("lannjut proses underwriting");
                              } else {
                                   setModalPengajuan({
                                        add: false,
                                        detail: false,
                                        edit: false,
                                        review: false,
                                   });
                                   setIsSuccess("");
                                   setIsSuccess("Pemilihan Asuransi Berhasil");
                                   setRefreshTrigger(res.data[0]);
                                   setTimeout(() => {
                                        setIsSuccess("");
                                   }, 5000);
                                   setTimeout(() => {
                                        setRefreshTrigger("");
                                   }, 1000);
                              }
                         });
                    } else {
                         Swal.fire({
                              title: "",
                              text: res.data[1].original[0],
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes",
                         }).then((result) => {
                              if (result.isConfirmed) {
                                   Inertia.visit("/prosesUnderwriting", {
                                        data: {
                                             filter: "Underwriting",
                                        },
                                   });
                              } else {
                                   setModalPengajuan({
                                        add: false,
                                        detail: false,
                                        edit: false,
                                        review: false,
                                   });
                                   setIsSuccess("");
                                   setIsSuccess("Pemilihan Asuransi Berhasil");
                                   setRefreshTrigger(res.data[0]);
                                   setTimeout(() => {
                                        setIsSuccess("");
                                   }, 5000);
                                   setTimeout(() => {
                                        setRefreshTrigger("");
                                   }, 1000);
                              }
                         });
                    }
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const handleClickSelectInsurance = async (dataInsurance: any) => {
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
                    prosesSelectInsurance(dataInsurance);
               }
          });
     };

     const [detailModal, setDetailModal] = useState<any>({
          detail: false,
     });

     const handleClickDetialJaminan = async () => {
          setDetailModal({
               ...detailModal,
               detail: true,
          });
     };

     return (
          <>
               {/* for detail */}
               <ModalToAction
                    show={detailModal.detail}
                    onClose={() => {
                         setDetailModal({
                              ...detailModal,
                              detail: false,
                         });
                    }}
                    title={`Detail ${"Nama Asuransi"}`}
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
                              <div className="grid grid-cols-1">
                                   <div className="bg-white">
                                        <span>Aloo</span>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* end for detail */}
               {window.innerWidth < 1024 ? (
                    <>
                         <fieldset className="pb-10 pt-0 xs:mt-2 lg:mt-2 rounded-lg border-2 ">
                              <legend className="ml-5 px-3 font-semibold">
                                   Penawaran Insurance
                              </legend>
                              <section>
                                   <div className="grid grid-cols-1 p-4">
                                        {/* card */}
                                        <div className="bg-slate-600 text-white font-semibold rounded-t-md shadow-md p-2 flex justify-center items-center">
                                             <span>Simulasi Premi</span>
                                        </div>
                                        <div className="bg-white p-2 rounded-b-md shadow-md gap-2">
                                             <div className="text-center font-semibold mb-5">
                                                  <span>Nama Asuransi</span>
                                             </div>
                                             <div>
                                                  {/* Rate */}
                                                  <div className="flex justify-between">
                                                       <div className="">
                                                            Rate
                                                       </div>
                                                       <div className="font-semibold">
                                                            3.50
                                                       </div>
                                                  </div>
                                                  {/* Premi */}
                                                  <div className="flex justify-between">
                                                       <div className="">
                                                            Premi
                                                       </div>
                                                       <div className="font-semibold">
                                                            Rp. 4.200.000,00
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="text-xs mt-4 text-left italic text-slate-400">
                                                  <span>
                                                       *Simulasi di atas ini
                                                       belum merupakan penawaran
                                                       resmi, namun masih
                                                       membutuhkan proses
                                                       underwriting.
                                                  </span>
                                             </div>
                                             <div className="mt-5 bg-slate-600 p-2 rounded-md text-white text-center">
                                                  <span>Select Insurance</span>
                                             </div>
                                             <div
                                                  className="mt-2 rounded-md text-center font-semibold hover:text-slate-500"
                                                  onClick={() => {
                                                       handleClickDetialJaminan();
                                                  }}
                                             >
                                                  <span>Klik Untuk Detail</span>
                                             </div>
                                        </div>
                                        {/* card */}
                                   </div>
                              </section>
                         </fieldset>
                    </>
               ) : (
                    <>
                         <fieldset className="pb-10 pt-0 xs:mt-2 lg:mt-2 rounded-lg border-2 ">
                              <legend className="ml-5 px-3 font-semibold">
                                   Penawaran Insurance
                              </legend>
                              <section className="">
                                   <div className="w-full">
                                        <div className="grid grid-cols-5">
                                             <div className="col-span-2 ml-4">
                                                  {/* for jaminan */}
                                                  <div className="h-[296px]"></div>
                                                  <div className="text-sm font-semibold mb-2 border-b-2 w-fit border-slate-500">
                                                       <span>
                                                            Jaminan /
                                                            Pengecualian Produk
                                                            Asuransi
                                                       </span>
                                                  </div>
                                                  <div className="flex gap-1 flex-col w-full">
                                                       {filterMekanis?.map(
                                                            (
                                                                 dataMekanisme: any,
                                                                 index: number
                                                            ) => (
                                                                 <div
                                                                      key={
                                                                           index
                                                                      }
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
                                             </div>
                                             <div className="col-span-3">
                                                  <CardCarousel
                                                       arrInsurance={
                                                            arrInsurance
                                                       }
                                                       filterMekanis={
                                                            filterMekanis
                                                       }
                                                  />
                                             </div>
                                        </div>
                                   </div>
                              </section>
                         </fieldset>
                    </>
               )}
          </>
     );
}
