import { XCircleIcon } from "@heroicons/react/20/solid";
import { PropsWithChildren } from "react";
import { CustomFlowbiteTheme, Datepicker } from "flowbite-react";
import dateFormat from "dateformat";

export default function DatePickerFlowBite({
     value,
     onSelectedDateChanged = () => {},
     className = "",
     disabled,
}: PropsWithChildren<{
     value: any;
     onSelectedDateChanged: any;
     className: any;
     disabled?: any;
}>) {
     const editDateOfLossDatePickerStyle: CustomFlowbiteTheme["datepicker"] = {
          root: {
               //  base: "relative",
               input: {
                    field: {
                         icon: {
                              base: "absolute pl-2 p-2",
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
     return (
          <Datepicker
               theme={editDateOfLossDatePickerStyle}
               style={{
                    height: "2.2rem",
               }}
               value={value}
               onSelectedDateChanged={onSelectedDateChanged}
               required
               className={className}
               disabled={disabled}
          />
     );
}
