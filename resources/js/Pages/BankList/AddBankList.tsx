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

export default function AddBankList({
     setDataBank,
     dataBank,
}: PropsWithChildren<{ setDataBank: any; dataBank: any }>) {
     return (
          <>
               {/* for Bank Name */}
               <InputLabel
                    className=""
                    htmlFor="BANK_LIST_NAME"
                    value={"Bank Name"}
                    required={true}
               />
               <TextInput
                    type="text"
                    name="BANK_LIST_NAME"
                    value={dataBank.BANK_LIST_NAME}
                    className="ring-1"
                    onChange={(e) => {
                         setDataBank({
                              ...dataBank,
                              BANK_LIST_NAME: e.target.value,
                         });
                    }}
                    required
                    autoComplete="off"
                    placeholder="Bank Name"
               />
               {/* for Bank Fee */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_LIST_FEE_BASE_BANK"
                    value={"Fee Base Bank (% of Premium)"}
                    required={false}
               />
               <CurrencyInput
                    value={dataBank.BANK_LIST_FEE_BASE_BANK}
                    decimalScale={2}
                    decimalsLimit={2}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-right`}
                    onValueChange={(e: any) => {
                         setDataBank({
                              ...dataBank,
                              BANK_LIST_FEE_BASE_BANK: e,
                         });
                    }}
                    placeholder="0.00"
                    autoComplete="off"
                    disabled={false}
               />
               {/* for Bank Logo */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_LIST_LOGO"
                    value={"Upload Logo"}
                    required={true}
               />
               <input
                    className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                    required
                    onChange={(e) => {
                         setDataBank({
                              ...dataBank,
                              BANK_LIST_LOGO: e.target.files,
                         });
                    }}
               ></input>
          </>
     );
}
