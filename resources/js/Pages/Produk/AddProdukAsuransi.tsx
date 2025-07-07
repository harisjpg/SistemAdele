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

export default function AddProdukAsuransi({
     setDataProdukAsuransi,
     dataProdukAsuransi,
     comboUnderwriting,
     dataParameterProduk,
     dataParameterCategory,
}: PropsWithChildren<{
     setDataProdukAsuransi: any;
     dataProdukAsuransi: any;
     comboUnderwriting: any;
     dataParameterProduk: any;
     dataParameterCategory: any;
}>) {
     // for option ganti rugi
     const arrayMaxGantiRugi = [
          {
               id: "1",
               name: "Baki Debet",
          },
          {
               id: "2",
               name: "Baki Debet + (1 x Bunga)",
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

     // filter parameter produk with parameter category
     const [dataFilter, setDataFilter] = useState<any>([]);
     const handleFilterParameter = (index: number) => {
          const selectedCategoryId =
               dataProdukAsuransi?.DATA_MEKANISME_PRODUK[index]
                    ?.PARAMETER_CATEGORY_ID?.value ??
               dataProdukAsuransi?.DATA_MEKANISME_PRODUK[index]
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

     // console.log(dataFilter, "filter");

     // const selectParameter = dataFilter?.map((query: any) => {
     //      return {
     //           value: query.PARAMETER_PRODUK_ID,
     //           label: query.PARAMETER_PRODUK_NAME,
     //      };
     // });

     const selectParameterCategory = dataParameterCategory?.map(
          (query: any) => {
               return {
                    value: query.PARAMETER_PRODUK_ID,
                    label: query.PARAMETER_PRODUK_NAME,
               };
          }
     );

     const handleClickAddRow = async (e: FormEvent) => {
          e.preventDefault();

          setDataProdukAsuransi({
               ...dataProdukAsuransi,
               DATA_MEKANISME_PRODUK: [
                    ...dataProdukAsuransi.DATA_MEKANISME_PRODUK,
                    {
                         PARAMETER_PRODUK_ID: "",
                         PARAMETER_CATEGORY_ID: "",
                    },
               ],
          });
     };

     const inputDataMekanisme = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataProdukAsuransi.DATA_MEKANISME_PRODUK];
          changeVal[i][name] = value;
          setDataProdukAsuransi({
               ...dataProdukAsuransi,
               DATA_MEKANISME_PRODUK: changeVal,
          });
     };
     // for combo asuransi
     const selectUnderwriting = comboUnderwriting?.map((query: any) => {
          return {
               value: query.UNDERWRITING_ID,
               label: query.UNDERWRITING_NAME,
          };
     });

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
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             name="PRODUK_ASURANSI_NAME"
                                             value={
                                                  dataProdukAsuransi.PRODUK_ASURANSI_NAME
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataProdukAsuransi({
                                                       ...dataProdukAsuransi,
                                                       PRODUK_ASURANSI_NAME:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder="Nama Produk"
                                        />
                                   </div>
                                   <div>
                                        {/* for underwriting */}
                                        <InputLabel
                                             className=""
                                             htmlFor="UNDERWRITING_ID"
                                             value={"Underwriting"}
                                             required={false}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white `
                                                                 : `text-gray-500 hover: hover:text-white`
                                                       }`,
                                             }}
                                             options={selectUnderwriting}
                                             isSearchable={true}
                                             isClearable={true}
                                             placeholder={
                                                  "--Pilih Underwriting--"
                                             }
                                             value={
                                                  dataProdukAsuransi.UNDERWRITING_ID
                                             }
                                             onChange={(e) => {
                                                  setDataProdukAsuransi({
                                                       ...dataProdukAsuransi,
                                                       UNDERWRITING_ID: e,
                                                  });
                                             }}
                                             primaryColor={""}
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Upload File"
                                             required={false}
                                        />
                                        <div className="w-full mt-1">
                                             <input
                                                  className="block w-full text-sm text-gray-600 border  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                  id="file_input"
                                                  type="file"
                                                  onChange={(e: any) => {
                                                       setDataProdukAsuransi({
                                                            ...dataProdukAsuransi,
                                                            UPLOAD_FILE_PRODUK:
                                                                 e.target.files,
                                                       });
                                                  }}
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
                         <div className="mt-2 relative">
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
                              {dataProdukAsuransi.DATA_MEKANISME_PRODUK?.map(
                                   (dataMekanis: any, index: number) => (
                                        <div
                                             key={index}
                                             className="grid grid-cols-2 gap-4 px-4 mb-2"
                                        >
                                             <div>
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
                                                                           : `text-gray-500 hover:text-white hover:bg-primary-adele`
                                                                 }`,
                                                       }}
                                                       options={
                                                            selectParameterCategory
                                                       }
                                                       isSearchable={true}
                                                       placeholder={"--Pilih--"}
                                                       value={
                                                            dataMekanis?.PARAMETER_CATEGORY_ID
                                                       }
                                                       onChange={(e: any) => {
                                                            inputDataMekanisme(
                                                                 "PARAMETER_CATEGORY_ID",
                                                                 e,
                                                                 index
                                                            );
                                                            handleFilterParameter(
                                                                 index
                                                            );
                                                       }}
                                                       primaryColor={""}
                                                  />
                                             </div>
                                             <div>
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
                                                                           : `text-gray-500 hover:text-white hover:bg-primary-adele`
                                                                 }`,
                                                       }}
                                                       options={(
                                                            dataFilter[index] ||
                                                            []
                                                       ).map((query: any) => ({
                                                            value: query.PARAMETER_PRODUK_ID,
                                                            label: query.PARAMETER_PRODUK_NAME,
                                                       }))}
                                                       isSearchable={true}
                                                       placeholder={"--Pilih--"}
                                                       value={
                                                            dataMekanis?.PARAMETER_PRODUK_ID
                                                       }
                                                       onChange={(e: any) => {
                                                            inputDataMekanisme(
                                                                 "PARAMETER_PRODUK_ID",
                                                                 e,
                                                                 index
                                                            );
                                                       }}
                                                       primaryColor={""}
                                                  />
                                             </div>
                                        </div>
                                   )
                              )}
                         </div>
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
                    </div>
               </section>
          </>
     );
}
