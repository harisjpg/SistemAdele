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
import axios from "axios";

export default function DetailEditProdukAsuransi({
     setDataEditProdukAsuransi,
     dataEditProdukAsuransi,
     textButton,
     comboUnderwriting,
     dataParameterCategory,
     dataParameterProduk,
}: PropsWithChildren<{
     setDataEditProdukAsuransi: any;
     dataEditProdukAsuransi: any;
     textButton: any;
     comboUnderwriting: any;
     dataParameterCategory: any;
     dataParameterProduk: any;
}>) {
     console.log(dataEditProdukAsuransi);

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

     const selectParameterCategory = dataParameterCategory?.map(
          (query: any) => {
               return {
                    value: query.PARAMETER_PRODUK_ID,
                    label: query.PARAMETER_PRODUK_NAME,
               };
          }
     );

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
                         PARAMETER_PRODUK_ID: null,
                         PARAMETER_CATEGORY_ID: null,
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

     const getLabelCategory = (value: any) => {
          if (value) {
               const selected = selectParameterCategory.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     useEffect(() => {
          dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK?.forEach(
               (_item: any, index: number) => {
                    if (_item.PARAMETER_CATEGORY_ID === null) {
                         handleFilterParameterFirst(index);
                    } else {
                         handleFilterParameter(index);
                    }
               }
          );
     }, []);

     const [dataFilter, setDataFilter] = useState<any>([]);
     const handleFilterParameter = (index: number) => {
          const selectedCategoryId =
               dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK[index]
                    ?.PARAMETER_CATEGORY_ID?.value ??
               dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK[index]
                    ?.PARAMETER_CATEGORY_ID;

          const filtered = dataParameterProduk.filter(
               (dataParameter: any) =>
                    selectedCategoryId === dataParameter.PARAMETER_PRODUK_PARENT
          );

          setDataFilter((prev: any[]) => {
               const updated = [...prev];
               updated[index] = filtered;
               return updated;
          });
     };

     const handleFilterParameterFirst = (index: number) => {
          // const selectedCategoryId =
          //      dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK[index]
          //           ?.PARAMETER_CATEGORY_ID?.value ??
          //      dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK[index]
          //           ?.PARAMETER_CATEGORY_ID;

          // const filtered = dataParameterProduk.filter(
          //      (dataParameter: any) =>
          //           selectedCategoryId !== dataParameter.PARAMETER_PRODUK_PARENT
          // );

          setDataFilter((prev: any[]) => {
               const updated = [...prev];
               updated[index] = dataParameterProduk;
               return updated;
          });
     };

     const getLabelParameter = (value: any) => {
          if (value) {
               const selected = dataParameterProduk.filter(
                    (option: any) =>
                         option.PARAMETER_PRODUK_ID.toString() ===
                         value.toString()
               );
               return selected[0]?.PARAMETER_PRODUK_NAME;
          }
     };

     const handleFileDownloadProduct = async (idDocument: any) => {
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

     console.log(dataEditProdukAsuransi, "dataEdit");

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
                                                       : false
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
                                                                 ? `text-white bg-primary-adele`
                                                                 : `text-gray-500 hover:bg-primary-adele hover:text-white`
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
                                             value={
                                                  dataEditProdukAsuransi?.UNDERWRITING_ID ===
                                                  null
                                                       ? null
                                                       : {
                                                              label: getLabelUnderwriting(
                                                                   dataEditProdukAsuransi?.UNDERWRITING_ID
                                                              ),
                                                              value: dataEditProdukAsuransi?.UNDERWRITING_ID,
                                                         }
                                             }
                                             onChange={(e: any) => {
                                                  setDataEditProdukAsuransi({
                                                       ...dataEditProdukAsuransi,
                                                       UNDERWRITING_ID: e.value,
                                                  });
                                             }}
                                             primaryColor={"bg-primary-adele"}
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Upload File"
                                             required={false}
                                        />
                                        <div
                                             className="text-xs text-blue-600 hover:cursor-pointer hover:text-blue-400 hover:underline w-fit"
                                             onClick={(e) =>
                                                  handleFileDownloadProduct(
                                                       dataEditProdukAsuransi?.PRODUK_ASURANSI_DOCUMENT_ID
                                                  )
                                             }
                                        >
                                             <span>
                                                  {
                                                       dataEditProdukAsuransi
                                                            ?.DOCUMENT
                                                            ?.DOCUMENT_FILENAME
                                                  }
                                             </span>
                                        </div>
                                        <div className="w-full mt-1">
                                             <input
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black block w-full text-sm border rounded-lg dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                            : "block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                  }
                                                  id="file_input"
                                                  type="file"
                                                  onChange={(e: any) => {
                                                       setDataEditProdukAsuransi(
                                                            {
                                                                 ...dataEditProdukAsuransi,
                                                                 UPLOAD_FILE_PRODUK:
                                                                      e.target
                                                                           .files,
                                                            }
                                                       );
                                                  }}
                                                  disabled={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? true
                                                            : false
                                                  }
                                             ></input>
                                        </div>
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
                              <div className="px-4 py-2">
                                   <div className="px-4 grid grid-cols-2 gap-4">
                                        <div>
                                             <InputLabel
                                                  value="Parameter Category Produk"
                                                  required={false}
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Parameter Produk"
                                                  required={false}
                                             />
                                        </div>
                                   </div>
                                   {dataEditProdukAsuransi?.DATA_MEKANISME_PRODUK?.map(
                                        (dataMekanisme: any, index: number) => {
                                             return (
                                                  <div
                                                       key={index}
                                                       className="grid grid-cols-2 gap-4 px-4 mb-2"
                                                  >
                                                       <div>
                                                            <SelectTailwind
                                                                 classNames={{
                                                                      menuButton:
                                                                           () =>
                                                                                `block flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
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
                                                                                          ? `text-white bg-primary-adele`
                                                                                          : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                                                }`,
                                                                 }}
                                                                 isDisabled={
                                                                      textButton.textButton ===
                                                                      "Edit"
                                                                           ? true
                                                                           : false
                                                                 }
                                                                 options={
                                                                      selectParameterCategory
                                                                 }
                                                                 isSearchable={
                                                                      true
                                                                 }
                                                                 placeholder={
                                                                      "--Pilih--"
                                                                 }
                                                                 value={
                                                                      dataMekanisme?.PARAMETER_CATEGORY_ID ===
                                                                      null
                                                                           ? null
                                                                           : {
                                                                                  label: getLabelCategory(
                                                                                       dataMekanisme?.PARAMETER_CATEGORY_ID
                                                                                  ),
                                                                                  value: dataMekanisme?.PARAMETER_CATEGORY_ID,
                                                                             }
                                                                 }
                                                                 onChange={(
                                                                      e: any
                                                                 ) => {
                                                                      inputDataMekanisme(
                                                                           "PARAMETER_CATEGORY_ID",
                                                                           e.value,
                                                                           index
                                                                      );
                                                                      handleFilterParameter(
                                                                           index
                                                                      );
                                                                 }}
                                                                 primaryColor={
                                                                      ""
                                                                 }
                                                            />
                                                       </div>
                                                       <div className="flex gap-2 items-center">
                                                            <div className="w-full">
                                                                 <SelectTailwind
                                                                      classNames={{
                                                                           menuButton:
                                                                                () =>
                                                                                     `truncate flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
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
                                                                                               ? `text-white bg-primary-adele`
                                                                                               : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                                                     }`,
                                                                      }}
                                                                      isDisabled={
                                                                           textButton.textButton ===
                                                                           "Edit"
                                                                                ? true
                                                                                : false
                                                                      }
                                                                      options={(
                                                                           dataFilter[
                                                                                index
                                                                           ] ||
                                                                           []
                                                                      ).map(
                                                                           (
                                                                                query: any
                                                                           ) => ({
                                                                                value: query.PARAMETER_PRODUK_ID,
                                                                                label: query.PARAMETER_PRODUK_NAME,
                                                                           })
                                                                      )}
                                                                      isSearchable={
                                                                           true
                                                                      }
                                                                      placeholder={
                                                                           "--Pilih--"
                                                                      }
                                                                      value={
                                                                           dataMekanisme?.PARAMETER_PRODUK_ID ===
                                                                           null
                                                                                ? null
                                                                                : {
                                                                                       label: getLabelParameter(
                                                                                            dataMekanisme?.PARAMETER_PRODUK_ID
                                                                                       ),
                                                                                       value: dataMekanisme?.PARAMETER_PRODUK_ID,
                                                                                  }
                                                                      }
                                                                      onChange={(
                                                                           e: any
                                                                      ) => {
                                                                           inputDataMekanisme(
                                                                                "PARAMETER_PRODUK_ID",
                                                                                e.value,
                                                                                index
                                                                           );
                                                                      }}
                                                                      primaryColor={
                                                                           ""
                                                                      }
                                                                 />
                                                            </div>
                                                            <div>
                                                                 {/* <XMarkIcon className="w-6 text-primary-adele" /> */}
                                                                 {textButton.textButton !==
                                                                      "Edit" && (
                                                                      <>
                                                                           {dataEditProdukAsuransi
                                                                                ?.DATA_MEKANISME_PRODUK
                                                                                .length >
                                                                                1 && (
                                                                                <XMarkIcon
                                                                                     className={
                                                                                          textButton.textButton ===
                                                                                          "Edit"
                                                                                               ? "w-7 text-slate-600 "
                                                                                               : "w-7 text-primary-adele hover:cursor-pointer hover:text-primary-hover-adele"
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
                                                                           )}
                                                                      </>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             );
                                        }
                                   )}
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
               </section>
          </>
     );
}
