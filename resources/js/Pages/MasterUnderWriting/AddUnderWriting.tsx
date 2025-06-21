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

export default function AddUnderWriting({
     setDataUnderWriting,
     dataUnderWriting,
}: PropsWithChildren<{ setDataUnderWriting: any; dataUnderWriting: any }>) {
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
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="UNDERWRITING_NAME"
                                                  value={
                                                       dataUnderWriting?.UNDERWRITING_NAME
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataUnderWriting({
                                                            ...dataUnderWriting,
                                                            UNDERWRITING_NAME:
                                                                 e.target.value,
                                                       });
                                                  }}
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
