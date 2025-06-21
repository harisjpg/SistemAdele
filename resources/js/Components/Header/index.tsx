import DropdownUser from "./DropdownUser";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { User } from "@/types";
import { BellIcon } from "@heroicons/react/20/solid";
import ImageDropdown from "../ImageDropdown";
import { FormEvent } from "react";
import indonesiaFlag from "../../Images/indonesia.png";
import usFlag from "../../Images/united-states.png";
import { router, usePage } from "@inertiajs/react";
import ButtonPlugin from "../ButtonPlugin/ButtonPlugin";
import CalculatorPremi from "./CalculatorPremi";
// import { MyProvider } from "@/Utility/GlobalContext";

const Header = (props: {
     sidebarOpen: string | boolean | undefined;
     setSidebarOpen: (arg0: boolean) => void;
     sidebarDesktopOpen: string | boolean | undefined;
     setSidebarDesktopOpen: (arg0: boolean) => void;
     user: any;
     header: string;
     children: any;
}) => {
     const { auth, colorSetting }: any = usePage().props;
     const handleOpenSidebar = () => {
          if (!props.sidebarDesktopOpen) {
               props.setSidebarDesktopOpen(true);
          } else {
               props.setSidebarDesktopOpen(false);
          }
     };

     if (colorSetting.SETTING_PAGE_COLOR === null) {
          document.documentElement.style.setProperty(
               "--dynamic-color",
               colorSetting.SETTING_PAGE_COLOR
          ); // Ubah menjadi warna tomat
     }

     function changeLanguage(e: FormEvent, lang: string) {
          e.preventDefault();

          router.post("/user_additional/change_language", {
               lang: lang,
               user_id: props.user?.id,
          });
     }

     const languages = [
          {
               value: "en",
               label: "English",
               flag: usFlag,
          },
          {
               value: "id",
               label: "Indonesia",
               flag: indonesiaFlag,
          },
     ];

     return (
          <div className={`${props.sidebarDesktopOpen ? "" : "lg:pl-72"}`}>
               <div className="  sticky z-9 top-0 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    {/* check resolution */}
                    {window.innerWidth < 1024 ? (
                         <button
                              type="button"
                              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                              onClick={() => props.setSidebarOpen(true)}
                         >
                              <span className="sr-only">Open sidebar</span>
                              <Bars3Icon
                                   className="h-6 w-6"
                                   aria-hidden="true"
                              />
                         </button>
                    ) : (
                         <button
                              type="button"
                              className="-m-2.5 p-2.5 text-gray-700 invisible lg:visible"
                              onClick={handleOpenSidebar}
                         >
                              <span className="sr-only">Open sidebar</span>
                              <Bars3Icon
                                   className="h-6 w-6"
                                   aria-hidden="true"
                              />
                         </button>
                    )}

                    {/* Separator */}
                    <div
                         className="h-6 w-px bg-gray-900/10 lg:hidden"
                         aria-hidden="true"
                    />

                    <div className="flex flex-1 gap-x-4 self-center lg:gap-x-6">
                         <Breadcrumb pageName={props.header} />
                    </div>

                    {/* <ImageDropdown
                         image={
                              <img
                                   src={
                                        props.user?.additional.user_language ===
                                        "en"
                                             ? usFlag
                                             : indonesiaFlag
                                   }
                                   width="25"
                              />
                         }
                         children={
                              <>
                                   {languages.map(
                                        (language: any, i: number) => {
                                             return (
                                                  <div
                                                       key={i}
                                                       className={`
                              px-4 py-2 grid grid-rows grid-flow-col gap-4 hover:bg-gray-200 hover:cursor-pointer
                              ${
                                   props.user?.additional.user_language ===
                                   language.value
                                        ? "bg-gray-200"
                                        : ""
                              }
                          `}
                                                       onClick={(e) =>
                                                            changeLanguage(
                                                                 e,
                                                                 language.value
                                                            )
                                                       }
                                                  >
                                                       <img
                                                            src={language.flag}
                                                            width="25"
                                                       />
                                                       <p>{language.label}</p>
                                                  </div>
                                             );
                                        }
                                   )}
                              </>
                         }
                    /> */}

                    <div className="flex items-center gap-3 2xsm:gap-7">
                         {/* Calculator Premi */}
                         <CalculatorPremi />
                         {/* Calculator Premi */}
                         <button
                              type="button"
                              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                         >
                              <span className="sr-only">
                                   View notifications
                              </span>
                              <BellIcon
                                   className="h-6 w-6"
                                   aria-hidden="true"
                              />
                         </button>
                         <div
                              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                              aria-hidden="true"
                         />

                         {/* <!-- User Area --> */}
                         <DropdownUser />
                         {/* <!-- User Area --> */}
                    </div>
               </div>
               {/* <MyProvider> */}
               <main>
                    <div
                         className="px-4 sm:px-6 lg:px-8 py-5 modal-action-container"
                         id="bodyAll"
                    >
                         {/* {auth.user.user_type_id === 1 ||
                         auth.user.user_type_id === "1" ? (
                              <ButtonPlugin />
                         ) : null} */}
                         {props.children}
                    </div>
               </main>
               {/* </MyProvider> */}
               <div className="relative bottom-0 z-40 h-10 flex shrink-0 items-center justify-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <p className="text-xs">
                         Copyright &copy; PT. Killian Teknologi Indonesia
                    </p>
               </div>
          </div>
     );
};

export default Header;
