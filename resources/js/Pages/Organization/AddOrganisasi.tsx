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

export default function AddOrganisasi({
     setDataOrganisasi,
     dataOrganisasi,
}: PropsWithChildren<{
     setDataOrganisasi: any;
     dataOrganisasi: any;
}>) {
     const arrayOrganisasi = [
          {
               id: "1",
               name: "Fresnel Perdana Mandiri",
          },
     ];

     // for combo organisasi
     const comboOrganisasiParent = arrayOrganisasi?.map((query: any) => {
          return {
               value: query.id,
               label: query.name,
          };
     });

     return (
          <>
               <section>
                    <div className="grid grid-cols-1 gap-4">
                         <div>
                              {/* for parent insurance */}
                              <InputLabel
                                   className=""
                                   htmlFor="ORGANISASI_PARENT_ID"
                                   value={"Parent Organisasi"}
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
                                   options={comboOrganisasiParent}
                                   isSearchable={true}
                                   isClearable={true}
                                   placeholder={"--Pilih Parent Asuransi--"}
                                   value={dataOrganisasi.INSURANCE_PARENT_ID}
                                   onChange={(e) => {
                                        setDataOrganisasi({
                                             ...dataOrganisasi,
                                             INSURANCE_PARENT_ID: e,
                                        });
                                   }}
                                   primaryColor={"bg-[var(--dynamic-color)]"}
                              />
                              {/* for Insurance Name */}
                         </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                         <div>
                              <InputLabel
                                   className="mt-2"
                                   htmlFor="ORGANISASI_NAME"
                                   value={"Nama Organisasi"}
                                   required={true}
                              />
                              <TextInput
                                   type="text"
                                   name="ORGANISASI_NAME"
                                   value={dataOrganisasi.ORGANISASI_NAME}
                                   className="ring-1"
                                   onChange={(e) => {
                                        setDataOrganisasi({
                                             ...dataOrganisasi,
                                             ORGANISASI_NAME: e.target.value,
                                        });
                                   }}
                                   required
                                   autoComplete="off"
                                   placeholder="Nama Organisasi"
                              />
                         </div>
                    </div>
               </section>
          </>
     );
}
