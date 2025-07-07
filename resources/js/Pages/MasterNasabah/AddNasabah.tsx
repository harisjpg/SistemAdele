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

export default function AddNasabah({
     setDataNasabah,
     dataNasabah,
     dataWork,
}: PropsWithChildren<{
     setDataNasabah: any;
     dataNasabah: any;
     dataWork: any;
}>) {
     // for cek NIK harus 16 tidak boleh lebih dan kurang
     const [cekNIK, setCekNIK] = useState<any>("");
     const cekJumlahNIK = async (e: any) => {
          if (e.length > 16) {
               setCekNIK("NIK lebih dari 16, silahkan cek kembali!");
          }
          if (e.length === 16) {
               setCekNIK("");
          }
          if (e.length > 0 && e.length < 16) {
               setCekNIK("NIK kurang dari 16, silahkan cek kembali!");
          }
     };

     // for input tanggal lahir nasabah
     const handleTglLahir = (date: Date) => {
          setDataNasabah({
               ...dataNasabah,
               THE_INSURED_DATE_OF_BIRTH: date.toLocaleDateString("en-CA"),
          });
     };

     // for option gender
     const arrayGender = [
          {
               id: "1",
               name: "Female",
          },
          {
               id: "2",
               name: "Male",
          },
     ];
     const selectGender = arrayGender?.map((query: any) => {
          return {
               value: query.id,
               label: query.name,
          };
     });

     const selectWork = dataWork?.map((query: any) => {
          return {
               value: query.WORK_ID,
               label: query.WORK_NAME,
          };
     });

     return (
          <>
               <section>
                    <div>
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-medium">
                                   Data Nasabah
                              </legend>
                              <div className="px-4 py-2">
                                   <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4">
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"Nama Nasabah"}
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_NAME"
                                                  value={
                                                       dataNasabah?.THE_INSURED_NAME
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_NAME:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  required
                                                  autoComplete="off"
                                                  placeholder="Nama Nasabah"
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"NIK Nasabah"}
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_ID_NUMBER"
                                                  value={
                                                       dataNasabah?.THE_INSURED_ID_NUMBER
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_ID_NUMBER:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  onBlur={(e: any) => {
                                                       cekJumlahNIK(
                                                            e.target.value
                                                       );
                                                  }}
                                                  required
                                                  autoComplete="off"
                                                  placeholder="NIK Nasabah"
                                             />
                                             {cekNIK !== "" && (
                                                  <span className="text-xs italic text-red-600">
                                                       {cekNIK}
                                                  </span>
                                             )}
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Tanggal Lahir Nasabah"
                                                  required={true}
                                             />
                                             <DatePickerFlowBite
                                                  value={
                                                       dataNasabah.THE_INSURED_DATE_OF_BIRTH
                                                            ? dateFormat(
                                                                   dataNasabah.THE_INSURED_DATE_OF_BIRTH,
                                                                   "dd-mm-yyyy"
                                                              )
                                                            : "dd-mm-yyyy"
                                                  }
                                                  onSelectedDateChanged={
                                                       handleTglLahir
                                                  }
                                                  className={
                                                       "ring-1 rounded-md focus:!ring-primary-adele"
                                                  }
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Gender Debitur"
                                                  required={true}
                                             />
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
                                                                      : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectGender}
                                                  isSearchable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={
                                                       dataNasabah?.THE_INSURED_GENDER
                                                  }
                                                  onChange={(e: any) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_GENDER:
                                                                 e,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Pekerjaan"
                                                  required={false}
                                             />
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
                                                                      : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectWork}
                                                  isSearchable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={
                                                       dataNasabah?.THE_INSURED_WORK
                                                  }
                                                  onChange={(e: any) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_WORK: e,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"Tempat Bekerja"}
                                                  required={false}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_WORK_PLACE"
                                                  value={
                                                       dataNasabah?.THE_INSURED_WORK_PLACE
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_WORK_PLACE:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  autoComplete="off"
                                                  placeholder="Tempat Bekerja"
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"Lama Bekerja"}
                                                  required={false}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_LAMA_BEKERJA"
                                                  value={
                                                       dataNasabah?.THE_INSURED_LAMA_BEKERJA
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_LAMA_BEKERJA:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  autoComplete="off"
                                                  placeholder="Lama Bekerja"
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"Jabatan"}
                                                  required={false}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_JABATAN"
                                                  value={
                                                       dataNasabah?.THE_INSURED_JABATAN
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_JABATAN:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  autoComplete="off"
                                                  placeholder="Jabatan"
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"CIF Nasabah"}
                                                  required={false}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_CIF"
                                                  value={
                                                       dataNasabah?.THE_INSURED_CIF
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataNasabah({
                                                            ...dataNasabah,
                                                            THE_INSURED_CIF:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  autoComplete="off"
                                                  placeholder="CIF Nasabah"
                                             />
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                    </div>
                    <div className="mt-2">
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-medium">
                                   Dokumen Nasabah
                              </legend>
                              <div className="px-4 py-2">
                                   <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-4">
                                        <div>
                                             <InputLabel
                                                  value="Upload KTP"
                                                  required={true}
                                             />
                                             <div className="w-full">
                                                  <input
                                                       className="block w-full text-sm text-gray-600 border bg-primary-adele rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                       id="file_input"
                                                       type="file"
                                                       required
                                                       onChange={(e: any) => {
                                                            setDataNasabah({
                                                                 ...dataNasabah,
                                                                 DOCUMENT_KTP_ID:
                                                                      e.target
                                                                           .files,
                                                            });
                                                       }}
                                                  ></input>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                    </div>
               </section>
          </>
     );
}
