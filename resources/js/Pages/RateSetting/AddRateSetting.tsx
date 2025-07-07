import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { XMarkIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {
     FormEvent,
     PropsWithChildren,
     useEffect,
     useRef,
     useState,
} from "react";
import SelectTailwind from "react-tailwindcss-select";

export default function AddRateSetting({
     setDataRateSetting,
     dataRateSetting,
     dataInsurance,
}: PropsWithChildren<{
     setDataRateSetting: any;
     dataRateSetting: any;
     dataInsurance: any;
}>) {
     // get data m_rate_insurance
     useEffect(() => {
          getMRateInsurance();
     }, []);

     const typeRateSetting = [
          { TYPE_NAME: "Regular", TYPE_ID: "1" },
          { TYPE_NAME: "Non Regular", TYPE_ID: "2" },
     ];

     const [dataMRateInsurance, setDataMRateInsurance] = useState<any>([]);
     const getMRateInsurance = async () => {
          await axios
               .post(`/getMRateInsurance`)
               .then((res) => {
                    // getPlugin(res.data);
                    setDataMRateInsurance(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const optionRateType = typeRateSetting?.map((query: any) => {
          return {
               value: query.TYPE_ID,
               label: query.TYPE_NAME,
          };
     });

     // const optionInsurance = dataInsurance
     //      ?.filter(
     //           (dataFilter: any) =>
     //                !dataMRateInsurance?.find(
     //                     (dataFilter2: any) =>
     //                          dataFilter2.INSURANCE_ID ===
     //                          dataFilter.INSURANCE_ID
     //                )
     //      )
     //      .map((query: any) => {
     //           return {
     //                value: query.INSURANCE_ID,
     //                label: query.INSURANCE_NAME,
     //           };
     //      });

     const optionInsurance = dataInsurance?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.INSURANCE_NAME,
          };
     });

     const addRowColumnName = (e: FormEvent) => {
          e.preventDefault();
          setDataRateSetting({
               ...dataRateSetting,
               TEMPLATE_RATE_COLUMN_NAME: [
                    ...dataRateSetting.TEMPLATE_RATE_COLUMN_NAME,
                    {
                         TEMPLATE_RATE_NAME: "",
                         TEMPLATE_RATE_DATA: "",
                    },
               ],
          });
     };

     const addRowColumnRate = async (e: any) => {
          inputColumnRate("RATE_COLUMN", "Rate 70", 0);

          setDataRateSetting({
               ...dataRateSetting,
               TEMPLATE_RATE_COLUMN: [
                    ...dataRateSetting.TEMPLATE_RATE_COLUMN,
                    {
                         RATE_COLUMN: "Rate > 70",
                    },
               ],
          });
     };

     const inputColumnTemplate = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataRateSetting.TEMPLATE_RATE_COLUMN_NAME];
          changeVal[i][name] = value;
          setDataRateSetting({
               ...dataRateSetting,
               TEMPLATE_RATE_COLUMN_NAME: changeVal,
          });
     };

     const inputColumnRate = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataRateSetting.TEMPLATE_RATE_COLUMN];
          changeVal[i][name] = value;
          setDataRateSetting({
               ...dataRateSetting,
               TEMPLATE_RATE_COLUMN: changeVal,
          });
     };

     const handleFileDownload = async (using_payroll: any) => {
          await axios({
               url: `/downloadTemplate/${using_payroll}`,
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

     const handleCheck = async (e: any) => {
          const check = e.target.checked;
          if (check === true) {
               setDefaultTiering(true);
          } else {
               setDefaultTiering(false);
          }

          if (defaultTiering === false) {
               addRowColumnRate(e);
          } else {
               inputColumnRate("RATE_COLUMN", "", 0);
               const updatedData = dataRateSetting.TEMPLATE_RATE_COLUMN.filter(
                    (data: any, a: number) => a !== 1
               );
               setDataRateSetting({
                    ...dataRateSetting,
                    TEMPLATE_RATE_COLUMN: updatedData,
               });
          }
     };

     const [defaultTiering, setDefaultTiering] = useState<boolean>(false);

     const handleUsingPayroll = (e: React.ChangeEvent<HTMLInputElement>) => {
          // Ubah nilai menjadi 1 (on) atau 0 (off) sesuai status switch
          const usingPayroll = e.target.checked ? 1 : 0;
          setDataRateSetting({
               ...dataRateSetting,
               USING_PAYROLL: usingPayroll,
          });
     };

     return (
          <>
               {/* for Bank Name */}
               <InputLabel
                    className=""
                    htmlFor="RATE_MANAGE_TYPE"
                    value={"Type"}
                    required={true}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-primary-adele`
                                        : `text-gray-500 hover:bg-primary-adele hover:text-white`
                              }`,
                    }}
                    options={optionRateType}
                    isSearchable={true}
                    placeholder={"--Choose Type Rate--"}
                    value={dataRateSetting.RATE_MANAGE_TYPE}
                    onChange={(val: any) => {
                         setDataRateSetting({
                              ...dataRateSetting,
                              RATE_MANAGE_TYPE: val,
                         });
                    }}
                    primaryColor={"bg-primary-adele"}
               />

               {/* for REGULER TEMPLATE */}
               {dataRateSetting.RATE_MANAGE_TYPE?.value === 1 ||
               dataRateSetting.RATE_MANAGE_TYPE?.value === "1" ? (
                    <>
                         <div className="flex items-center gap-2">
                              <div>
                                   <InputLabel
                                        className="mt-2"
                                        htmlFor="Using Payroll"
                                        value={"Using Payroll"}
                                        required={false}
                                   />
                              </div>
                              <div className="mt-2">
                                   <label className="relative cursor-pointer">
                                        <input
                                             type="checkbox"
                                             className="sr-only peer"
                                             checked={
                                                  dataRateSetting.USING_PAYROLL
                                             }
                                             onChange={handleUsingPayroll}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-adele peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                   </label>
                              </div>
                         </div>
                         {dataRateSetting.USING_PAYROLL === 1 ? (
                              <div className="w-full bg-white shadow-md rounded-md p-2 mt-1 transition-all duration-300">
                                   <span className="text-xs text-red-600 italic">
                                        Please provide data rate: <br></br>-
                                        Sheet 1 As Payroll <br></br>- Sheet 2 As
                                        Non Payroll
                                        <br></br>
                                   </span>
                              </div>
                         ) : null}
                         <InputLabel
                              className="mt-2"
                              htmlFor="RATE_MANAGE_NAME"
                              value={"Rate Setting Name"}
                              required={true}
                         />
                         <TextInput
                              type="text"
                              value={dataRateSetting.RATE_MANAGE_NAME}
                              className=""
                              onChange={(e) => {
                                   setDataRateSetting({
                                        ...dataRateSetting,
                                        RATE_MANAGE_NAME: e.target.value,
                                   });
                              }}
                              required
                              placeholder="Rate Setting Name"
                         />
                         <InputLabel
                              className="mt-2"
                              htmlFor="INSURANCE_ID"
                              value={"Insurance"}
                              required={true}
                         />
                         <SelectTailwind
                              classNames={{
                                   menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                   menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                   listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                             isSelected
                                                  ? `text-white bg-primary-adele`
                                                  : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                        }`,
                              }}
                              options={optionInsurance}
                              isMultiple={true}
                              isSearchable={true}
                              placeholder={"-- Select Insurance --"}
                              value={dataRateSetting.INSURANCE_ID}
                              onChange={(val: any) => {
                                   setDataRateSetting({
                                        ...dataRateSetting,
                                        INSURANCE_ID: val,
                                   });
                              }}
                              primaryColor={"bg-primary-adele"}
                         />
                         <InputLabel
                              className="mt-2"
                              htmlFor="DOWNLOAD_TEMPLATE"
                              value={"Download Template"}
                              required={false}
                         />
                         <div
                              className="text-xs text-blue-600 hover:cursor-pointer hover:text-blue-400 hover:underline"
                              onClick={(e) =>
                                   handleFileDownload(
                                        dataRateSetting.USING_PAYROLL
                                   )
                              }
                         >
                              {dataRateSetting.USING_PAYROLL === 1 ? (
                                   <span>
                                        Template_Rate_Reguler_Using_Payroll.xlsx
                                   </span>
                              ) : (
                                   <span>Template_Rate_Reguler.xlsx</span>
                              )}
                         </div>
                         <InputLabel
                              className="mt-2"
                              htmlFor="RATE_MANAGE_TEMPLATE_DOCUMENT_ID"
                              value={"Upload Rate Setting"}
                              required={true}
                         />
                         <input
                              className="block w-full text-sm text-gray-600 border bg-primary-adele rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                              id="file_input"
                              type="file"
                              required
                              onChange={(e) => {
                                   setDataRateSetting({
                                        ...dataRateSetting,
                                        RATE_MANAGE_TEMPLATE_DOCUMENT_ID:
                                             e.target.files,
                                   });
                              }}
                         ></input>
                    </>
               ) : null}
               {/* end For REGULER TAMPLATE */}

               {/* for NON REGULER */}
               {dataRateSetting.RATE_MANAGE_TYPE?.value === 2 ||
               dataRateSetting.RATE_MANAGE_TYPE.value === "2" ? (
                    <>
                         <InputLabel
                              className="mt-2"
                              htmlFor="RATE_MANAGE_NAME"
                              value={"Name"}
                              required={true}
                         />
                         <TextInput
                              type="text"
                              value={dataRateSetting.RATE_MANAGE_NAME}
                              className=""
                              onChange={(e) => {
                                   setDataRateSetting({
                                        ...dataRateSetting,
                                        RATE_MANAGE_NAME: e.target.value,
                                   });
                              }}
                              required
                              placeholder="Name"
                         />
                         <InputLabel
                              className="mt-2"
                              htmlFor="INSURANCE_ID"
                              value={"Insurance"}
                              required={true}
                         />
                         <SelectTailwind
                              classNames={{
                                   menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                   menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                   listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                             isSelected
                                                  ? `text-white bg-primary-adele`
                                                  : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                        }`,
                              }}
                              options={optionInsurance}
                              isMultiple={true}
                              isSearchable={true}
                              placeholder={"-- Select Insurance --"}
                              value={dataRateSetting.INSURANCE_ID}
                              onChange={(val: any) => {
                                   setDataRateSetting({
                                        ...dataRateSetting,
                                        INSURANCE_ID: val,
                                   });
                              }}
                              primaryColor={"bg-primary-adele"}
                         />
                         <div className="grid grid-cols-2 gap-2">
                              <InputLabel
                                   className="mt-2"
                                   htmlFor="TEMPLATE_RATE_NAME"
                                   value={"Column Name"}
                                   required={true}
                              />
                              <InputLabel
                                   className="mt-2"
                                   htmlFor="TEMPLATE_RATE_NAME"
                                   value={"Source Data"}
                                   required={false}
                              />
                         </div>
                         {dataRateSetting.TEMPLATE_RATE_COLUMN_NAME?.map(
                              (rateColumn: any, i: number) => {
                                   return (
                                        <div
                                             className="flex justify-center items-center gap-2"
                                             key={i}
                                        >
                                             <TextInput
                                                  type="text"
                                                  value={
                                                       rateColumn.TEMPLATE_RATE_NAME
                                                  }
                                                  className="mb-2"
                                                  onChange={(e) => {
                                                       inputColumnTemplate(
                                                            "TEMPLATE_RATE_NAME",
                                                            e.target.value,
                                                            i
                                                       );
                                                  }}
                                                  required
                                                  placeholder="Column Name"
                                             />
                                             <TextInput
                                                  type="text"
                                                  value={
                                                       rateColumn.TEMPLATE_RATE_DATA
                                                  }
                                                  className="mb-2"
                                                  onChange={(e) => {
                                                       inputColumnTemplate(
                                                            "TEMPLATE_RATE_DATA",
                                                            e.target.value,
                                                            i
                                                       );
                                                  }}
                                                  placeholder="Data"
                                             />
                                             {dataRateSetting
                                                  .TEMPLATE_RATE_COLUMN_NAME
                                                  .length !== 1 && (
                                                  <XMarkIcon
                                                       className="w-14 text-red-600 hover:cursor-pointer -mt-2"
                                                       onClick={() => {
                                                            const updatedData =
                                                                 dataRateSetting.TEMPLATE_RATE_COLUMN_NAME.filter(
                                                                      (
                                                                           data: any,
                                                                           a: number
                                                                      ) =>
                                                                           a !==
                                                                           i
                                                                 );
                                                            setDataRateSetting({
                                                                 ...dataRateSetting,
                                                                 TEMPLATE_RATE_COLUMN_NAME:
                                                                      updatedData,
                                                            });
                                                       }}
                                                  />
                                             )}
                                        </div>
                                   );
                              }
                         )}
                         <a
                              className="text-xs cursor-pointer text-gray-400"
                              onClick={(e) => addRowColumnName(e)}
                         >
                              <span className="hover:underline hover:decoration-from-font">
                                   + Add Column Name
                              </span>
                         </a>

                         <div className="flex gap-2">
                              <InputLabel
                                   className=""
                                   htmlFor="TIERING"
                                   value={"Tiering "}
                                   required={true}
                              />
                              <div>
                                   <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                             type="checkbox"
                                             className="sr-only peer"
                                             checked={defaultTiering}
                                             onChange={(e: any) => {
                                                  handleCheck(e);
                                             }}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-adele peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                   </label>
                              </div>
                         </div>
                         <InputLabel
                              className=""
                              htmlFor="Rate"
                              value={"Column Rate"}
                              required={true}
                         />

                         {dataRateSetting.TEMPLATE_RATE_COLUMN?.map(
                              (dataRate: any, i: number) => {
                                   return (
                                        <div
                                             key={i}
                                             className="grid grid-cols-2"
                                        >
                                             <TextInput
                                                  type="text"
                                                  value={dataRate.RATE_COLUMN}
                                                  className=" mb-2"
                                                  onChange={(e) => {
                                                       inputColumnRate(
                                                            "RATE_COLUMN",
                                                            e.target.value,
                                                            i
                                                       );
                                                  }}
                                                  required
                                                  placeholder="Rate"
                                             />
                                             {/* {dataRateSetting
                                                  .TEMPLATE_RATE_COLUMN
                                                  .length !== 1 && (
                                                  <XMarkIcon
                                                       className="w-6 text-red-600 hover:cursor-pointer -mt-1"
                                                       onClick={() => {
                                                            const updatedData =
                                                                 dataRateSetting.TEMPLATE_RATE_COLUMN.filter(
                                                                      (
                                                                           data: any,
                                                                           a: number
                                                                      ) =>
                                                                           a !==
                                                                           i
                                                                 );
                                                            setDataRateSetting({
                                                                 ...dataRateSetting,
                                                                 TEMPLATE_RATE_COLUMN:
                                                                      updatedData,
                                                            });
                                                       }}
                                                  />
                                             )} */}
                                        </div>
                                   );
                              }
                         )}
                    </>
               ) : null}
               {/* end for NON REGULAR */}
          </>
     );
}
