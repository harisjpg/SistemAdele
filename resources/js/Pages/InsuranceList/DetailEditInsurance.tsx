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
import SelectTailwind from "react-tailwindcss-select";

export default function DetailEditInsuranceList({
     textButton,
     dataEditInsurance,
     setDataEditInsurance,
     insuranceType,
     produkAsuransi,
     comboInsurance,
     comboUnderwriting,
}: PropsWithChildren<{
     textButton: any;
     dataEditInsurance: any;
     setDataEditInsurance: any;
     insuranceType: any;
     produkAsuransi: any;
     comboInsurance: any;
     comboUnderwriting: any;
}>) {
     // for combo jenis asuransi
     const selectInsuranceType = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });
     const getLabelInsuranceType = (value: any) => {
          if (value) {
               const selected = selectInsuranceType.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     // for combo produk asuransi
     const selectProdukAsuransi = produkAsuransi?.map((query: any) => {
          return {
               value: query.PRODUK_ASURANSI_ID,
               label: query.PRODUK_ASURANSI_NAME,
          };
     });
     const getLabelProdukAsuransi = (value: any) => {
          if (value) {
               const selected = selectProdukAsuransi.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     // for combo parent insurance
     const selectInsuranceParent = comboInsurance?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.text_combo,
          };
     });
     const getLabelInsuranceParent = (value: any) => {
          if (value) {
               const selected = selectInsuranceParent.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
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
               {/* for Parent Insurance */}
               <InputLabel
                    className=""
                    htmlFor="PARENT_INSURANCE_ID"
                    value={"Parent Asuransi"}
                    required={false}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                   textButton.textButton !== "Edit"
                                        ? `bg-white`
                                        : `bg-gray-300`
                              }`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-primary-adele`
                                        : `text-gray-500 hover:bg-primary-adele hover:text-white`
                              }`,
                    }}
                    options={selectInsuranceParent}
                    isDisabled={textButton.textButton === "Edit" ? true : false}
                    isSearchable={true}
                    placeholder={"--Pilih Parent Asuransi--"}
                    value={
                         dataEditInsurance?.INSURANCE_PARENT_ID === null
                              ? null
                              : {
                                     label: getLabelInsuranceParent(
                                          dataEditInsurance?.INSURANCE_PARENT_ID
                                     ),
                                     value: dataEditInsurance?.INSURANCE_PARENT_ID,
                                }
                    }
                    onChange={(e: any) => {
                         setDataEditInsurance({
                              ...dataEditInsurance,
                              INSURANCE_PARENT_ID: e.value,
                         });
                    }}
                    primaryColor={"bg-primary-adele"}
               />
               <div className="grid grid-cols-2 gap-4">
                    <div>
                         {/* for Insurance Name */}
                         <InputLabel
                              className="mt-2"
                              htmlFor="INSURANCE_NAME"
                              value={"Nama Asuransi"}
                              required={
                                   textButton.textButton === "Edit"
                                        ? false
                                        : true
                              }
                         />
                         <TextInput
                              type="text"
                              name="INSURANCE_NAME"
                              value={dataEditInsurance.INSURANCE_NAME}
                              className={
                                   textButton.textButton === "Edit"
                                        ? "bg-gray-300 text-black ring-1"
                                        : "ring-1"
                              }
                              onChange={(e) => {
                                   setDataEditInsurance({
                                        ...dataEditInsurance,
                                        INSURANCE_NAME: e.target.value,
                                   });
                              }}
                              disabled={
                                   textButton.textButton === "Edit"
                                        ? true
                                        : false
                              }
                              required
                              autoComplete="off"
                              placeholder="Insurance Name"
                         />
                    </div>
                    <div>
                         {/* for insurance type */}
                         <InputLabel
                              className="mt-2"
                              htmlFor="INSURANCE_TYPE_ID"
                              value={"Insurance Type"}
                              required={
                                   textButton.textButton === "Edit"
                                        ? false
                                        : true
                              }
                         />
                         <SelectTailwind
                              classNames={{
                                   menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                             textButton.textButton !== "Edit"
                                                  ? `bg-white`
                                                  : `bg-gray-300`
                                        }`,
                                   menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                   listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                             isSelected
                                                  ? `text-white bg-primary-adele`
                                                  : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                        }`,
                              }}
                              options={selectInsuranceType}
                              isDisabled={
                                   textButton.textButton === "Edit"
                                        ? true
                                        : false
                              }
                              isSearchable={true}
                              placeholder={"--Pilih--"}
                              value={{
                                   label: getLabelInsuranceType(
                                        dataEditInsurance?.INSURANCE_TYPE_ID
                                   ),
                                   value: dataEditInsurance?.INSURANCE_TYPE_ID,
                              }}
                              onChange={(e: any) => {
                                   setDataEditInsurance({
                                        ...dataEditInsurance,
                                        INSURANCE_TYPE_ID: e.value,
                                   });
                              }}
                              primaryColor={"bg-primary-adele"}
                         />
                    </div>
               </div>
               {/* for Insurance Code */}
               <InputLabel
                    className="mt-2"
                    htmlFor="INSURANCE_CODE"
                    value={"Kode Asuransi"}
                    required={textButton.textButton === "Edit" ? false : true}
               />
               <TextInput
                    type="text"
                    name="INSURANCE_CODE"
                    value={dataEditInsurance.INSURANCE_CODE}
                    className={
                         textButton.textButton === "Edit"
                              ? "bg-gray-300 text-black ring-1"
                              : "ring-1"
                    }
                    onChange={(e) => {
                         setDataEditInsurance({
                              ...dataEditInsurance,
                              INSURANCE_CODE: e.target.value,
                         });
                    }}
                    disabled={textButton.textButton === "Edit" ? true : false}
                    required
                    autoComplete="off"
                    placeholder="Insurance Name"
               />
               {/* for produk asuransi */}
               <InputLabel
                    className="mt-2"
                    htmlFor="PRODUK_ASURANSI_ID"
                    value={"Produk Asuransi"}
                    required={textButton.textButton === "Edit" ? false : true}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                   textButton.textButton !== "Edit"
                                        ? `bg-white`
                                        : `bg-gray-300`
                              }`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-primary-adele`
                                        : `text-gray-500 hover:bg-primary-adele hover:text-white`
                              }`,
                    }}
                    options={selectProdukAsuransi}
                    isDisabled={textButton.textButton === "Edit" ? true : false}
                    isSearchable={true}
                    placeholder={"--Pilih--"}
                    value={{
                         label: getLabelProdukAsuransi(
                              dataEditInsurance?.PRODUK_ASURANSI_ID
                         ),
                         value: dataEditInsurance?.PRODUK_ASURANSI_ID,
                    }}
                    onChange={(e: any) => {
                         setDataEditInsurance({
                              ...dataEditInsurance,
                              PRODUK_ASURANSI_ID: e.value,
                         });
                    }}
                    primaryColor={"bg-primary-adele"}
               />
               {/* for produk asuransi */}
               <InputLabel
                    className="mt-2"
                    htmlFor="UNDERWRITING_ID"
                    value={"Underwriting Asuransi"}
                    required={textButton.textButton === "Edit" ? false : true}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                   textButton.textButton !== "Edit"
                                        ? `bg-white`
                                        : `bg-gray-300`
                              }`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-primary-adele`
                                        : `text-gray-500 hover:bg-primary-adele hover:text-white`
                              }`,
                    }}
                    options={selectUnderwriting}
                    isDisabled={textButton.textButton === "Edit" ? true : false}
                    isSearchable={true}
                    placeholder={"--Pilih--"}
                    value={{
                         label: getLabelUnderwriting(
                              dataEditInsurance?.UNDERWRITING_ID
                         ),
                         value: dataEditInsurance?.UNDERWRITING_ID,
                    }}
                    onChange={(e: any) => {
                         setDataEditInsurance({
                              ...dataEditInsurance,
                              UNDERWRITING_ID: e.value,
                         });
                    }}
                    primaryColor={"bg-primary-adele"}
               />
               {/* for Insurance Logo */}
               <InputLabel
                    className="mt-2"
                    htmlFor="INSURANCE_LOGO"
                    value={"Upload Logo"}
                    required={true}
               />
               <input
                    className={
                         textButton.textButton === "Edit"
                              ? "bg-gray-300 text-black block w-full text-sm border bg-primary-adele rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                              : "block w-full text-sm text-gray-600 border bg-primary-adele rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                    }
                    id="file_input"
                    type="file"
                    onChange={(e) => {
                         setDataEditInsurance({
                              ...dataEditInsurance,
                              INSURANCE_LOGO: e.target.files,
                         });
                    }}
                    disabled={textButton.textButton === "Edit" ? true : false}
               ></input>
          </>
     );
}
