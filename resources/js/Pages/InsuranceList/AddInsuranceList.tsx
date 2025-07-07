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

export default function AddInsuranceList({
     setDataInsurance,
     dataInsurance,
     insuranceType,
     produkAsuransi,
     comboInsurance,
     comboUnderwriting,
}: PropsWithChildren<{
     setDataInsurance: any;
     dataInsurance: any;
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
     console.log(comboInsuranceParent, "comboInsuranceParent");

     return (
          <>
               <section>
                    <div className="grid grid-cols-1 gap-4">
                         <div>
                              {/* for parent insurance */}
                              <InputLabel
                                   className=""
                                   htmlFor="INSURANCE_NAME"
                                   value={"Parent Asuransi"}
                                   required={false}
                              />
                              <SelectTailwind
                                   classNames={{
                                        menuButton: () =>
                                             `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                             `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                  isSelected
                                                       ? `text-white bg-primary-adele`
                                                       : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                             }`,
                                   }}
                                   options={comboInsuranceParent}
                                   isSearchable={true}
                                   isClearable={true}
                                   placeholder={"--Pilih Parent Asuransi--"}
                                   value={dataInsurance.INSURANCE_PARENT_ID}
                                   onChange={(e) => {
                                        setDataInsurance({
                                             ...dataInsurance,
                                             INSURANCE_PARENT_ID: e,
                                        });
                                   }}
                                   primaryColor={"bg-primary-adele"}
                              />
                              {/* for Insurance Name */}
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                              <InputLabel
                                   className="mt-2"
                                   htmlFor="INSURANCE_NAME"
                                   value={"Nama Asuransi"}
                                   required={true}
                              />
                              <TextInput
                                   type="text"
                                   name="INSURANCE_NAME"
                                   value={dataInsurance.INSURANCE_NAME}
                                   className="ring-1"
                                   onChange={(e) => {
                                        setDataInsurance({
                                             ...dataInsurance,
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
                                   htmlFor="TYPE_INSURANCE"
                                   value={"Jenis Produk Asuransi"}
                                   required={true}
                              />
                              <SelectTailwind
                                   classNames={{
                                        menuButton: () =>
                                             `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                        menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                        listItem: ({ isSelected }: any) =>
                                             `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                  isSelected
                                                       ? `text-white bg-primary-adele`
                                                       : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                             }`,
                                   }}
                                   options={comboInsuranceType}
                                   isSearchable={true}
                                   isClearable={true}
                                   placeholder={
                                        "--Pilih Jenis Produk Asuransi--"
                                   }
                                   value={dataInsurance.INSURANCE_TYPE_ID}
                                   onChange={(e) => {
                                        setDataInsurance({
                                             ...dataInsurance,
                                             INSURANCE_TYPE_ID: e,
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
                         required={false}
                    />
                    <TextInput
                         type="text"
                         name="INSURANCE_CODE"
                         value={dataInsurance.INSURANCE_CODE}
                         className="ring-1"
                         onChange={(e) => {
                              setDataInsurance({
                                   ...dataInsurance,
                                   INSURANCE_CODE: e.target.value,
                              });
                         }}
                         required
                         autoComplete="off"
                         placeholder="Kode Asuransi"
                    />
                    <InputLabel
                         className="mt-2"
                         htmlFor="PRODUK_ASURANSI_ID"
                         value={"Produk Asuransi"}
                         required={true}
                    />
                    <SelectTailwind
                         classNames={{
                              menuButton: () =>
                                   `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                              menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                              listItem: ({ isSelected }: any) =>
                                   `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                             ? `text-white bg-primary-adele`
                                             : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                   }`,
                         }}
                         options={comboProdukAsuransi}
                         isSearchable={true}
                         isClearable={true}
                         placeholder={"--Pilih Produk Asuransi--"}
                         value={dataInsurance.PRODUK_ASURANSI_ID}
                         onChange={(e) => {
                              setDataInsurance({
                                   ...dataInsurance,
                                   PRODUK_ASURANSI_ID: e,
                              });
                         }}
                         primaryColor={"bg-primary-adele"}
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
                                   `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                              menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                              listItem: ({ isSelected }: any) =>
                                   `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                             ? `text-white bg-primary-adele`
                                             : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                   }`,
                         }}
                         options={selectUnderwriting}
                         isSearchable={true}
                         isClearable={true}
                         placeholder={"--Pilih Underwriting--"}
                         value={dataInsurance.UNDERWRITING_ID}
                         onChange={(e) => {
                              setDataInsurance({
                                   ...dataInsurance,
                                   UNDERWRITING_ID: e,
                              });
                         }}
                         primaryColor={"bg-primary-adele"}
                    /> */}
                    {/* for Insurance Logo */}
                    <InputLabel
                         className="mt-2"
                         htmlFor="INSURANCE_LOGO"
                         value={"Upload Logo"}
                         required={true}
                    />
                    <input
                         className="block w-full text-sm text-gray-600 border bg-primary-adele rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                         id="file_input"
                         type="file"
                         required
                         onChange={(e) => {
                              setDataInsurance({
                                   ...dataInsurance,
                                   INSURANCE_LOGO: e.target.files,
                              });
                         }}
                    ></input>
               </section>
          </>
     );
}
