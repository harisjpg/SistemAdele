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
import ModalDetailPenawaran from "@/Components/Modal/ModalDetailPenawaran";
import Loader from "@/Components/Loader";

export default function ViewPenawaran({
     arrInsurance,
     filterMekanis,
     setIsSuccess,
     setModalPengajuan,
     setRefreshTrigger,
     jenisAsuransi,
     idOffer,
     flag = "",
     detailOfferPenawaran,
}: PropsWithChildren<{
     arrInsurance: any;
     filterMekanis: any;
     setIsSuccess: any;
     setModalPengajuan: any;
     setRefreshTrigger: any;
     jenisAsuransi: any;
     idOffer?: any;
     flag?: any;
     detailOfferPenawaran?: any;
}>) {
     // console.log(detailOfferPenawaran, "<aaa");

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
     const [detailAsuransi, setDetailAsuransi] = useState<any>(null);

     const handleClickDetialJaminan = async (dataInsurance: any) => {
          setDetailAsuransi(dataInsurance);
          setDetailModal({
               ...detailModal,
               detail: true,
          });
     };

     useEffect(() => {
          if (flag === "penawaran") {
               handleClickJenisAsuransi(
                    detailOfferPenawaran?.INSURANCE_TYPE_ID,
                    detailOfferPenawaran?.OFFER_ID,
                    flag
               );
          }
     }, [flag]); // jalankan ketika proses penawaran

     // for handle filter jenis asuransi
     const [resultFilter, setResultFilter] = useState<any>([]);
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const handleClickJenisAsuransi = async (
          jenisAsuransiId: any,
          idOffer: any,
          flag: any
     ) => {
          setIsLoading(true);
          await axios
               .post(`/getFilterInsurance`, { jenisAsuransiId, idOffer, flag })
               .then((res) => {
                    setResultFilter(res.data.arrFilterInsurance);
                    setIsLoading(false);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const [indexActive, setIndexActive] = useState<number | null>(null);
     return (
          <>
               {/* for detail */}
               <ModalDetailPenawaran
                    show={detailModal.detail}
                    onClose={() => {
                         setDetailModal({
                              ...detailModal,
                              detail: false,
                         });
                    }}
                    title={`Detail Jaminan Asuransi ${detailAsuransi?.INSURANCE_NAME}`}
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
                                   <div className="text-sm mb-2 font-semibold border-b-2 w-fit border-slate-700">
                                        <span>
                                             Jaminan / Pengecualian Produk
                                             Asuransi
                                        </span>
                                   </div>
                                   {detailAsuransi?.product?.data_mekanisme_produk?.map(
                                        (dataMekanisme: any, i: number) => (
                                             <div key={i}>
                                                  <div className="bg-white rounded-md p-2 flex justify-between text-sm mb-2">
                                                       <div className="w-56">
                                                            <span>
                                                                 {
                                                                      dataMekanisme.MEKANISME_PRODUK_ASURANSI_JAMINAN
                                                                 }
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center justify-center">
                                                            <span>
                                                                 <CheckCircleIcon className="w-6" />
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div className="bg-white rounded-md p-2 flex justify-between text-sm mb-2">
                                                       <div className="w-56">
                                                            <span>
                                                                 {
                                                                      dataMekanisme.MEKANISME_PRODUK_ASURANSI_KAPASITAS
                                                                 }
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center justify-center">
                                                            <span>
                                                                 <CheckCircleIcon className="w-6" />
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div className="bg-white rounded-md p-2 flex justify-between text-sm mb-2">
                                                       <div className="w-56">
                                                            <span>
                                                                 {
                                                                      dataMekanisme.MEKANISME_PRODUK_ASURANSI_GANTI_RUGI
                                                                 }
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center justify-center">
                                                            <span>
                                                                 <CheckCircleIcon className="w-6" />
                                                            </span>
                                                       </div>
                                                  </div>
                                                  <div className="bg-white rounded-md p-2 flex justify-between text-sm mb-2">
                                                       <div className="w-56">
                                                            <span>
                                                                 {
                                                                      dataMekanisme.MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI
                                                                 }
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center justify-center">
                                                            <span>
                                                                 <CheckCircleIcon className="w-6" />
                                                            </span>
                                                       </div>
                                                  </div>
                                             </div>
                                        )
                                   )}
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
                                        {arrInsurance?.map(
                                             (
                                                  dataInsurance: any,
                                                  index: number
                                             ) => (
                                                  <>
                                                       <div
                                                            key={index}
                                                            className="mb-4"
                                                       >
                                                            {/* card */}
                                                            <div className="bg-slate-600 text-white font-semibold rounded-t-md shadow-md p-2 flex justify-center items-center">
                                                                 <span>
                                                                      Simulasi
                                                                      Premi
                                                                 </span>
                                                            </div>
                                                            <div className="bg-white p-2 rounded-b-md shadow-md gap-2">
                                                                 <div className="text-center font-semibold mb-5">
                                                                      <span>
                                                                           {
                                                                                dataInsurance?.INSURANCE_NAME
                                                                           }
                                                                      </span>
                                                                 </div>
                                                                 <div>
                                                                      {/* Rate */}
                                                                      <div className="flex justify-between">
                                                                           <div className="">
                                                                                Rate
                                                                           </div>
                                                                           <div className="font-semibold">
                                                                                <span>
                                                                                     {new Intl.NumberFormat(
                                                                                          "en-US",
                                                                                          {
                                                                                               style: "decimal",
                                                                                               minimumFractionDigits: 2,
                                                                                               maximumFractionDigits: 2,
                                                                                          }
                                                                                     ).format(
                                                                                          dataInsurance
                                                                                               ?.offer_detail[
                                                                                               index
                                                                                          ][
                                                                                               "OFFER_DETAIL_RATE"
                                                                                          ]
                                                                                     )}
                                                                                </span>
                                                                           </div>
                                                                      </div>
                                                                      {/* Premi */}
                                                                      <div className="flex justify-between">
                                                                           <div className="">
                                                                                Premi
                                                                           </div>
                                                                           <div className="font-semibold">
                                                                                <span>
                                                                                     Rp.{" "}
                                                                                     {new Intl.NumberFormat(
                                                                                          "en-US",
                                                                                          {
                                                                                               style: "decimal",
                                                                                               minimumFractionDigits: 2,
                                                                                               maximumFractionDigits: 2,
                                                                                          }
                                                                                     ).format(
                                                                                          dataInsurance
                                                                                               ?.offer_detail[
                                                                                               index
                                                                                          ][
                                                                                               "OFFER_DETAIL_AMOUNT"
                                                                                          ]
                                                                                     )}
                                                                                </span>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                                 <div className="text-xs mt-4 text-left italic text-slate-400">
                                                                      <span>
                                                                           *Simulasi
                                                                           di
                                                                           atas
                                                                           ini
                                                                           belum
                                                                           merupakan
                                                                           penawaran
                                                                           resmi,
                                                                           namun
                                                                           masih
                                                                           membutuhkan
                                                                           proses
                                                                           underwriting.
                                                                      </span>
                                                                 </div>
                                                                 <div className="mt-5 bg-slate-600 p-2 rounded-md text-white text-center">
                                                                      {dataInsurance?.UNDERWRITING_ID ===
                                                                      null ? (
                                                                           <>
                                                                                <span>
                                                                                     Proses
                                                                                     Penawaran
                                                                                </span>
                                                                           </>
                                                                      ) : (
                                                                           <>
                                                                                <span>
                                                                                     Proses
                                                                                     Underwriting
                                                                                </span>
                                                                           </>
                                                                      )}
                                                                 </div>
                                                                 <div
                                                                      className="mt-2 rounded-md text-center font-semibold hover:text-slate-500"
                                                                      onClick={() => {
                                                                           handleClickDetialJaminan(
                                                                                dataInsurance
                                                                           );
                                                                      }}
                                                                 >
                                                                      <span>
                                                                           Klik
                                                                           Untuk
                                                                           Detail
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                            {/* card */}
                                                       </div>
                                                  </>
                                             )
                                        )}
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
                              <section className="p-4">
                                   {/* filter asuransi jiwa, asuransi bundling, asuransi umum, dan asuransi paket */}
                                   <div className="flex gap-4 justify-end">
                                        {flag === "penawaran"
                                             ? jenisAsuransi
                                                    ?.filter(
                                                         (dataFilter: any) =>
                                                              dataFilter.JENIS_ASURANSI_ID ===
                                                              detailOfferPenawaran?.INSURANCE_TYPE_ID
                                                    )
                                                    ?.map(
                                                         (
                                                              arrJenis: any,
                                                              index: number
                                                         ) => (
                                                              <div
                                                                   className={
                                                                        indexActive ===
                                                                             index ||
                                                                        flag ===
                                                                             "penawaran"
                                                                             ? "bg-primary-adele text-white text-sm hover:cursor-pointer hover:bg-primary-hover-adele p-2 rounded-md shadow-md"
                                                                             : "bg-white text-sm hover:cursor-pointer hover:bg-primary-hover-adele p-2 rounded-md shadow-md"
                                                                   }
                                                                   onClick={(
                                                                        e: any
                                                                   ) => {
                                                                        handleClickJenisAsuransi(
                                                                             arrJenis.JENIS_ASURANSI_ID,
                                                                             idOffer,
                                                                             flag
                                                                        );
                                                                        setIndexActive(
                                                                             index
                                                                        );
                                                                   }}
                                                                   key={index}
                                                              >
                                                                   {
                                                                        arrJenis.JENIS_ASURANSI_NAME
                                                                   }
                                                              </div>
                                                         )
                                                    )
                                             : jenisAsuransi?.map(
                                                    (
                                                         arrJenis: any,
                                                         index: number
                                                    ) => (
                                                         <div
                                                              className={
                                                                   indexActive ===
                                                                   index
                                                                        ? "bg-primary-adele text-white text-sm hover:cursor-pointer hover:bg-primary-hover-adele p-2 rounded-md shadow-md"
                                                                        : "bg-white text-sm hover:cursor-pointer hover:bg-primary-hover-adele p-2 rounded-md shadow-md"
                                                              }
                                                              onClick={(
                                                                   e: any
                                                              ) => {
                                                                   handleClickJenisAsuransi(
                                                                        arrJenis.JENIS_ASURANSI_ID,
                                                                        idOffer,
                                                                        flag
                                                                   );
                                                                   setIndexActive(
                                                                        index
                                                                   );
                                                              }}
                                                              key={index}
                                                         >
                                                              {
                                                                   arrJenis.JENIS_ASURANSI_NAME
                                                              }
                                                         </div>
                                                    )
                                               )}
                                   </div>
                                   {isLoading === true ? (
                                        <Loader />
                                   ) : resultFilter.length === 0 ? (
                                        <>
                                             <div className="flex justify-center items-center mt-10">
                                                  <div className="italic text-sm font-semibold text-primary-adele">
                                                       <span>No Data</span>
                                                  </div>
                                             </div>
                                        </>
                                   ) : (
                                        <div className="w-full">
                                             <div className="grid grid-cols-5">
                                                  <div className="col-span-2 ml-4 ">
                                                       {/* for jaminan */}
                                                       <div className="h-[292px]"></div>
                                                       <div className="text-sm font-semibold mb-2 border-b-2 w-fit border-slate-500">
                                                            <span>
                                                                 Jaminan /
                                                                 Pengecualian
                                                                 Produk Asuransi
                                                            </span>
                                                       </div>
                                                       <div className="flex gap-1 flex-col w-full">
                                                            {filterMekanis
                                                                 ?.filter(
                                                                      (
                                                                           dataFilter: any
                                                                      ) =>
                                                                           dataFilter
                                                                                ?.parameter_produk
                                                                                ?.PARAMETER_PRODUK_IS_CATEGORY ===
                                                                           0
                                                                 )
                                                                 ?.map(
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
                                                                                          dataMekanisme
                                                                                               ?.parameter_produk
                                                                                               ?.PARAMETER_PRODUK_NAME
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
                                                            setIsSuccess={
                                                                 setIsSuccess
                                                            }
                                                            setModalPengajuan={
                                                                 setIsSuccess
                                                            }
                                                            setRefreshTrigger={
                                                                 setIsSuccess
                                                            }
                                                            resultFilter={
                                                                 resultFilter
                                                            }
                                                            flag={flag}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </section>
                         </fieldset>
                    </>
               )}
          </>
     );
}
