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

export default function DetailEditInsuranceBundling({
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
               <div className="grid grid-cols-2 gap-4">
                    <div>
                         <InputLabel
                              className="mt-2"
                              htmlFor="INSURANCE_NAME"
                              value={"Nama Asuransi Bundling"}
                              required={true}
                         />
                    </div>
                    <div>
                         <InputLabel
                              className="mt-2"
                              htmlFor="INSURANCE_TYPE_ID"
                              value={"Jenis Produk Asuransi"}
                              required={true}
                         />
                         {/* <SelectTailwind
                                   classNames={{
                                        menuButton: () =>
                                             `flex text-sm ring-1 text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                             `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                  isSelected
                                                       ? `text-white bg-[var(--dynamic-color)]`
                                                       : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                             }`,
                                   }}
                                   options={comboInsuranceType}
                                   isSearchable={true}
                                   isClearable={true}
                                   placeholder={
                                        "--Pilih Jenis Produk Asuransi--"
                                   }
                                   value={
                                        dataInsuranceBundling.INSURANCE_TYPE_ID
                                   }
                                   onChange={(e) => {
                                        setDataInsuranceBundling({
                                             ...dataInsuranceBundling,
                                             INSURANCE_TYPE_ID: e,
                                        });
                                   }}
                                   primaryColor={"bg-[var(--dynamic-color)]"}
                              /> */}
                    </div>
               </div>
               <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                         {/* for parent insurance */}
                         <InputLabel
                              className=""
                              htmlFor="INSURANCE_BUNDLING_ID"
                              value={"Asuransi Bundling"}
                              required={false}
                         />

                         {/* for Insurance Name */}
                    </div>
               </div>
               <div className="grid grid-cols-1 gap-4 mt-2">
                    <div>
                         {/* for parent insurance */}
                         <InputLabel
                              className=""
                              htmlFor="INSURANCE_LEADER_BUNDLING"
                              value={"Leader"}
                              required={false}
                         />

                         {/* for Insurance Name */}
                    </div>
               </div>
               <InputLabel
                    className="mt-2"
                    htmlFor="PRODUK_ASURANSI_ID"
                    value={"Produk Asuransi"}
                    required={true}
               />
          </>
     );
}
