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
import { HomeIcon } from "@heroicons/react/20/solid";
import { url } from "inspector";

export default function Breadcrumbs({
     forBreadcrumbs,
}: PropsWithChildren<{ forBreadcrumbs: any }>) {
     return (
          <>
               <nav aria-label="Breadcrumb" className="flex text-xs">
                    <ol role="list" className="flex items-center space-x-4">
                         <li>
                              <div>
                                   <a
                                        href={route(`dashboard`)}
                                        className="text-gray-400 hover:text-gray-500"
                                   >
                                        <span className="">Dashboard</span>
                                   </a>
                              </div>
                         </li>
                         {forBreadcrumbs.map((page: any) => (
                              <li key={page.name}>
                                   <div className="flex items-center ">
                                        <svg
                                             fill="currentColor"
                                             viewBox="0 0 20 20"
                                             aria-hidden="true"
                                             className="size-5 shrink-0 text-gray-300"
                                        >
                                             <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                        </svg>
                                        <a
                                             href={page.href}
                                             aria-current={
                                                  page.current
                                                       ? "page"
                                                       : undefined
                                             }
                                             className="ml-4 text-xs font-medium text-gray-500 hover:text-gray-700"
                                        >
                                             {page.name}
                                        </a>
                                   </div>
                              </li>
                         ))}
                    </ol>
               </nav>
          </>
     );
}
