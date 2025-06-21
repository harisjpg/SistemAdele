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
import axios from "axios";

export default function DetailEditNasabah({
     textButton,
     dataEditNasabah,
     setDataEditNasabah,
     dataWork,
}: PropsWithChildren<{
     textButton: any;
     dataEditNasabah: any;
     setDataEditNasabah: any;
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
          setDataEditNasabah({
               ...dataEditNasabah,
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

     const getGenderDebitur = (value: any) => {
          if (value) {
               const selected = selectGender.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     const handleDownloadFileKTP = async (idDocument: any) => {
          await axios({
               url: `/downloadKTP/${idDocument}`,
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

     const selectWork = dataWork?.map((query: any) => {
          return {
               value: query.WORK_ID,
               label: query.WORK_NAME,
          };
     });

     const getLabelPekerjaan = (value: any) => {
          if (value) {
               const selected = selectWork.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

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
                                                  required={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? false
                                                            : true
                                                  }
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_NAME"
                                                  value={
                                                       dataEditNasabah?.THE_INSURED_NAME
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_NAME:
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
                                                  placeholder="Nama Nasabah"
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"NIK Nasabah"}
                                                  required={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? false
                                                            : true
                                                  }
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_ID_NUMBER"
                                                  value={
                                                       dataEditNasabah?.THE_INSURED_ID_NUMBER
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_ID_NUMBER:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  onBlur={(e: any) => {
                                                       cekJumlahNIK(
                                                            e.target.value
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
                                                  required={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? false
                                                            : true
                                                  }
                                             />
                                             <DatePickerFlowBite
                                                  value={
                                                       dataEditNasabah.THE_INSURED_DATE_OF_BIRTH
                                                            ? dateFormat(
                                                                   dataEditNasabah.THE_INSURED_DATE_OF_BIRTH,
                                                                   "dd-mm-yyyy"
                                                              )
                                                            : "dd-mm-yyyy"
                                                  }
                                                  onSelectedDateChanged={
                                                       handleTglLahir
                                                  }
                                                  disabled={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? true
                                                            : false
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1 rounded-md focus:!ring-primary-adele"
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
                                                  isDisabled={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? true
                                                            : false
                                                  }
                                                  options={selectGender}
                                                  isSearchable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={{
                                                       label: getGenderDebitur(
                                                            dataEditNasabah?.THE_INSURED_GENDER
                                                       ),
                                                       value: dataEditNasabah?.THE_INSURED_GENDER,
                                                  }}
                                                  onChange={(e: any) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_GENDER:
                                                                 e.value,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
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
                                                  options={selectWork}
                                                  isDisabled={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? true
                                                            : false
                                                  }
                                                  isSearchable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={{
                                                       label: getLabelPekerjaan(
                                                            dataEditNasabah?.THE_INSURED_WORK
                                                       ),
                                                       value: dataEditNasabah?.THE_INSURED_WORK,
                                                  }}
                                                  onChange={(e: any) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_WORK:
                                                                 e.value,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
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
                                                       dataEditNasabah?.THE_INSURED_WORK_PLACE
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_WORK_PLACE:
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
                                                  placeholder="Tempat Bekerja"
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"Lama Bekerja"}
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="THE_INSURED_LAMA_BEKERJA"
                                                  value={
                                                       dataEditNasabah?.THE_INSURED_LAMA_BEKERJA
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_LAMA_BEKERJA:
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
                                                       dataEditNasabah?.THE_INSURED_JABATAN
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_JABATAN:
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
                                                       dataEditNasabah?.THE_INSURED_CIF
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditNasabah({
                                                            ...dataEditNasabah,
                                                            THE_INSURED_CIF:
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
                                             <div
                                                  className="text-xs text-blue-600 hover:cursor-pointer hover:text-blue-400 hover:underline w-fit"
                                                  onClick={(e) => {
                                                       if (
                                                            dataEditNasabah?.DOCUMENT_KTP_ID !==
                                                            null
                                                                 ? handleDownloadFileKTP(
                                                                        dataEditNasabah
                                                                             .DOCUMENT_KTP_ID
                                                                             ?.DOCUMENT_ID
                                                                   )
                                                                 : null
                                                       ) {
                                                       }
                                                  }}
                                             >
                                                  {dataEditNasabah?.DOCUMENT_KTP_ID ===
                                                  null ? (
                                                       <>
                                                            <span>
                                                                 Dokumen belum
                                                                 tersedia
                                                            </span>
                                                       </>
                                                  ) : (
                                                       <>
                                                            <span>
                                                                 {
                                                                      dataEditNasabah
                                                                           ?.DOCUMENT_KTP_ID
                                                                           .DOCUMENT_FILENAME
                                                                 }
                                                            </span>
                                                       </>
                                                  )}
                                             </div>
                                             <InputLabel value="Upload KTP" />
                                             <div className="w-full">
                                                  <input
                                                       className={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? "bg-gray-300 text-black block w-full text-sm border bg-[var(--dynamic-color)] rounded-lg dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                                 : "block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                       }
                                                       id="file_input"
                                                       type="file"
                                                       onChange={(e: any) => {
                                                            setDataEditNasabah({
                                                                 ...dataEditNasabah,
                                                                 DOCUMENT_KTP_ID:
                                                                      e.target
                                                                           .files,
                                                            });
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
                    </div>
               </section>
          </>
     );
}
