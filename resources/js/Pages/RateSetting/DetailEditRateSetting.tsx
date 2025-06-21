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

export default function DetailEditRateSetting({
     setDataEditRateSetting,
     dataEditRateSetting,
     dataInsurance,
     textButton,
}: PropsWithChildren<{
     setDataEditRateSetting: any;
     dataEditRateSetting: any;
     dataInsurance: any;
     textButton: any;
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

     const optionInsurance = dataInsurance?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.INSURANCE_NAME,
          };
     });

     const addRowColumnName = (e: FormEvent) => {
          e.preventDefault();
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_template: [
                    ...dataEditRateSetting.rate_template,
                    {
                         TEMPLATE_RATE_COLUMN_NAME: "",
                         IS_RATE: 0,
                         TEMPLATE_RATE_ID:
                              dataEditRateSetting.rate_template[
                                   dataEditRateSetting.rate_template.length - 1
                              ].TEMPLATE_RATE_ID + 1,
                    },
               ],
          });
     };

     const addRowColumnDataSource = (e: FormEvent) => {
          e.preventDefault();
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_data_source: [
                    ...dataEditRateSetting.rate_data_source,
                    {
                         RATE_DATA_SOURCE_NAME: "",
                         RATE_DATA_SOURCE_ID:
                              dataEditRateSetting.rate_data_source[
                                   dataEditRateSetting.rate_data_source.length -
                                        1
                              ].RATE_DATA_SOURCE_ID + 1,
                    },
               ],
          });
     };

     const addRowColumnRate = (e: FormEvent) => {
          e.preventDefault();
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_template: [
                    ...dataEditRateSetting.rate_template,
                    {
                         TEMPLATE_RATE_COLUMN_NAME: "Rate > 70",
                         IS_RATE: 1,
                         TEMPLATE_RATE_ID:
                              dataEditRateSetting.rate_template[
                                   dataEditRateSetting.rate_template.length - 1
                              ].TEMPLATE_RATE_ID + 1,
                    },
               ],
          });
     };

     const inputColumnTemplate = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataEditRateSetting.rate_template];
          changeVal[i][name] = value;
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_template: changeVal,
          });
     };

     const inputColumnTemplateRate = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const updatedItems = dataEditRateSetting.rate_template.map(
               (item: any) => {
                    if (item.TEMPLATE_RATE_ID === i) {
                         return {
                              ...item,
                              TEMPLATE_RATE_COLUMN_NAME: value,
                         };
                    }
                    return item;
               }
          );
          // const changeVal: any = [...dataEditRateSetting.rate_template];
          // changeVal[i][name] = value;
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_template: updatedItems,
          });
     };

     const inputColumnSourceData = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataEditRateSetting.rate_data_source];
          changeVal[i][name] = value;
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_data_source: changeVal,
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

     const [defaultTiering, setDefaultTiering] = useState<boolean>(false);
     useEffect(() => {
          if (
               (dataEditRateSetting.rate_template?.filter(
                    (dataFilter: any) => dataFilter.IS_RATE === 1
               ).length ===
                    2) ===
               true
          ) {
               setDefaultTiering(true);
          } else {
               setDefaultTiering(false);
          }
     }, [
          dataEditRateSetting.rate_template?.filter(
               (dataFilter: any) => dataFilter.IS_RATE === 1
          ).length === 2,
     ]);

     const getRateType = (value: any) => {
          if (value) {
               const selected = optionRateType.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               if (selected.length === 0) {
                    return "";
               } else {
                    return selected[0].label;
               }
          }
     };

     const getSelectInsurance = (dataInsurance: any) => {
          const roleFor = dataInsurance?.map((insurance: any) => {
               if (insurance?.insurance_name !== undefined) {
                    return {
                         value: insurance?.insurance_name?.INSURANCE_ID,
                         label: insurance?.insurance_name?.INSURANCE_NAME,
                    };
               } else {
                    return {
                         value: insurance.value,
                         label: insurance.label,
                    };
               }
          });
          return roleFor;
     };

     const handleFileDownloadRate = async (idDocument: any) => {
          await axios({
               url: `/downloadRate/${idDocument}`,
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
          // if (check === true) {
          //      setDefaultTiering(true);
          // } else {
          //      setDefaultTiering(false);
          // }

          if (check === false) {
               const updatedData = dataEditRateSetting.rate_template.filter(
                    (data: any, a: number) => data.IS_RATE !== 1
               );
               setDataEditRateSetting({
                    ...dataEditRateSetting,
                    rate_template: updatedData,
               });

               tambahRowRate(updatedData);
          } else {
               addRowColumnRate(e);
          }
     };

     const tambahRowRate = (updatedData: any) => {
          const roRate = [
               {
                    TEMPLATE_RATE_COLUMN_NAME: "Rate",
                    IS_RATE: 1,
                    TEMPLATE_RATE_ID:
                         dataEditRateSetting.rate_template[
                              dataEditRateSetting.rate_template.length - 1
                         ].TEMPLATE_RATE_ID + 1,
               },
          ];

          const concatArray = updatedData.concat(roRate);
          setDataEditRateSetting({
               ...dataEditRateSetting,
               rate_template: concatArray,
          });
     };

     const filterStatus0 = dataEditRateSetting.rate_template?.filter(
          (data: any) => data.IS_RATE === 0
     );
     const filterStatus1 = dataEditRateSetting.rate_template?.filter(
          (data: any) => data.IS_RATE === 1
     );

     const [activeTab, setActiveTab] = useState<string>("Edit");
     //component tab
     interface TabProps {
          label: string;
          onClick: () => void;
          active: boolean;
     }

     const Tab: React.FC<TabProps> = ({ label, onClick, active }) => {
          return (
               <div
                    className={`px-4 py-2 focus:outline-none cursor-pointer ${
                         active
                              ? "border-b-2 border-blue-500"
                              : "border-b-2 border-transparent"
                    }`}
                    onClick={onClick}
               >
                    {label}
               </div>
          );
     };

     const handleEditUsingPayroll = (
          e: React.ChangeEvent<HTMLInputElement>
     ) => {
          // Ubah nilai menjadi 1 (on) atau 0 (off) sesuai status switch
          const usingPayroll = e.target.checked ? 1 : 0;
          setDataEditRateSetting({
               ...dataEditRateSetting,
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
                    required={textButton.textButton === "Edit" ? false : true}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 bg-gray-300`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-[var(--dynamic-color)]`
                                        : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                              }`,
                    }}
                    options={optionRateType}
                    isSearchable={true}
                    placeholder={"--Choose Type Rate--"}
                    value={{
                         label: getRateType(
                              dataEditRateSetting.RATE_MANAGE_TYPE
                         ),
                         value: dataEditRateSetting.RATE_MANAGE_TYPE,
                    }}
                    isDisabled={true}
                    onChange={(val: any) => {
                         setDataEditRateSetting({
                              ...dataEditRateSetting,
                              RATE_MANAGE_TYPE: val.value,
                         });
                    }}
                    primaryColor={"bg-[var(--dynamic-color)]"}
               />

               {/* for REGULER TEMPLATE */}
               {dataEditRateSetting.RATE_MANAGE_TYPE === 1 ||
               dataEditRateSetting.RATE_MANAGE_TYPE === "1" ? (
                    <>
                         <InputLabel
                              className="mt-2"
                              htmlFor="RATE_MANAGE_NAME"
                              value={"Name"}
                              required={
                                   textButton.textButton === "Edit"
                                        ? false
                                        : true
                              }
                         />
                         <TextInput
                              type="text"
                              value={dataEditRateSetting.RATE_MANAGE_NAME}
                              className={`${
                                   textButton.textButton !== "Edit"
                                        ? `bg-white`
                                        : `bg-gray-300`
                              }`}
                              onChange={(e) => {
                                   setDataEditRateSetting({
                                        ...dataEditRateSetting,
                                        RATE_MANAGE_NAME: e.target.value,
                                   });
                              }}
                              required
                              disabled={
                                   textButton.textButton === "Edit"
                                        ? true
                                        : false
                              }
                              placeholder="Name"
                         />
                         <div className="flex items-center gap-2 mt-3">
                              <div>
                                   <InputLabel
                                        className=""
                                        htmlFor="Using Payroll"
                                        value={"Using Payroll"}
                                        required={false}
                                   />
                              </div>
                              <div className="">
                                   <label className="relative cursor-pointer">
                                        <input
                                             type="checkbox"
                                             className="sr-only peer"
                                             checked={
                                                  dataEditRateSetting.USING_PAYROLL
                                             }
                                             onChange={handleEditUsingPayroll}
                                             disabled={
                                                  textButton.textButton ===
                                                  "Edit"
                                                       ? true
                                                       : false
                                             }
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[var(--dynamic-color)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                   </label>
                              </div>
                         </div>
                         {dataEditRateSetting.USING_PAYROLL === 1 ? (
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
                              htmlFor="INSURANCE_ID"
                              value={"Insurance"}
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
                                                  ? `text-white bg-[var(--dynamic-color)]`
                                                  : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                        }`,
                              }}
                              options={optionInsurance}
                              isMultiple={true}
                              isSearchable={true}
                              placeholder={"-- Select Insurance --"}
                              value={getSelectInsurance(
                                   dataEditRateSetting?.insurance_rate
                              )}
                              isDisabled={
                                   textButton.textButton === "Edit"
                                        ? true
                                        : false
                              }
                              isClearable
                              onChange={(val: any) => {
                                   setDataEditRateSetting({
                                        ...dataEditRateSetting,
                                        insurance_rate: val,
                                   });
                              }}
                              primaryColor={"bg-[var(--dynamic-color)]"}
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
                                        dataEditRateSetting.USING_PAYROLL
                                   )
                              }
                         >
                              {dataEditRateSetting.USING_PAYROLL === 1 ? (
                                   <span>
                                        Template_Rate_Reguler_Using_Payroll
                                   </span>
                              ) : (
                                   <span>Template_Rate_Reguler.xlsx</span>
                              )}
                         </div>
                         <InputLabel
                              className="mt-2"
                              htmlFor="RATE_MANAGE_TEMPLATE_DOCUMENT_ID"
                              value={"Upload Rate Setting"}
                              required={
                                   textButton.textButton === "Edit"
                                        ? false
                                        : true
                              }
                         />
                         <div
                              className="text-xs text-blue-600 hover:cursor-pointer hover:text-blue-400 hover:underline mb-2"
                              onClick={(e) =>
                                   handleFileDownloadRate(
                                        dataEditRateSetting.RATE_MANAGE_FIX_DOCUMENT_ID
                                   )
                              }
                         >
                              <span>
                                   {
                                        dataEditRateSetting.document_template
                                             .DOCUMENT_FILENAME
                                   }
                              </span>
                         </div>
                         <input
                              className={
                                   textButton.textButton === "Edit"
                                        ? "bg-gray-300 text-black block w-full text-sm border bg-[var(--dynamic-color)] rounded-lg dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                        : "block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                              }
                              id="file_input"
                              type="file"
                              onChange={(e) => {
                                   setDataEditRateSetting({
                                        ...dataEditRateSetting,
                                        RATE_MANAGE_TEMPLATE_DOCUMENT_ID:
                                             e.target.files,
                                   });
                              }}
                              disabled={
                                   textButton.textButton === "Edit"
                                        ? true
                                        : false
                              }
                         ></input>
                    </>
               ) : null}
               {/* end For REGULER TAMPLATE */}

               {/* for NON REGULER */}
               {dataEditRateSetting.RATE_MANAGE_TYPE === 2 ||
               dataEditRateSetting.RATE_MANAGE_TYPE === "2" ? (
                    <>
                         <div className="mt-5">
                              <div className="w-full">
                                   <div className="flex border-b mb-4">
                                        <div className="flex border-r">
                                             <Tab
                                                  label="Edit"
                                                  onClick={() =>
                                                       setActiveTab("Edit")
                                                  }
                                                  active={activeTab === "Edit"}
                                             />
                                        </div>

                                        <Tab
                                             label="Upload Rate"
                                             onClick={() =>
                                                  setActiveTab("Upload")
                                             }
                                             active={activeTab === "Upload"}
                                        />
                                   </div>
                                   <div>
                                        {activeTab === "Edit" && (
                                             <>
                                                  <InputLabel
                                                       className="mt-2"
                                                       htmlFor="RATE_MANAGE_NAME"
                                                       value={"Name"}
                                                       required={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? false
                                                                 : true
                                                       }
                                                  />
                                                  <TextInput
                                                       type="text"
                                                       value={
                                                            dataEditRateSetting.RATE_MANAGE_NAME
                                                       }
                                                       className={`${
                                                            textButton.textButton !==
                                                            "Edit"
                                                                 ? `bg-white`
                                                                 : `bg-gray-300`
                                                       }`}
                                                       onChange={(e) => {
                                                            setDataEditRateSetting(
                                                                 {
                                                                      ...dataEditRateSetting,
                                                                      RATE_MANAGE_NAME:
                                                                           e
                                                                                .target
                                                                                .value,
                                                                 }
                                                            );
                                                       }}
                                                       required
                                                       disabled={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? true
                                                                 : false
                                                       }
                                                       placeholder="Name"
                                                  />
                                                  <InputLabel
                                                       className="mt-2"
                                                       htmlFor="INSURANCE_ID"
                                                       value={"Insurance"}
                                                       required={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? false
                                                                 : true
                                                       }
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
                                                       options={optionInsurance}
                                                       isMultiple={true}
                                                       isSearchable={true}
                                                       placeholder={
                                                            "-- Select Insurance --"
                                                       }
                                                       value={getSelectInsurance(
                                                            dataEditRateSetting?.insurance_rate
                                                       )}
                                                       isDisabled={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? true
                                                                 : false
                                                       }
                                                       isClearable
                                                       onChange={(val: any) => {
                                                            setDataEditRateSetting(
                                                                 {
                                                                      ...dataEditRateSetting,
                                                                      insurance_rate:
                                                                           val,
                                                                 }
                                                            );
                                                       }}
                                                       primaryColor={
                                                            "bg-[var(--dynamic-color)]"
                                                       }
                                                  />
                                                  <div className="grid grid-cols-2 gap-2">
                                                       <InputLabel
                                                            className="mt-2"
                                                            htmlFor="TEMPLATE_RATE_NAME"
                                                            value={
                                                                 "Column Name"
                                                            }
                                                            required={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? false
                                                                      : true
                                                            }
                                                       />
                                                       <InputLabel
                                                            className="mt-2"
                                                            htmlFor="TEMPLATE_RATE_NAME"
                                                            value={
                                                                 "Source Data"
                                                            }
                                                            required={false}
                                                       />
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-2">
                                                       <div className="">
                                                            {filterStatus0?.map(
                                                                 (
                                                                      rateColumn: any,
                                                                      i: number
                                                                 ) => {
                                                                      return (
                                                                           <div
                                                                                className="flex justify-center items-center gap-1"
                                                                                key={
                                                                                     i
                                                                                }
                                                                           >
                                                                                <TextInput
                                                                                     type="text"
                                                                                     value={
                                                                                          rateColumn.TEMPLATE_RATE_COLUMN_NAME
                                                                                     }
                                                                                     className={`${
                                                                                          textButton.textButton !==
                                                                                          "Edit"
                                                                                               ? `bg-white mb-2`
                                                                                               : `bg-gray-300 mb-2`
                                                                                     }`}
                                                                                     onChange={(
                                                                                          e
                                                                                     ) => {
                                                                                          inputColumnTemplateRate(
                                                                                               "TEMPLATE_RATE_COLUMN_NAME",
                                                                                               e
                                                                                                    .target
                                                                                                    .value,
                                                                                               rateColumn.TEMPLATE_RATE_ID
                                                                                          );
                                                                                     }}
                                                                                     disabled={
                                                                                          textButton.textButton ===
                                                                                          "Edit"
                                                                                               ? true
                                                                                               : false
                                                                                     }
                                                                                     required
                                                                                     placeholder="Column Name"
                                                                                />
                                                                                {dataEditRateSetting.rate_template?.filter(
                                                                                     (
                                                                                          dataFilter: any
                                                                                     ) =>
                                                                                          dataFilter.IS_RATE !==
                                                                                          1
                                                                                )
                                                                                     .length !==
                                                                                     1 &&
                                                                                     textButton.textButton !==
                                                                                          "Edit" && (
                                                                                          <XMarkIcon
                                                                                               className="w-6 text-red-600 hover:cursor-pointer -mt-1"
                                                                                               onClick={() => {
                                                                                                    const updatedData =
                                                                                                         dataEditRateSetting.rate_template.filter(
                                                                                                              (
                                                                                                                   data: any,
                                                                                                                   a: number
                                                                                                              ) =>
                                                                                                                   data.TEMPLATE_RATE_ID !==
                                                                                                                   rateColumn.TEMPLATE_RATE_ID
                                                                                                         );
                                                                                                    setDataEditRateSetting(
                                                                                                         {
                                                                                                              ...dataEditRateSetting,
                                                                                                              rate_template:
                                                                                                                   updatedData,
                                                                                                         }
                                                                                                    );
                                                                                               }}
                                                                                          />
                                                                                     )}
                                                                           </div>
                                                                      );
                                                                 }
                                                            )}
                                                            <div>
                                                                 {textButton.textButton !==
                                                                 "Edit" ? (
                                                                      <a
                                                                           className="text-xs cursor-pointer text-gray-400"
                                                                           onClick={(
                                                                                e
                                                                           ) =>
                                                                                addRowColumnName(
                                                                                     e
                                                                                )
                                                                           }
                                                                      >
                                                                           <span className="hover:underline hover:decoration-from-font">
                                                                                +
                                                                                Add
                                                                                Column
                                                                                Name
                                                                           </span>
                                                                      </a>
                                                                 ) : null}
                                                            </div>
                                                       </div>
                                                       <div>
                                                            {dataEditRateSetting?.rate_data_source?.map(
                                                                 (
                                                                      dataSource: any,
                                                                      z: number
                                                                 ) => {
                                                                      return (
                                                                           <div
                                                                                className="flex justify-center items-center"
                                                                                key={
                                                                                     z
                                                                                }
                                                                           >
                                                                                <TextInput
                                                                                     type="text"
                                                                                     value={
                                                                                          dataSource.RATE_DATA_SOURCE_NAME
                                                                                     }
                                                                                     className={`${
                                                                                          textButton.textButton !==
                                                                                          "Edit"
                                                                                               ? `bg-white mb-2`
                                                                                               : `bg-gray-300 mb-2`
                                                                                     }`}
                                                                                     onChange={(
                                                                                          e
                                                                                     ) => {
                                                                                          inputColumnSourceData(
                                                                                               "RATE_DATA_SOURCE_NAME",
                                                                                               e
                                                                                                    .target
                                                                                                    .value,
                                                                                               z
                                                                                          );
                                                                                     }}
                                                                                     disabled={
                                                                                          textButton.textButton ===
                                                                                          "Edit"
                                                                                               ? true
                                                                                               : false
                                                                                     }
                                                                                     required
                                                                                     placeholder="Data"
                                                                                />
                                                                                {dataEditRateSetting
                                                                                     .rate_data_source
                                                                                     .length !==
                                                                                     1 &&
                                                                                     textButton.textButton !==
                                                                                          "Edit" && (
                                                                                          <XMarkIcon
                                                                                               className="w-6 text-red-600 hover:cursor-pointer -mt-1"
                                                                                               onClick={() => {
                                                                                                    const updatedData =
                                                                                                         dataEditRateSetting.rate_data_source.filter(
                                                                                                              (
                                                                                                                   data: any,
                                                                                                                   a: number
                                                                                                              ) =>
                                                                                                                   a !==
                                                                                                                   z
                                                                                                         );
                                                                                                    setDataEditRateSetting(
                                                                                                         {
                                                                                                              ...dataEditRateSetting,
                                                                                                              rate_data_source:
                                                                                                                   updatedData,
                                                                                                         }
                                                                                                    );
                                                                                               }}
                                                                                          />
                                                                                     )}
                                                                           </div>
                                                                      );
                                                                 }
                                                            )}
                                                            <div>
                                                                 {textButton.textButton !==
                                                                 "Edit" ? (
                                                                      <a
                                                                           className="text-xs cursor-pointer text-gray-400"
                                                                           onClick={(
                                                                                e
                                                                           ) =>
                                                                                addRowColumnDataSource(
                                                                                     e
                                                                                )
                                                                           }
                                                                      >
                                                                           <span className="hover:underline hover:decoration-from-font">
                                                                                +
                                                                                Add
                                                                                Column
                                                                                Data
                                                                                Source
                                                                           </span>
                                                                      </a>
                                                                 ) : null}
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="flex gap-2">
                                                       <InputLabel
                                                            className=""
                                                            htmlFor="TIERING"
                                                            value={"Tiering "}
                                                            required={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? false
                                                                      : true
                                                            }
                                                       />
                                                       <div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                 <input
                                                                      type="checkbox"
                                                                      disabled={
                                                                           textButton.textButton ===
                                                                           "Edit"
                                                                                ? true
                                                                                : false
                                                                      }
                                                                      className="sr-only peer"
                                                                      checked={
                                                                           defaultTiering
                                                                      }
                                                                      onChange={(
                                                                           e: any
                                                                      ) => {
                                                                           handleCheck(
                                                                                e
                                                                           );
                                                                      }}
                                                                 />
                                                                 <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[var(--dynamic-color)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                                            </label>
                                                       </div>
                                                  </div>
                                                  {filterStatus1?.map(
                                                       (
                                                            dataRate: any,
                                                            a: number
                                                       ) => {
                                                            return (
                                                                 <div
                                                                      key={
                                                                           dataRate.TEMPLATE_RATE_ID
                                                                      }
                                                                      className="grid grid-cols-2"
                                                                 >
                                                                      <TextInput
                                                                           type="text"
                                                                           value={
                                                                                dataRate.TEMPLATE_RATE_COLUMN_NAME
                                                                           }
                                                                           className={`${
                                                                                textButton.textButton !==
                                                                                "Edit"
                                                                                     ? `bg-white mb-2`
                                                                                     : `bg-gray-300 mb-2`
                                                                           }`}
                                                                           onChange={(
                                                                                e
                                                                           ) => {
                                                                                inputColumnTemplateRate(
                                                                                     "TEMPLATE_RATE_COLUMN_NAME",
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                                     dataRate.TEMPLATE_RATE_ID
                                                                                );
                                                                           }}
                                                                           disabled={
                                                                                textButton.textButton ===
                                                                                "Edit"
                                                                                     ? true
                                                                                     : false
                                                                           }
                                                                           required
                                                                           placeholder="Rate"
                                                                      />
                                                                 </div>
                                                            );
                                                       }
                                                  )}
                                             </>
                                        )}
                                        {activeTab === "Upload" && (
                                             <>
                                                  <div
                                                       className="text-xs text-blue-600 hover:cursor-pointer hover:text-blue-400 hover:underline mb-2"
                                                       onClick={(e) => {
                                                            if (
                                                                 dataEditRateSetting?.document_template !==
                                                                 null
                                                                      ? handleFileDownloadRate(
                                                                             dataEditRateSetting.RATE_MANAGE_FIX_DOCUMENT_ID
                                                                        )
                                                                      : null
                                                            ) {
                                                            }
                                                       }}
                                                  >
                                                       {dataEditRateSetting?.document_template ===
                                                       null ? (
                                                            <>
                                                                 <span>
                                                                      Dokumen
                                                                      belum
                                                                      tersedia
                                                                 </span>
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <span>
                                                                      {
                                                                           dataEditRateSetting
                                                                                ?.document_template
                                                                                .DOCUMENT_FILENAME
                                                                      }
                                                                 </span>
                                                            </>
                                                       )}
                                                  </div>
                                                  <input
                                                       className={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? "bg-gray-300 text-black block w-full text-sm border bg-[var(--dynamic-color)] rounded-lg dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                                 : "block w-full text-sm text-gray-600 border bg-[var(--dynamic-color)] rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                       }
                                                       id="file_input"
                                                       type="file"
                                                       onChange={(e) => {
                                                            setDataEditRateSetting(
                                                                 {
                                                                      ...dataEditRateSetting,
                                                                      RATE_MANAGE_FIX_DOCUMENT_ID:
                                                                           e
                                                                                .target
                                                                                .files,
                                                                 }
                                                            );
                                                       }}
                                                       disabled={
                                                            textButton.textButton ===
                                                            "Edit"
                                                                 ? true
                                                                 : false
                                                       }
                                                  ></input>
                                             </>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </>
               ) : null}
               {/* end for NON REGULAR */}
          </>
     );
}
