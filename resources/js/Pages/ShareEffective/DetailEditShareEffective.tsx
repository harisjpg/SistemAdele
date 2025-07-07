import InputLabel from "@/Components/InputLabel";
import { PropsWithChildren } from "react";
import { CustomFlowbiteTheme, Datepicker } from "flowbite-react";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import TextInput from "@/Components/TextInput";

export default function DetailShareEffective({
     setDataEditShareEffective,
     dataEditShareEffective,
     insuranceType,
     insuranceList,
     dataRate,
     textButton,
}: PropsWithChildren<{
     setDataEditShareEffective: any;
     dataEditShareEffective: any;
     insuranceType: any;
     insuranceList: any;
     dataRate: any;
     textButton: any;
}>) {
     const editDateOfLossDatePickerStyle: CustomFlowbiteTheme["datepicker"] = {
          root: {
               //  base: "relative",
               input: {
                    field: {
                         icon: {
                              base: "absolute pl-3 p-3",
                         },
                    },
               },
          },
          popup: {
               root: {
                    base: "absolute top-10 z-50 block pt-2",
                    inline: "relative top-0 z-auto",
                    inner: "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700",
               },
               header: {
                    base: "",
                    title: "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
                    selectors: {
                         base: "mb-2 flex justify-between",
                         button: {
                              base: "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                              prev: "",
                              next: "",
                              view: "",
                         },
                    },
               },
               view: {
                    base: "p-5",
               },
               footer: {
                    base: "mt-2 flex space-x-2",
                    button: {
                         base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
                         today: "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
                         clear: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                    },
               },
          },
          views: {
               days: {
                    header: {
                         base: "mb-1 grid grid-cols-7",
                         title: "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
                    },
                    items: {
                         base: "grid w-64 grid-cols-7",
                         item: {
                              base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                              selected:
                                   "bg-cyan-700 text-white hover:bg-cyan-600",
                              disabled: "text-gray-500",
                         },
                    },
               },
               months: {
                    items: {
                         base: "grid w-64 grid-cols-4",
                         item: {
                              base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                              selected:
                                   "bg-cyan-700 text-white hover:bg-cyan-600",
                              disabled: "text-gray-500",
                         },
                    },
               },
               years: {
                    items: {
                         base: "grid w-64 grid-cols-4",
                         item: {
                              base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                              selected:
                                   "bg-cyan-700 text-white hover:bg-cyan-600",
                              disabled: "text-gray-500",
                         },
                    },
               },
               decades: {
                    items: {
                         base: "grid w-64 grid-cols-4",
                         item: {
                              base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                              selected:
                                   "bg-cyan-700 text-white hover:bg-cyan-600",
                              disabled: "text-gray-500",
                         },
                    },
               },
          },
     };

     const comboInsuranceType = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });

     const handleDateOfLossChange = (date: Date) => {
          setDataEditShareEffective({
               ...dataEditShareEffective,
               SHARE_EFFECTIVE_DATE: date.toLocaleDateString("en-CA"),
          });
     };

     const inputDataShare = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataEditShareEffective.bank_insurance];
          changeVal[i][name] = value;
          setDataEditShareEffective({
               ...dataEditShareEffective,
               bank_insurance: changeVal,
          });
     };

     const getTypeInsurance = (value: any) => {
          if (value) {
               const selected = comboInsuranceType.filter(
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

     return (
          <>
               <section>
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                              <InputLabel
                                   className=""
                                   value={"Effective From"}
                                   required={true}
                              />
                              <Datepicker
                                   theme={editDateOfLossDatePickerStyle}
                                   value={
                                        dataEditShareEffective.SHARE_EFFECTIVE_DATE
                                             ? dateFormat(
                                                    dataEditShareEffective.SHARE_EFFECTIVE_DATE,
                                                    "dd-mm-yyyy"
                                               )
                                             : "dd-mm-yyyy"
                                   }
                                   onSelectedDateChanged={
                                        handleDateOfLossChange
                                   }
                                   required
                                   disabled={
                                        textButton.textButton === "Edit"
                                             ? true
                                             : false
                                   }
                              />
                         </div>
                         <div>
                              <InputLabel
                                   className=""
                                   value={"Jenis Asuransi"}
                                   required={true}
                              />
                              <SelectTailwind
                                   classNames={{
                                        menuButton: () =>
                                             `flex pt-1 text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 h-[44px] ${
                                                  textButton.textButton !==
                                                  "Edit"
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
                                   options={comboInsuranceType}
                                   isSearchable={true}
                                   placeholder={"--Pilih Jenis Asuransi--"}
                                   value={{
                                        label: getTypeInsurance(
                                             dataEditShareEffective.JENIS_ASURANSI_ID
                                        ),
                                        value: dataEditShareEffective.JENIS_ASURANSI_ID,
                                   }}
                                   isDisabled={
                                        textButton.textButton === "Edit"
                                             ? true
                                             : false
                                   }
                                   onChange={(val: any) => {
                                        setDataEditShareEffective({
                                             ...dataEditShareEffective,
                                             JENIS_ASURANSI_ID: val.value,
                                        });
                                   }}
                                   primaryColor={"bg-primary-adele"}
                              />
                         </div>
                    </div>
                    <div className="grid grid-cols-1 mt-2 mb-2">
                         <InputLabel
                              className=""
                              value={"Share Configuration"}
                              required={false}
                         />
                    </div>
                    <table className="" border={0} width={"100%"}>
                         <thead className="bg-primary-adele text-white">
                              <tr className="">
                                   <th className="p-1 text-center">No</th>
                                   <th className="p-1">Insurance</th>
                                   <th className="p-1">Share %</th>
                                   <th className="p-1">Rate Reference</th>
                                   <th className="p-1">PIC</th>
                                   <th className="p-1">Contact</th>
                                   <th className="p-1">Email</th>
                                   <th className="p-1">Address</th>
                              </tr>
                         </thead>
                         <tbody>
                              {dataEditShareEffective?.bank_insurance?.map(
                                   (data: any, index: number) => {
                                        return (
                                             <tr key={index}>
                                                  <td
                                                       width={"1%"}
                                                       className="text-center"
                                                  >
                                                       {index + 1}
                                                  </td>
                                                  <td
                                                       width={"12%"}
                                                       className=""
                                                  >
                                                       {
                                                            data.insurance_list
                                                                 ?.INSURANCE_NAME
                                                       }
                                                  </td>
                                                  <td
                                                       width={"4%"}
                                                       className="p-1"
                                                  >
                                                       <TextInput
                                                            type="text"
                                                            className={`${
                                                                 textButton.textButton !==
                                                                 "Edit"
                                                                      ? `bg-white mt-1 ring-1`
                                                                      : `bg-gray-300 mt-1 ring-1`
                                                            }`}
                                                            placeholder="0"
                                                            value={
                                                                 data?.BANK_INSURANCE_SHARE
                                                                      ? data?.BANK_INSURANCE_SHARE
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataShare(
                                                                      "BANK_INSURANCE_SHARE",
                                                                      e.target
                                                                           .value,
                                                                      index
                                                                 );
                                                            }}
                                                            disabled={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? true
                                                                      : false
                                                            }
                                                       />
                                                  </td>
                                                  <td
                                                       width={"10%"}
                                                       className="p-1"
                                                  >
                                                       <select
                                                            className={`${
                                                                 textButton.textButton !==
                                                                 "Edit"
                                                                      ? `mt-1 block w-full rounded-md border-0 py-1.5 ring-1 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-white sm:text-sm sm:leading-6`
                                                                      : `mt-1 block w-full rounded-md border-0 py-1.5 ring-1 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-white sm:text-sm sm:leading-6 bg-gray-300`
                                                            }`}
                                                            value={
                                                                 data.RATE_MANAGE_ID
                                                                      ? data?.RATE_MANAGE_ID
                                                                      : ""
                                                            }
                                                            onChange={(e) => {
                                                                 inputDataShare(
                                                                      "RATE_MANAGE_ID",
                                                                      e.target
                                                                           .value,
                                                                      index
                                                                 );
                                                            }}
                                                            disabled={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? true
                                                                      : false
                                                            }
                                                       >
                                                            <option value="">
                                                                 --Select Rate--
                                                            </option>
                                                            {dataRate?.filter(
                                                                 (
                                                                      option: any,
                                                                      index: number
                                                                 ) =>
                                                                      option.insurance_rate[0]?.INSURANCE_ID?.toString() ===
                                                                      data.INSURANCE_ID.toString()
                                                            ).length === 0 ? (
                                                                 <option
                                                                      value={
                                                                           "null"
                                                                      }
                                                                 >
                                                                      {
                                                                           "No Data"
                                                                      }
                                                                 </option>
                                                            ) : (
                                                                 dataRate
                                                                      ?.filter(
                                                                           (
                                                                                option: any,
                                                                                index: number
                                                                           ) =>
                                                                                option.insurance_rate[0]?.INSURANCE_ID?.toString() ===
                                                                                data.INSURANCE_ID.toString()
                                                                      )
                                                                      ?.map(
                                                                           (
                                                                                dataMap: any,
                                                                                a: number
                                                                           ) => {
                                                                                return (
                                                                                     <option
                                                                                          key={
                                                                                               a
                                                                                          }
                                                                                          value={
                                                                                               dataMap.RATE_MANAGE_ID
                                                                                          }
                                                                                     >
                                                                                          {
                                                                                               dataMap.RATE_MANAGE_NAME
                                                                                          }
                                                                                     </option>
                                                                                );
                                                                           }
                                                                      )
                                                            )}
                                                       </select>
                                                  </td>
                                                  <td
                                                       width={"10%"}
                                                       className="p-1"
                                                  >
                                                       <TextInput
                                                            type="text"
                                                            className={`${
                                                                 textButton.textButton !==
                                                                 "Edit"
                                                                      ? `bg-white mt-1 ring-1`
                                                                      : `bg-gray-300 mt-1 ring-1`
                                                            }`}
                                                            placeholder="PIC Name"
                                                            value={
                                                                 data?.BANK_INSURANCE_PIC
                                                                      ? data?.BANK_INSURANCE_PIC
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataShare(
                                                                      "BANK_INSURANCE_PIC",
                                                                      e.target
                                                                           .value,
                                                                      index
                                                                 );
                                                            }}
                                                            disabled={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? true
                                                                      : false
                                                            }
                                                       />
                                                  </td>
                                                  <td
                                                       width={"10%"}
                                                       className="p-1"
                                                  >
                                                       <TextInput
                                                            type="number"
                                                            className={`${
                                                                 textButton.textButton !==
                                                                 "Edit"
                                                                      ? `bg-white mt-1 ring-1`
                                                                      : `bg-gray-300 mt-1 ring-1`
                                                            }`}
                                                            placeholder="Phone Number"
                                                            value={
                                                                 data?.BANK_INSURANCE_MSISDN
                                                                      ? data?.BANK_INSURANCE_MSISDN
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataShare(
                                                                      "BANK_INSURANCE_MSISDN",
                                                                      e.target
                                                                           .value,
                                                                      index
                                                                 );
                                                            }}
                                                            disabled={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? true
                                                                      : false
                                                            }
                                                       />
                                                  </td>
                                                  <td
                                                       width={"10%"}
                                                       className="p-1"
                                                  >
                                                       <TextInput
                                                            type="email"
                                                            className={`${
                                                                 textButton.textButton !==
                                                                 "Edit"
                                                                      ? `bg-white mt-1 ring-1`
                                                                      : `bg-gray-300 mt-1 ring-1`
                                                            }`}
                                                            placeholder="Email"
                                                            value={
                                                                 data?.BANK_INSURANCE_EMAIL
                                                                      ? data?.BANK_INSURANCE_EMAIL
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataShare(
                                                                      "BANK_INSURANCE_EMAIL",
                                                                      e.target
                                                                           .value,
                                                                      index
                                                                 );
                                                            }}
                                                            disabled={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? true
                                                                      : false
                                                            }
                                                       />
                                                  </td>
                                                  <td
                                                       width={"10%"}
                                                       className="p-1"
                                                  >
                                                       <TextInput
                                                            type="text"
                                                            className={`${
                                                                 textButton.textButton !==
                                                                 "Edit"
                                                                      ? `bg-white mt-1 ring-1`
                                                                      : `bg-gray-300 mt-1 ring-1`
                                                            }`}
                                                            placeholder="Address"
                                                            value={
                                                                 data?.BANK_INSURANCE_ADDRESS
                                                                      ? data?.BANK_INSURANCE_ADDRESS
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataShare(
                                                                      "BANK_INSURANCE_ADDRESS",
                                                                      e.target
                                                                           .value,
                                                                      index
                                                                 );
                                                            }}
                                                            disabled={
                                                                 textButton.textButton ===
                                                                 "Edit"
                                                                      ? true
                                                                      : false
                                                            }
                                                       />
                                                  </td>
                                             </tr>
                                        );
                                   }
                              )}
                         </tbody>
                    </table>
               </section>
          </>
     );
}
