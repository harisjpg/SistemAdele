import DatePickerFlowBite from "@/Components/DatePicker";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import {
     FormEvent,
     PropsWithChildren,
     useEffect,
     useRef,
     useState,
} from "react";
import CurrencyInput from "react-currency-input-field";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { text } from "stream/consumers";

export default function DetailEditProdukAsuransi({
     setDataEditProdukAsuransi,
     dataEditProdukAsuransi,
     textButton,
     comboUnderwriting,
}: PropsWithChildren<{
     setDataEditProdukAsuransi: any;
     dataEditProdukAsuransi: any;
     textButton: any;
     comboUnderwriting: any;
}>) {
     // for option ganti rugi
     const arrayMaxGantiRugi = [
          {
               id: "1",
               name: "Baki Debet",
          },
          {
               id: "2",
               name: "Bali Debet + (1 x Bunga)",
          },
          {
               id: "3",
               name: "Dll",
          },
          {
               id: "4",
               name: "Dll",
          },
     ];
     const selectGantiRugi = arrayMaxGantiRugi?.map((query: any) => {
          return {
               value: query.id,
               label: query.name,
          };
     });

     const getMaxGantiRugiChoose = (value: any) => {
          if (value) {
               const selected = selectGantiRugi.filter(
                    (option: any) => option.value === value
               );

               return selected[0]?.label;
          }
     };

     const handleClickAddRow = async (e: FormEvent) => {
          e.preventDefault();

          setDataEditProdukAsuransi({
               ...dataEditProdukAsuransi,
               DATA_MEKANISME_PRODUK: [
                    ...dataEditProdukAsuransi.DATA_MEKANISME_PRODUK,
                    {
                         MEKANISME_PRODUK_ASURANSI_JAMINAN: "",
                         MEKANISME_PRODUK_ASURANSI_GANTI_RUGI: "",
                         MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI: null,
                         MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI: "",
                         MEKANISME_PRODUK_ASURANSI_KAPASITAS: "",
                    },
               ],
          });
     };

     const inputDataMekanisme = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [
               ...dataEditProdukAsuransi.DATA_MEKANISME_PRODUK,
          ];
          changeVal[i][name] = value;
          setDataEditProdukAsuransi({
               ...dataEditProdukAsuransi,
               DATA_MEKANISME_PRODUK: changeVal,
          });
     };

     // for combo underwriting
     const selectUnderwriting = comboUnderwriting?.map((query: any) => {
          return {
               value: query.UNDERWRITING_ID,
               label: query.UNDERWRITING_NAME,
          };
     });
     const getLabelUnderwriting = (value: any) => {
          if (value) {
               const selected = selectUnderwriting.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     return (
          <>
               <section>
                    <fieldset className="pb-10 pt-0 rounded-lg border-2">
                         <legend className="ml-5 px-3 font-medium">
                              Data Asuransi
                         </legend>
                         <div className="px-4 py-2">
                              <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-4">
                                   <div>
                                        <InputLabel
                                             className=""
                                             htmlFor="PRODUK_ASURANSI_NAME"
                                             value={"Nama Produk"}
                                             required={
                                                  textButton.textButton ===
                                                  "Edit"
                                                       ? false
                                                       : true
                                             }
                                        />
                                        <TextInput
                                             type="text"
                                             name="PRODUK_ASURANSI_NAME"
                                             value={
                                                  dataEditProdukAsuransi.PRODUK_ASURANSI_NAME
                                             }
                                             className={
                                                  textButton.textButton ===
                                                  "Edit"
                                                       ? "bg-gray-300 text-black ring-1"
                                                       : "ring-1"
                                             }
                                             onChange={(e) => {
                                                  setDataEditProdukAsuransi({
                                                       ...dataEditProdukAsuransi,
                                                       PRODUK_ASURANSI_NAME:
                                                            e.target.value,
                                                  });
                                             }}
                                             disabled={
                                                  textButton.textButton ===
                                                  "Edit"
                                                       ? true
                                                       : false
                                             }
                                             required
                                             autoComplete="off"
                                             placeholder="Nama Produk"
                                        />
                                   </div>
                                   <div>
                                        {/* for produk asuransi */}
                                        <InputLabel
                                             className="mt-2"
                                             htmlFor="UNDERWRITING_ID"
                                             value={"Underwriting Asuransi"}
                                             required={
                                                  textButton.textButton ===
                                                  "Edit"
                                                       ? false
                                                       : true
                                             }
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                                            textButton.textButton !==
                                                            "Edit"
                                                                 ? `bg-white`
                                                                 : `bg-gray-300`
                                                       }`,
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
                                             options={selectUnderwriting}
                                             isDisabled={
                                                  textButton.textButton ===
                                                  "Edit"
                                                       ? true
                                                       : false
                                             }
                                             isSearchable={true}
                                             placeholder={"--Pilih--"}
                                             value={{
                                                  label: getLabelUnderwriting(
                                                       dataEditProdukAsuransi?.UNDERWRITING_ID
                                                  ),
                                                  value: dataEditProdukAsuransi?.UNDERWRITING_ID,
                                             }}
                                             onChange={(e: any) => {
                                                  setDataEditProdukAsuransi({
                                                       ...dataEditProdukAsuransi,
                                                       UNDERWRITING_ID: e.value,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                              </div>
                         </div>
                    </fieldset>

                    <div className="relative border-2 rounded-lg pt-2 pb-2 mt-4">
                         {/* Label di atas border */}
                         <div className="absolute -top-[14px] left-4 px-2 font-medium whitespace-nowrap bg-[#F3F4F6]">
                              Data Mekanisme Asuransi
                         </div>

                         {/* Scrollable area */}
                         <div className="overflow-x-auto custom-scrollbar mt-2 relative h-72">
                              <div className="min-w-[2000px] px-4 py-2">
                                   <table className="min-w-full table-auto">
                                        <thead className="[&>tr>th]:font-normal">
                                             <tr>
                                                  {textButton.textButton !==
                                                       "Edit" && (
                                                       <>
                                                            {dataEditProdukAsuransi
                                                                 ?.DATA_MEKANISME_PRODUK
                                                                 .length >
                                                                 1 && <th></th>}
                                                       </>
                                                  )}

                                                  <th>
                                                       <InputLabel
                                                            className=""
                                                            htmlFor="JAMINAN_ASURANSI"
                                                            value={
                                                                 "Jaminan Asuransi"
                                                            }
                                                            required={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? false
                                                                      : true
                                                            }
                                                       />
                                                  </th>
                                                  <th className="px-4">
                                                       <InputLabel
                                                            className=""
                                                            htmlFor="MAX_GANTI_ASURANSI"
                                                            value={
                                                                 "Max Ganti Rugi"
                                                            }
                                                            required={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? false
                                                                      : true
                                                            }
                                                       />
                                                  </th>
                                                  <th className="px-4"></th>
                                                  <th className="px-4">
                                                       <InputLabel
                                                            className=""
                                                            htmlFor="MAX_GANTI_ASURANSI"
                                                            value={
                                                                 "Limit Ganti Rugi / Jaminan(%)"
                                                            }
                                                            required={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? false
                                                                      : true
                                                            }
                                                       />
                                                  </th>
                                                  <th className="px-4">
                                                       <InputLabel
                                                            className=""
                                                            htmlFor="MAX_GANTI_ASURANSI"
                                                            value={"Kapasitas"}
                                                            required={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? false
                                                                      : true
                                                            }
                                                       />
                                                  </th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK?.map(
                                                  (
                                                       dataMekanisme: any,
                                                       index: number
                                                  ) => {
                                                       return (
                                                            <tr key={index}>
                                                                 {textButton.textButton !==
                                                                      "Edit" && (
                                                                      <>
                                                                           {dataEditProdukAsuransi
                                                                                ?.DATA_MEKANISME_PRODUK
                                                                                .length >
                                                                                1 && (
                                                                                <td
                                                                                     width={
                                                                                          "5px"
                                                                                     }
                                                                                >
                                                                                     <XMarkIcon
                                                                                          className={
                                                                                               textButton.textButton ===
                                                                                               "Edit"
                                                                                                    ? "w-7 text-slate-600 "
                                                                                                    : "w-7 text-red-600 hover:cursor-pointer hover:text-red-900"
                                                                                          }
                                                                                          onClick={() => {
                                                                                               if (
                                                                                                    textButton.textButton !==
                                                                                                    "Edit"
                                                                                               ) {
                                                                                                    const updatedData =
                                                                                                         dataEditProdukAsuransi.DATA_MEKANISME_PRODUK.filter(
                                                                                                              (
                                                                                                                   data: any,
                                                                                                                   a: number
                                                                                                              ) =>
                                                                                                                   a !==
                                                                                                                   index
                                                                                                         );
                                                                                                    setDataEditProdukAsuransi(
                                                                                                         {
                                                                                                              ...dataEditProdukAsuransi,
                                                                                                              DATA_MEKANISME_PRODUK:
                                                                                                                   updatedData,
                                                                                                         }
                                                                                                    );
                                                                                               }
                                                                                          }}
                                                                                     />
                                                                                </td>
                                                                           )}
                                                                      </>
                                                                 )}
                                                                 <td>
                                                                      <TextInput
                                                                           type="text"
                                                                           name="MEKANISME_PRODUK_ASURANSI_JAMINAN"
                                                                           value={
                                                                                dataMekanisme.MEKANISME_PRODUK_ASURANSI_JAMINAN
                                                                           }
                                                                           className={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? "bg-gray-300 text-black ring-1"
                                                                                     : "ring-1"
                                                                           }
                                                                           onChange={(
                                                                                e
                                                                           ) => {
                                                                                inputDataMekanisme(
                                                                                     "MEKANISME_PRODUK_ASURANSI_JAMINAN",
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                                     index
                                                                                );
                                                                           }}
                                                                           disabled={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? true
                                                                                     : false
                                                                           }
                                                                           required
                                                                           autoComplete="off"
                                                                           placeholder="Jaminan Asuransi"
                                                                      />
                                                                 </td>
                                                                 <td className="px-4 py-2">
                                                                      <TextInput
                                                                           type="text"
                                                                           name="MEKANISME_PRODUK_ASURANSI_GANTI_RUGI"
                                                                           value={
                                                                                dataMekanisme.MEKANISME_PRODUK_ASURANSI_GANTI_RUGI
                                                                           }
                                                                           className={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? "bg-gray-300 text-black ring-1"
                                                                                     : "ring-1"
                                                                           }
                                                                           onChange={(
                                                                                e
                                                                           ) => {
                                                                                inputDataMekanisme(
                                                                                     "MEKANISME_PRODUK_ASURANSI_GANTI_RUGI",
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                                     index
                                                                                );
                                                                           }}
                                                                           disabled={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? true
                                                                                     : false
                                                                           }
                                                                           required
                                                                           autoComplete="off"
                                                                           placeholder="Max Ganti Rugi"
                                                                      />
                                                                 </td>
                                                                 <td
                                                                      className="px-4 py-2"
                                                                      width={
                                                                           "350px"
                                                                      }
                                                                 >
                                                                      <SelectTailwind
                                                                           classNames={{
                                                                                menuButton:
                                                                                     () =>
                                                                                          `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                                                                               textButton.textButton !==
                                                                                               "Edit"
                                                                                                    ? `bg-white`
                                                                                                    : `bg-gray-300`
                                                                                          }`,
                                                                                menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                                listItem:
                                                                                     ({
                                                                                          isSelected,
                                                                                     }: any) =>
                                                                                          `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                               isSelected
                                                                                                    ? `text-white bg-[var(--dynamic-color)]`
                                                                                                    : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                                                          }`,
                                                                           }}
                                                                           options={
                                                                                selectGantiRugi
                                                                           }
                                                                           isSearchable={
                                                                                true
                                                                           }
                                                                           placeholder={
                                                                                "--Pilih--"
                                                                           }
                                                                           value={
                                                                                dataMekanisme?.MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI ===
                                                                                null
                                                                                     ? null
                                                                                     : {
                                                                                            label: getMaxGantiRugiChoose(
                                                                                                 dataMekanisme?.MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI
                                                                                            ),
                                                                                            value: dataMekanisme?.MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI,
                                                                                       }
                                                                           }
                                                                           isDisabled={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? true
                                                                                     : false
                                                                           }
                                                                           onChange={(
                                                                                e: any
                                                                           ) => {
                                                                                inputDataMekanisme(
                                                                                     "MEKANISME_PRODUK_ASURANSI_FOR_GANTI_RUGI",
                                                                                     e.value,
                                                                                     index
                                                                                );
                                                                           }}
                                                                           primaryColor={
                                                                                "bg-[var(--dynamic-color)]"
                                                                           }
                                                                      />
                                                                 </td>
                                                                 <td className="px-4 py-2">
                                                                      <TextInput
                                                                           type="text"
                                                                           name="MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI"
                                                                           value={
                                                                                dataMekanisme.MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI
                                                                           }
                                                                           className={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? "bg-gray-300 text-black ring-1"
                                                                                     : "ring-1"
                                                                           }
                                                                           onChange={(
                                                                                e
                                                                           ) => {
                                                                                inputDataMekanisme(
                                                                                     "MEKANISME_PRODUK_ASURANSI_LIMIT_GANTI_RUGI",
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                                     index
                                                                                );
                                                                           }}
                                                                           disabled={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? true
                                                                                     : false
                                                                           }
                                                                           required
                                                                           autoComplete="off"
                                                                           placeholder="Limit Ganti Rugi"
                                                                      />
                                                                 </td>
                                                                 <td className="px-4 py-2">
                                                                      <TextInput
                                                                           type="text"
                                                                           name="MEKANISME_PRODUK_ASURANSI_KAPASITAS"
                                                                           value={
                                                                                dataMekanisme.MEKANISME_PRODUK_ASURANSI_KAPASITAS
                                                                           }
                                                                           className={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? "bg-gray-300 text-black ring-1"
                                                                                     : "ring-1"
                                                                           }
                                                                           onChange={(
                                                                                e
                                                                           ) => {
                                                                                inputDataMekanisme(
                                                                                     "MEKANISME_PRODUK_ASURANSI_KAPASITAS",
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                                     index
                                                                                );
                                                                           }}
                                                                           disabled={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? true
                                                                                     : false
                                                                           }
                                                                           required
                                                                           autoComplete="off"
                                                                           placeholder="Kapasitas"
                                                                      />
                                                                 </td>
                                                            </tr>
                                                       );
                                                  }
                                             )}
                                        </tbody>
                                   </table>
                              </div>
                         </div>
                         {textButton.textButton !== "Edit" && (
                              <div
                                   className="mt-2 px-2 text-xs text-blue-500 italic hover:cursor-pointer hover:text-blue-800 w-fit"
                                   // style={{
                                   //      position: "absolute",
                                   //      bottom: "10",
                                   //      left: "10",
                                   //      marginTop: "9.5rem",
                                   //      // backgroundColor: "white",
                                   //      padding: "2px 6px",
                                   //      borderRadius: "4px",
                                   //      zIndex: 10,
                                   // }}
                                   onClick={(e) => {
                                        handleClickAddRow(e);
                                   }}
                              >
                                   <span>+ Add Row</span>
                              </div>
                         )}
                    </div>

                    {/* <fieldset className="pb-10 pt-0 rounded-lg border-2">
                         <legend className="ml-5 px-3 font-medium">
                              Data Mekanisme Asuransi
                         </legend>
                         <div className="px-4 py-2">
                              <div className="grid lg:grid-cols-4 xs:grid-cols-1 gap-4">
                                   <div>
                                        <InputLabel
                                             className=""
                                             htmlFor="JAMINAN_ASURANSI"
                                             value={"Jaminan Asuransi"}
                                             required={true}
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             className=""
                                             htmlFor="MAX_GANTI_ASURANSI"
                                             value={"Max Ganti Rugi"}
                                             required={true}
                                        />
                                   </div>
                                   <div></div>
                                   <div>
                                        <InputLabel
                                             className=""
                                             htmlFor="MAX_GANTI_ASURANSI"
                                             value={
                                                  "Limit Ganti Rugi / Jaminan (%)"
                                             }
                                             required={true}
                                        />
                                   </div>
                              </div>
                              <div className="grid lg:grid-cols-4 xs:grid-cols-1 gap-4">
                                   <div>
                                        <TextInput
                                             type="text"
                                             name="JAMINAN_ASURANSI"
                                             value={dataEditProdukAsuransi.JAMINAN}
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataEditProdukAsuransi({
                                                       ...dataEditProdukAsuransi,
                                                       JAMINAN: e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder="Jaminan Asuransi"
                                        />
                                   </div>
                                   <div>
                                        <TextInput
                                             type="text"
                                             name="MAX_GANTI_ASURANSI"
                                             value={
                                                  dataEditProdukAsuransi.MAX_GANTI_RUGI
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataEditProdukAsuransi({
                                                       ...dataEditProdukAsuransi,
                                                       MAX_GANTI_RUGI:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder="Max Ganti Rugi"
                                        />
                                   </div>
                                   <div>
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm ring-1 text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                             options={selectGantiRugi}
                                             isSearchable={true}
                                             placeholder={"--Pilih--"}
                                             value={
                                                  dataEditProdukAsuransi?.JENIS_MAX_RUGI
                                             }
                                             onChange={(e: any) => {
                                                  setDataEditProdukAsuransi({
                                                       ...dataEditProdukAsuransi,
                                                       JENIS_MAX_RUGI: e,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                              </div>
                              <div className="mt-2 text-xs text-blue-500 italic hover:cursor-pointer hover:text-blue-800 w-fit">
                                   <span>+ Add Row</span>
                              </div>
                         </div>
                    </fieldset> */}
               </section>
          </>
     );
}
