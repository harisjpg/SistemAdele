import React, {
     FormEvent,
     PropsWithChildren,
     useEffect,
     Fragment,
     useState,
} from "react";
import iconGrid from "@/Images/grid-icon.svg";
import {
     ArrowLeftIcon,
     ArrowUpIcon,
     BellAlertIcon,
     ChatBubbleLeftRightIcon,
     ClockIcon,
     Cog6ToothIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import PrimaryButton from "../Button/PrimaryButton";

export default function ButtonPlugin({}: PropsWithChildren<{}>) {
     const { auth }: any = usePage().props;
     const [setHover, setDataHover] = useState<boolean>(false);
     const [isProcessing, setIsProcessing] = useState<boolean>(false);

     const [dataHeksa, setDataHeksa] = useState<any>({
          SETTING_PAGE_COLOR: "",
     });

     const actionSettingColor = async (e: any) => {
          const url = "/settingColor";
          // return false;
          e.preventDefault();
          await axios
               .post(url, dataHeksa, {
                    headers: {
                         "Content-type": "multipart/form-data",
                    },
               })
               .then((res) => {
                    setIsProcessing(false);
                    window.location.reload();
                    // handleSuccessMessage(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     return (
          <>
               {setHover ? (
                    <div
                         className={` fixed right-0 z-9`}
                         onMouseLeave={() => setDataHover(false)}
                    >
                         <div className="bg-white rounded-tl-md rounded-bl-md w-72 h-96 z-9 p-2 shadow-md ring-1 ring-emerald-600 ease-out duration-500 transition-all">
                              <div className="">
                                   <form onSubmit={actionSettingColor}>
                                        <div className="font-semibold text-sm rounded-md bg-blue-500 p-2 text-white">
                                             <span>Color Setting</span>
                                        </div>
                                        <InputLabel
                                             className="mt-2 text-xs ml-1"
                                             htmlFor="kode_heksa"
                                             value={"Kode Heksa"}
                                        />
                                        <TextInput
                                             type="text"
                                             name="kode_heksa"
                                             value={
                                                  dataHeksa.SETTING_PAGE_COLOR
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataHeksa({
                                                       ...dataHeksa,
                                                       SETTING_PAGE_COLOR:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder="#000000"
                                        />
                                        <div className="flex justify-end mt-2">
                                             <div className="text-xs bg-primary-adele w-fit">
                                                  <PrimaryButton
                                                       className="text-xs"
                                                       disabled={isProcessing}
                                                  >
                                                       Simpan
                                                  </PrimaryButton>
                                             </div>
                                        </div>
                                   </form>
                              </div>
                         </div>
                    </div>
               ) : (
                    <div
                         className={` fixed right-0 z-999999`}
                         onMouseEnter={() => setDataHover(true)}
                    >
                         <div className="bg-white rounded-tl-md rounded-bl-md w-7 h-10 z-999999 flex justify-center items-center hover:cursor-pointer shadow-md ring-1 ring-emerald-600 ease-in duration-300 transition-all">
                              <div className="">
                                   <Cog6ToothIcon className="w-5 fill-black" />
                              </div>
                         </div>
                    </div>
               )}
          </>
     );
}
