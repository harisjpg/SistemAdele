import InputLabel from "@/Components/InputLabel";
import { PropsWithChildren } from "react";
import { CustomFlowbiteTheme, Datepicker } from "flowbite-react";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import TextInput from "@/Components/TextInput";

export default function AddShareEffective({
     setDataShareEffective,
     dataShareEffective,
     insuranceType,
     insuranceList,
     dataRate,
}: PropsWithChildren<{
     setDataShareEffective: any;
     dataShareEffective: any;
     insuranceType: any;
     insuranceList: any;
     dataRate: any;
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
          setDataShareEffective({
               ...dataShareEffective,
               SHARE_EFFECTIVE_DATE: date.toLocaleDateString("en-CA"),
          });
     };

     const inputDataShare = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataShareEffective.bank_insurance];
          changeVal[i][name] = value;
          setDataShareEffective({
               ...dataShareEffective,
               bank_insurance: changeVal,
          });
     };

     return (
          <>
               <section>
                    <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-2">
                         <div>
                              <InputLabel
                                   className=""
                                   value={"Effective From"}
                                   required={true}
                              />
                              <Datepicker
                                   theme={editDateOfLossDatePickerStyle}
                                   value={
                                        dataShareEffective.SHARE_EFFECTIVE_DATE
                                             ? dateFormat(
                                                    dataShareEffective.SHARE_EFFECTIVE_DATE,
                                                    "dd-mm-yyyy"
                                               )
                                             : "dd-mm-yyyy"
                                   }
                                   onSelectedDateChanged={
                                        handleDateOfLossChange
                                   }
                                   required
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
                                             `flex pt-1 text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 h-[44px]`,
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
                                   value={dataShareEffective.JENIS_ASURANSI_ID}
                                   onChange={(e) => {
                                        setDataShareEffective({
                                             ...dataShareEffective,
                                             JENIS_ASURANSI_ID: e,
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
                    <div className="overflow-x-auto">
                         <table className="min-w-full" border={0}>
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
                                   {dataShareEffective?.bank_insurance?.map(
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
                                                                 data.INSURANCE_NAME
                                                            }
                                                       </td>
                                                       <td
                                                            width={"4%"}
                                                            className="p-1"
                                                       >
                                                            <TextInput
                                                                 type="text"
                                                                 className="mt-1 ring-1"
                                                                 placeholder="0"
                                                                 value={
                                                                      data.SHARE
                                                                           ? data?.SHARE
                                                                           : ""
                                                                 }
                                                                 onChange={(
                                                                      e: any
                                                                 ) => {
                                                                      inputDataShare(
                                                                           "SHARE",
                                                                           e
                                                                                .target
                                                                                .value,
                                                                           index
                                                                      );
                                                                 }}
                                                            />
                                                       </td>
                                                       <td
                                                            width={"10%"}
                                                            className="p-1"
                                                       >
                                                            <select
                                                                 className="mt-1 block w-full rounded-md border-0 py-1.5 ring-1 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-white sm:text-sm sm:leading-6"
                                                                 value={
                                                                      data.RATE_MANAGE_ID
                                                                           ? data?.RATE_MANAGE_ID
                                                                           : ""
                                                                 }
                                                                 onChange={(
                                                                      e
                                                                 ) => {
                                                                      inputDataShare(
                                                                           "RATE_MANAGE_ID",
                                                                           e
                                                                                .target
                                                                                .value,
                                                                           index
                                                                      );
                                                                 }}
                                                                 required={
                                                                      data.hasOwnProperty(
                                                                           "SHARE"
                                                                      )
                                                                           ? true
                                                                           : false
                                                                 }
                                                            >
                                                                 <option value="">
                                                                      --Select
                                                                      Rate--
                                                                 </option>
                                                                 {dataRate?.filter(
                                                                      (
                                                                           option: any,
                                                                           index: number
                                                                      ) =>
                                                                           option.insurance_rate[0]?.INSURANCE_ID?.toString() ===
                                                                           data.INSURANCE_ID.toString()
                                                                 ).length ===
                                                                 0 ? (
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
                                                                 className="mt-1 ring-1"
                                                                 placeholder="PIC Name"
                                                                 value={
                                                                      data?.PIC_NAME
                                                                 }
                                                                 onChange={(
                                                                      e: any
                                                                 ) => {
                                                                      inputDataShare(
                                                                           "PIC_NAME",
                                                                           e
                                                                                .target
                                                                                .value,
                                                                           index
                                                                      );
                                                                 }}
                                                            />
                                                       </td>
                                                       <td
                                                            width={"10%"}
                                                            className="p-1"
                                                       >
                                                            <TextInput
                                                                 type="number"
                                                                 className="mt-1 ring-1"
                                                                 placeholder="Phone Number"
                                                                 value={
                                                                      data?.PHONE_NUMBER
                                                                 }
                                                                 onChange={(
                                                                      e: any
                                                                 ) => {
                                                                      inputDataShare(
                                                                           "PHONE_NUMBER",
                                                                           e
                                                                                .target
                                                                                .value,
                                                                           index
                                                                      );
                                                                 }}
                                                            />
                                                       </td>
                                                       <td
                                                            width={"10%"}
                                                            className="p-1"
                                                       >
                                                            <TextInput
                                                                 type="email"
                                                                 className="mt-1 ring-1"
                                                                 placeholder="Email"
                                                                 value={
                                                                      data?.EMAIL
                                                                 }
                                                                 onChange={(
                                                                      e: any
                                                                 ) => {
                                                                      inputDataShare(
                                                                           "EMAIL",
                                                                           e
                                                                                .target
                                                                                .value,
                                                                           index
                                                                      );
                                                                 }}
                                                            />
                                                       </td>
                                                       <td
                                                            width={"10%"}
                                                            className="p-1"
                                                       >
                                                            <TextInput
                                                                 type="text"
                                                                 className="mt-1 ring-1"
                                                                 placeholder="Address"
                                                                 value={
                                                                      data?.ADDRESS
                                                                 }
                                                                 onChange={(
                                                                      e: any
                                                                 ) => {
                                                                      inputDataShare(
                                                                           "ADDRESS",
                                                                           e
                                                                                .target
                                                                                .value,
                                                                           index
                                                                      );
                                                                 }}
                                                            />
                                                       </td>
                                                  </tr>
                                             );
                                        }
                                   )}
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     );
}
