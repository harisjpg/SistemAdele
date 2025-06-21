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

export default function DetailEditUnderWriting({
     textButton,
     setDataEditUnderWriting,
     dataEditUnderWriting,
}: PropsWithChildren<{
     textButton: any;
     setDataEditUnderWriting: any;
     dataEditUnderWriting: any;
}>) {
     return (
          <>
               <section>
                    <div>
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-medium">
                                   Data Under Writing
                              </legend>
                              <div className="px-4 py-2">
                                   <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-4">
                                        <div>
                                             <InputLabel
                                                  className=""
                                                  value={"Nama Under Writing"}
                                                  required={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? false
                                                            : true
                                                  }
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="UNDERWRITING_NAME"
                                                  value={
                                                       dataEditUnderWriting?.UNDERWRITING_NAME
                                                  }
                                                  className={
                                                       textButton.textButton ===
                                                       "Edit"
                                                            ? "bg-gray-300 text-black ring-1"
                                                            : "ring-1"
                                                  }
                                                  onChange={(e) => {
                                                       setDataEditUnderWriting({
                                                            ...dataEditUnderWriting,
                                                            UNDERWRITING_NAME:
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
                                                  placeholder="Nama Under Writing"
                                             />
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                    </div>
               </section>
          </>
     );
}
