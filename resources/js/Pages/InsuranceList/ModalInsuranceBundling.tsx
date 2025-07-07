import DataTables from "@/Components/DataTables";
import InputLabel from "@/Components/InputLabel";
import Loader from "@/Components/Loader";
import TextInput from "@/Components/TextInput";
import TextSearch from "@/Components/TextSearch";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {
     FormEvent,
     PropsWithChildren,
     useEffect,
     useRef,
     useState,
} from "react";
import CurrencyInput from "react-currency-input-field";
import SelectTailwind from "react-tailwindcss-select";

export default function ModalInsuranceBundling({
     insuranceType,
     produkAsuransi,
     comboInsurance,
     comboUnderwriting,
     setIsSuccess,
}: PropsWithChildren<{
     insuranceType: any;
     produkAsuransi: any;
     comboInsurance: any;
     comboUnderwriting: any;
     setIsSuccess: any;
}>) {
     // for success alert
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");

     // for search datatable
     const [search, setSearch] = useState<any>("");

     // VARIABEL FOR INSURANCE BUNDLING
     const [dataInsuranceBundling, setDataInsuranceBundling] = useState<any>({
          INSURANCE_NAME: "",
          INSURANCE_TYPE_ID: null,
          INSURANCE_BUNDLING_ID: null,
          INSURANCE_LEADER_BUNDLING: null,
          PRODUK_ASURANSI_ID: null,
          UNDERWRITING_ID: null,
          INSURANCE_SLUG: "",
          INSURANCE_CREATED_BY: "",
          INSURANCE_CREATED_DATE: "",
          UPLOAD_FILE_BUNDLING: "",
     });

     // for combo asuransi
     const comboInsuranceType = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });

     // for combo asuransi
     const comboInsuranceParent = comboInsurance?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.text_combo,
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

     // for combo produk asuransi
     const comboProdukAsuransi = produkAsuransi?.map((query: any) => {
          return {
               value: query.PRODUK_ASURANSI_ID,
               label: query.PRODUK_ASURANSI_NAME,
          };
     });

     // set form insurance bundling
     const [formBundling, setFormBundling] = useState<boolean>(true);

     // loader save insurance bundling
     const [isLoader, setIsLoader] = useState<any>(false);

     // for ajukan ke asuransi
     const saveBundlingInsurance = async (dataInsuranceBundling: any) => {
          if (
               dataInsuranceBundling.INSURANCE_NAME === "" ||
               dataInsuranceBundling.INSURANCE_TYPE_ID === null ||
               dataInsuranceBundling.INSURANCE_BUNDLING_ID === null ||
               dataInsuranceBundling.INSURANCE_LEADER_BUNDLING === null ||
               dataInsuranceBundling.PRODUK_ASURANSI_ID === null
          ) {
               setIsLoader(true);
               alert("Data Insurance Bundling Tidak Lengkap");
               setIsLoader(false);
          } else {
               setIsLoader(true);
               await axios
                    .post(`/saveBundlingInsurance`, dataInsuranceBundling, {
                         headers: {
                              "Content-Type": "multipart/form-data",
                         },
                         responseType: "blob",
                    })
                    .then((res) => {
                         setDataInsuranceBundling({
                              INSURANCE_NAME: "",
                              INSURANCE_TYPE_ID: null,
                              INSURANCE_BUNDLING_ID: null,
                              INSURANCE_LEADER_BUNDLING: null,
                              PRODUK_ASURANSI_ID: null,
                              UNDERWRITING_ID: null,
                              INSURANCE_SLUG: "",
                              INSURANCE_CREATED_BY: "",
                              INSURANCE_CREATED_DATE: "",
                         });
                         setRefreshTrigger("success");
                         setTimeout(() => {
                              setRefreshTrigger("");
                         }, 1000);
                         setIsSuccess(res.data[0]);
                         setTimeout(() => {
                              setRefreshTrigger("");
                         }, 1000);
                         setIsLoader(false);
                         setFormBundling(false);
                    })
                    .catch((err) => {
                         console.log(err);
                    });
          }
     };

     console.log(dataInsuranceBundling, "dataInsuranceBundling");

     return (
          <section>
               <div className="grid grid-cols-2 gap-2 mb-2">
                    {/* for table insurance bundling */}
                    <div className="bg-white w-full shadow-md rounded-md p-4">
                         {/* Search */}
                         <div className="bg-slate-100 p-3 rounded-t-md flex items-center gap-2">
                              <div className="w-full">
                                   <TextSearch
                                        type="text"
                                        className="ring-1"
                                        placeholder="Search for Nama Asuransi, dll"
                                        value={search}
                                        onChange={(e: any) => {
                                             setSearch(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                             if (e.key === "Enter") {
                                                  setRefreshTrigger("success");
                                                  setTimeout(() => {
                                                       setRefreshTrigger("");
                                                  }, 1000);
                                             }
                                        }}
                                        search={search}
                                        setSearch={setSearch}
                                        setRefreshTrigger={setRefreshTrigger}
                                   />
                              </div>
                              <div>
                                   <ArrowPathIcon
                                        className="w-6 text-slate-500 hover:cursor-pointer hover:text-slate-300"
                                        onClick={(e) => {
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   />
                              </div>
                         </div>
                         {/* End Search */}
                         <div>
                              <DataTables
                                   columns={[
                                        {
                                             name: "Nama Asuransi Gabungan",
                                             selector: (row: any) =>
                                                  row.INSURANCE_NAME,
                                             sortable: true,
                                             width: "282px",
                                        },
                                        {
                                             name: "Jenis Asuransinya",
                                             selector: (row: any) =>
                                                  row.JENIS_ASURANSI_NAME,
                                             sortable: true,
                                             width: "282px",
                                        },
                                        {
                                             name: "Leader",
                                             selector: (row: any) =>
                                                  row.INSURANCE_CODE,
                                             sortable: true,
                                             cell: (row: any) => (
                                                  <>
                                                       {row.t_insurance_bundling
                                                            ?.filter(
                                                                 (
                                                                      dataFilter: any
                                                                 ) =>
                                                                      dataFilter.INSURANCE_BUNDLING_LEADER !==
                                                                      null
                                                            )
                                                            .map(
                                                                 (
                                                                      dataMap: any
                                                                 ) =>
                                                                      dataMap
                                                                           .name_insurance
                                                                           .INSURANCE_NAME
                                                            )}
                                                  </>
                                             ),
                                        },
                                   ]}
                                   url={"/getInsuranceBundling"}
                                   search={search}
                                   refreshTrigger={refreshTrigger}
                                   handleDoubleClick={undefined}
                              />
                         </div>
                    </div>
                    {/* end for table insurance bundling */}
                    {/* for form insurance bundling */}
                    <div className="bg-white w-full shadow-md rounded-md p-4">
                         {isLoader === true ? (
                              <>
                                   <Loader />
                              </>
                         ) : (
                              <>
                                   {formBundling === false ? (
                                        <div
                                             className="text-xs bg-blue-600 w-fit p-2 rounded-md text-white hover:cursor-pointer hover:bg-blue-700"
                                             onClick={(e) => {
                                                  setFormBundling(true);
                                             }}
                                        >
                                             <span>
                                                  Tambah Asuransi Bundling
                                             </span>
                                        </div>
                                   ) : (
                                        <div
                                             className="text-xs bg-blue-600 w-fit p-2 rounded-md text-white hover:cursor-pointer hover:bg-blue-700"
                                             onClick={(e) => {
                                                  saveBundlingInsurance(
                                                       dataInsuranceBundling
                                                  );
                                             }}
                                        >
                                             <span>Submit</span>
                                        </div>
                                   )}

                                   {formBundling && (
                                        <section>
                                             <div className="grid grid-cols-2 gap-4">
                                                  <div>
                                                       <InputLabel
                                                            className="mt-2"
                                                            htmlFor="INSURANCE_NAME"
                                                            value={
                                                                 "Nama Asuransi Bundling"
                                                            }
                                                            required={true}
                                                       />
                                                       <TextInput
                                                            type="text"
                                                            name="INSURANCE_NAME"
                                                            value={
                                                                 dataInsuranceBundling.INSURANCE_NAME
                                                            }
                                                            className="ring-1"
                                                            onChange={(e) => {
                                                                 setDataInsuranceBundling(
                                                                      {
                                                                           ...dataInsuranceBundling,
                                                                           INSURANCE_NAME:
                                                                                e
                                                                                     .target
                                                                                     .value,
                                                                      }
                                                                 );
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
                                                            value={
                                                                 "Jenis Produk Asuransi"
                                                            }
                                                            required={true}
                                                       />
                                                       <SelectTailwind
                                                            classNames={{
                                                                 menuButton:
                                                                      () =>
                                                                           `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                                            options={
                                                                 comboInsuranceType
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            placeholder={
                                                                 "--Pilih Jenis Produk Asuransi--"
                                                            }
                                                            value={
                                                                 dataInsuranceBundling.INSURANCE_TYPE_ID
                                                            }
                                                            onChange={(e) => {
                                                                 setDataInsuranceBundling(
                                                                      {
                                                                           ...dataInsuranceBundling,
                                                                           INSURANCE_TYPE_ID:
                                                                                e,
                                                                      }
                                                                 );
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
                                                            }
                                                       />
                                                  </div>
                                             </div>
                                             <div className="grid grid-cols-1 gap-4 mt-2">
                                                  <div>
                                                       {/* for parent insurance */}
                                                       <InputLabel
                                                            className=""
                                                            htmlFor="INSURANCE_BUNDLING_ID"
                                                            value={
                                                                 "Asuransi Bundling"
                                                            }
                                                            required={false}
                                                       />
                                                       <SelectTailwind
                                                            classNames={{
                                                                 menuButton:
                                                                      () =>
                                                                           `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                                            options={
                                                                 comboInsuranceParent
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            isMultiple={true}
                                                            placeholder={
                                                                 "--Pilih Bundling Asuransi--"
                                                            }
                                                            value={
                                                                 dataInsuranceBundling.INSURANCE_BUNDLING_ID
                                                            }
                                                            onChange={(e) => {
                                                                 setDataInsuranceBundling(
                                                                      {
                                                                           ...dataInsuranceBundling,
                                                                           INSURANCE_BUNDLING_ID:
                                                                                e,
                                                                      }
                                                                 );
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
                                                            }
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
                                                                 menuButton:
                                                                      () =>
                                                                           `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                                            options={
                                                                 filterLeaderInsurance
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            placeholder={
                                                                 "--Pilih Leader Asuransi Bundling--"
                                                            }
                                                            value={
                                                                 dataInsuranceBundling.INSURANCE_LEADER_BUNDLING
                                                            }
                                                            onChange={(e) => {
                                                                 setDataInsuranceBundling(
                                                                      {
                                                                           ...dataInsuranceBundling,
                                                                           INSURANCE_LEADER_BUNDLING:
                                                                                e,
                                                                      }
                                                                 );
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
                                                            }
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
                                                            `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-md transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                                  options={comboProdukAsuransi}
                                                  isSearchable={true}
                                                  isClearable={true}
                                                  isMultiple={true}
                                                  placeholder={
                                                       "--Pilih Produk Asuransi--"
                                                  }
                                                  value={
                                                       dataInsuranceBundling.PRODUK_ASURANSI_ID
                                                  }
                                                  onChange={(e) => {
                                                       setDataInsuranceBundling(
                                                            {
                                                                 ...dataInsuranceBundling,
                                                                 PRODUK_ASURANSI_ID:
                                                                      e,
                                                            }
                                                       );
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                             <InputLabel
                                                  value="Upload File"
                                                  required={true}
                                             />
                                             <div className="w-full mt-1">
                                                  <input
                                                       className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                       id="file_input"
                                                       type="file"
                                                       required
                                                       onChange={(e: any) => {
                                                            setDataInsuranceBundling(
                                                                 {
                                                                      ...dataInsuranceBundling,
                                                                      UPLOAD_FILE_BUNDLING:
                                                                           e
                                                                                .target
                                                                                .files,
                                                                 }
                                                            );
                                                       }}
                                                  ></input>
                                             </div>
                                        </section>
                                   )}
                              </>
                         )}
                    </div>
                    {/* end form insurance bundling */}
               </div>
          </section>
     );
}
