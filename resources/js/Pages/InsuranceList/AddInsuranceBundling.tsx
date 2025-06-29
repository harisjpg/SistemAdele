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

export default function AddInsuranceBundling({
     setDataInsuranceBundling,
     dataInsuranceBundling,
     insuranceType,
     produkAsuransi,
     comboInsurance,
     comboUnderwriting,
}: PropsWithChildren<{
     setDataInsuranceBundling: any;
     dataInsuranceBundling: any;
     insuranceType: any;
     produkAsuransi: any;
     comboInsurance: any;
     comboUnderwriting: any;
}>) {
     // for combo asuransi
     const comboInsuranceType = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });

     // for combo produk asuransi
     const comboProdukAsuransi = produkAsuransi?.map((query: any) => {
          return {
               value: query.PRODUK_ASURANSI_ID,
               label: query.PRODUK_ASURANSI_NAME,
          };
     });

     // for combo asuransi
     const comboInsuranceParent = comboInsurance?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.text_combo,
          };
     });

     // for combo asuransi
     const selectUnderwriting = comboUnderwriting?.map((query: any) => {
          return {
               value: query.UNDERWRITING_ID,
               label: query.UNDERWRITING_NAME,
          };
     });

     const filterLeaderInsurance = comboInsurance
          .filter((dataCombo: any) =>
               dataInsuranceBundling?.INSURANCE_BUNDLING_ID?.some(
                    (dataLeader: any) =>
                         dataLeader.value === dataCombo.INSURANCE_ID
               )
          )
          .map((item: any) => ({
               value: item.INSURANCE_ID,
               label: item.text_combo,
          }));

     console.log(dataInsuranceBundling, "dataInsuranceBundling");

     return (
          <>
               <section>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                              <InputLabel
                                   className="mt-2"
                                   htmlFor="INSURANCE_NAME"
                                   value={"Nama Asuransi Bundling"}
                                   required={true}
                              />
                              <TextInput
                                   type="text"
                                   name="INSURANCE_NAME"
                                   value={dataInsuranceBundling.INSURANCE_NAME}
                                   className="ring-1"
                                   onChange={(e) => {
                                        setDataInsuranceBundling({
                                             ...dataInsuranceBundling,
                                             INSURANCE_NAME: e.target.value,
                                        });
                                   }}
                                   required
                                   autoComplete="off"
                                   placeholder="Insurance Name"
                              />
                         </div>
                         <div>
                              <InputLabel
                                   className="mt-2"
                                   htmlFor="INSURANCE_TYPE_ID"
                                   value={"Jenis Produk Asuransi"}
                                   required={true}
                              />
                              <SelectTailwind
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
                              />
                         </div>
                    </div>

                    {/* for Insurance Code */}
                    {/* <InputLabel
                         className="mt-2"
                         htmlFor="INSURANCE_CODE"
                         value={"Kode Asuransi"}
                         required={false}
                    />
                    <TextInput
                         type="text"
                         name="INSURANCE_CODE"
                         value={dataInsuranceBundling.INSURANCE_CODE}
                         className="ring-1"
                         onChange={(e) => {
                              setDataInsuranceBundling({
                                   ...dataInsuranceBundling,
                                   INSURANCE_CODE: e.target.value,
                              });
                         }}
                         required
                         autoComplete="off"
                         placeholder="Kode Asuransi"
                    /> */}
                    <div className="grid grid-cols-1 gap-4 mt-2">
                         <div>
                              {/* for parent insurance */}
                              <InputLabel
                                   className=""
                                   htmlFor="INSURANCE_BUNDLING_ID"
                                   value={"Asuransi Bundling"}
                                   required={false}
                              />
                              <SelectTailwind
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
                                   options={comboInsuranceParent}
                                   isSearchable={true}
                                   isClearable={true}
                                   isMultiple={true}
                                   placeholder={"--Pilih Bundling Asuransi--"}
                                   value={
                                        dataInsuranceBundling.INSURANCE_BUNDLING_ID
                                   }
                                   onChange={(e) => {
                                        setDataInsuranceBundling({
                                             ...dataInsuranceBundling,
                                             INSURANCE_BUNDLING_ID: e,
                                        });
                                   }}
                                   primaryColor={"bg-[var(--dynamic-color)]"}
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
                              <SelectTailwind
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
                                   options={filterLeaderInsurance}
                                   isSearchable={true}
                                   isClearable={true}
                                   placeholder={
                                        "--Pilih Leader Asuransi Bundling--"
                                   }
                                   value={
                                        dataInsuranceBundling.INSURANCE_LEADER_BUNDLING
                                   }
                                   onChange={(e) => {
                                        setDataInsuranceBundling({
                                             ...dataInsuranceBundling,
                                             INSURANCE_LEADER_BUNDLING: e,
                                        });
                                   }}
                                   primaryColor={"bg-[var(--dynamic-color)]"}
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
                    <SelectTailwind
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
                         options={comboProdukAsuransi}
                         isSearchable={true}
                         isClearable={true}
                         isMultiple={true}
                         placeholder={"--Pilih Produk Asuransi--"}
                         value={dataInsuranceBundling.PRODUK_ASURANSI_ID}
                         onChange={(e) => {
                              setDataInsuranceBundling({
                                   ...dataInsuranceBundling,
                                   PRODUK_ASURANSI_ID: e,
                              });
                         }}
                         primaryColor={"bg-[var(--dynamic-color)]"}
                    />
                    {/* for underwriting */}
                    {/* <InputLabel
                         className="mt-2"
                         htmlFor="UNDERWRITING_ID"
                         value={"Underwriting"}
                         required={false}
                    />
                    <SelectTailwind
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
                         options={selectUnderwriting}
                         isSearchable={true}
                         isClearable={true}
                         placeholder={"--Pilih Underwriting--"}
                         value={dataInsuranceBundling.UNDERWRITING_ID}
                         onChange={(e) => {
                              setDataInsuranceBundling({
                                   ...dataInsuranceBundling,
                                   UNDERWRITING_ID: e,
                              });
                         }}
                         primaryColor={"bg-[var(--dynamic-color)]"}
                    /> */}
                    {/* for Insurance Logo */}
                    {/* <InputLabel
                         className="mt-2"
                         htmlFor="INSURANCE_LOGO"
                         value={"Upload Logo"}
                         required={true}
                    />
                    <input
                         className="block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                         id="file_input"
                         type="file"
                         required
                         onChange={(e) => {
                              setDataInsuranceBundling({
                                   ...dataInsuranceBundling,
                                   INSURANCE_LOGO: e.target.files,
                              });
                         }}
                    ></input> */}
               </section>
          </>
     );
}
