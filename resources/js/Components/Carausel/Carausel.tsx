// components/Carousel.tsx
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // wajib
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import {
     CheckCircleIcon,
     ChevronLeftIcon,
     ChevronRightIcon,
     MinusCircleIcon,
     XMarkIcon,
} from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";

type CarouselProps = {
     arrInsurance: any;
     filterMekanis: any;
     setIsSuccess: any;
     setModalPengajuan: any;
     setRefreshTrigger: any;
     resultFilter: any;
};

const Carousel: React.FC<CarouselProps> = ({
     arrInsurance,
     filterMekanis,
     setIsSuccess,
     setModalPengajuan,
     setRefreshTrigger,
     resultFilter,
}) => {
     const prevRef = useRef(null);
     const nextRef = useRef(null);

     const [isBeginning, setIsBeginning] = useState(true);
     const [isEnd, setIsEnd] = useState(false);

     const slidesPerView = 3;
     const showNavigation = arrInsurance.length > slidesPerView;

     const prosesSelectInsurance = async (dataInsurance: any) => {
          await axios
               .post(`/selectInsurance`, { dataInsurance })
               .then((res) => {
                    if (res.data[1].original[1] === "Penawaran") {
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
                                   alert("lannjut proses penawaran");
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
          // Swal.fire({
          //      title: "Are you sure?",
          //      text: "",
          //      icon: "question",
          //      showCancelButton: true,
          //      confirmButtonColor: "#3085d6",
          //      cancelButtonColor: "#d33",
          //      confirmButtonText: "Yes",
          // }).then((result) => {
          //      if (result.isConfirmed) {
          prosesSelectInsurance(dataInsurance);
          //      }
          // });
     };

     return (
          <div className="w-full max-w-4xl mx-auto p-4 relative">
               <div className="absolute z-50 w-full top-36">
                    <div className="flex justify-between">
                         <div>
                              <button
                                   ref={prevRef}
                                   // className="px-3 py-1 rounded text-sm hover:cursor-pointer opacity-30 hover:opacity-100"
                                   disabled={isBeginning}
                                   className={` ${
                                        isBeginning
                                             ? "-px-1 py-1 rounded text-sm opacity-20"
                                             : "-px-1 py-1 rounded text-sm"
                                   }`}
                              >
                                   <ChevronLeftIcon className="w-12" />
                              </button>
                         </div>
                         <div>
                              {showNavigation && (
                                   <button
                                        ref={nextRef}
                                        // className="px-3 py-1 rounded text-sm hover:cursor-pointer opacity-30 hover:opacity-100"
                                        disabled={isEnd}
                                        className={` ${
                                             isEnd
                                                  ? "px-6 py-1 rounded text-sm opacity-20"
                                                  : "px-6 py-1 rounded text-sm"
                                        }`}
                                   >
                                        <ChevronRightIcon className="w-12" />
                                   </button>
                              )}
                         </div>
                    </div>
               </div>
               <Swiper
                    slidesPerView={slidesPerView}
                    spaceBetween={10}
                    navigation={
                         showNavigation
                              ? {
                                     prevEl: prevRef.current,
                                     nextEl: nextRef.current,
                                }
                              : false
                    }
                    onSlideChange={(swiper: any) => {
                         setIsBeginning(swiper.isBeginning);
                         setIsEnd(swiper.isEnd);
                    }}
                    onInit={(swiper: any) => {
                         // Assign refs after Swiper is initialized
                         if (typeof swiper.params.navigation !== "boolean") {
                              swiper.params.navigation.prevEl = prevRef.current;
                              swiper.params.navigation.nextEl = nextRef.current;
                              swiper.navigation.init();
                              swiper.navigation.update();
                         }
                         setIsBeginning(swiper.isBeginning);
                         setIsEnd(swiper.isEnd);
                    }}
                    // navigation={true}
                    modules={[Navigation]}
                    className="mySwiper w-full"
               >
                    {/* <div className="flex justify-start">
                         <div className="flex"> */}
                    {resultFilter?.map((dataInsurance: any, index: number) => (
                         <>
                              <SwiperSlide
                                   key={dataInsurance.INSURANCE_ID}
                                   className="mb-2"
                              >
                                   <div className="border rounded-t-lg p-2 flex justify-center font-semibold text-black w-50 shadow-lg">
                                        <span>Simulasi Premi</span>
                                   </div>
                                   <div className="p-4 bg-white shadow-lg w-50 relative max-h-[300px]">
                                        {/* nama asuransi */}
                                        <div className="text-sm mb-10 font-semibold text-center">
                                             <span>
                                                  {
                                                       dataInsurance?.INSURANCE_NAME
                                                  }
                                             </span>
                                        </div>
                                        {/* nama asuransi */}
                                        <div className="flex justify-between">
                                             <div className="text-slate-600 text-sm">
                                                  <span>Rate</span>
                                             </div>
                                             <div className="font-semibold text-sm">
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
                                        <div className="flex justify-between">
                                             <div className="text-slate-600 text-sm">
                                                  <span>Premi</span>
                                             </div>
                                             <div className="font-semibold text-sm">
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
                                        <div className="text-xs mt-5 text-left italic text-slate-400">
                                             <span>
                                                  *Simulasi di atas ini belum
                                                  merupakan penawaran resmi,
                                                  namun masih membutuhkan proses
                                                  underwriting.
                                             </span>
                                        </div>
                                   </div>
                                   <div
                                        className="bg-primary-adele rounded-b-lg p-2 flex justify-center font-semibold text-white hover:cursor-pointer hover:bg-primary-hover-adele w-50 mb-2 text-sm"
                                        onClick={() => {
                                             if (
                                                  dataInsurance?.product
                                                       .UNDERWRITING_ID !== null
                                             ) {
                                                  handleClickSelectInsurance(
                                                       dataInsurance
                                                  );
                                             }
                                        }}
                                   >
                                        {dataInsurance?.product
                                             .UNDERWRITING_ID === null ? (
                                             <>
                                                  <span>Proses Penawaran</span>
                                             </>
                                        ) : (
                                             <>
                                                  <span>
                                                       Proses Underwriting
                                                  </span>
                                             </>
                                        )}
                                   </div>

                                   {dataInsurance?.product?.data_mekanisme_produk?.map(
                                        (mekanisme: any, i: number) => (
                                             <div
                                                  key={i}
                                                  className="flex flex-col gap-1"
                                             >
                                                  {filterMekanis
                                                       ?.filter(
                                                            (dataFilter: any) =>
                                                                 dataFilter
                                                                      ?.parameter_produk
                                                                      ?.PARAMETER_PRODUK_IS_CATEGORY ===
                                                                 0
                                                       )
                                                       ?.map(
                                                            (
                                                                 dataMekanisme: any,
                                                                 a: number
                                                            ) => (
                                                                 <div
                                                                      key={a}
                                                                      className="flex flex-col gap-1"
                                                                 >
                                                                      {/* Card: Jaminan */}
                                                                      <div className="p-2 bg-white rounded-md shadow-md w-50 flex justify-center min-h-16 items-center">
                                                                           {dataMekanisme
                                                                                ?.parameter_produk
                                                                                ?.PARAMETER_PRODUK_NAME ===
                                                                           mekanisme
                                                                                ?.parameter_produk
                                                                                ?.PARAMETER_PRODUK_NAME ? (
                                                                                <span>
                                                                                     <CheckCircleIcon className="w-6" />
                                                                                </span>
                                                                           ) : (
                                                                                <div className="bg-slate-500 rounded-full">
                                                                                     <span>
                                                                                          <XMarkIcon className="w-5 text-white font-semibold" />
                                                                                     </span>
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                            )
                                                       )}
                                             </div>
                                        )
                                   )}
                              </SwiperSlide>
                         </>
                    ))}
                    {/* </div>
                    </div> */}
                    {/* {data.map((item) => (
                         <SwiperSlide key={item.id}>
                              <div className="bg-white shadow rounded-lg p-6 text-center">
                                   {item.title}
                              </div>
                         </SwiperSlide>
                    ))} */}
               </Swiper>
          </div>
     );
};

export default Carousel;
