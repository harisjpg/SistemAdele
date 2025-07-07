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

export default function DetailEditBankList({
     textButton,
     dataEditBank,
     setDataEditBank,
}: PropsWithChildren<{
     textButton: any;
     dataEditBank: any;
     setDataEditBank: any;
}>) {
     return (
          <>
               {/* for Bank Name */}
               <InputLabel
                    className=""
                    htmlFor="BANK_LIST_NAME"
                    value={"Bank Name"}
                    required={textButton.textButton === "Edit" ? false : true}
               />
               <TextInput
                    type="text"
                    name="BANK_LIST_NAME"
                    value={dataEditBank.BANK_LIST_NAME}
                    className={
                         textButton.textButton === "Edit"
                              ? "bg-gray-300 text-black ring-1"
                              : "ring-1"
                    }
                    onChange={(e) => {
                         setDataEditBank({
                              ...dataEditBank,
                              BANK_LIST_NAME: e.target.value,
                         });
                    }}
                    disabled={textButton.textButton === "Edit" ? true : false}
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
                    value={dataEditBank.BANK_LIST_FEE_BASE_BANK}
                    decimalScale={2}
                    decimalsLimit={2}
                    className={
                         textButton.textButton === "Edit"
                              ? "bg-gray-300 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-right"
                              : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-right"
                    }
                    onValueChange={(e: any) => {
                         setDataEditBank({
                              ...dataEditBank,
                              BANK_LIST_FEE_BASE_BANK: e,
                         });
                    }}
                    placeholder="0.00"
                    autoComplete="off"
                    disabled={textButton.textButton === "Edit" ? true : false}
               />
               {/* for Bank Logo */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_LIST_LOGO"
                    value={"Upload Logo"}
                    // required={textButton.textButton === "Edit" ? false : true}
               />
               <input
                    className={
                         textButton.textButton === "Edit"
                              ? "bg-gray-300 text-black block w-full text-sm border bg-primary-adele rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                              : "block w-full text-sm text-gray-600 border bg-primary-adele rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                    }
                    id="file_input"
                    type="file"
                    onChange={(e) => {
                         setDataEditBank({
                              ...dataEditBank,
                              BANK_LIST_LOGO: e.target.files,
                         });
                    }}
                    disabled={textButton.textButton === "Edit" ? true : false}
               ></input>
          </>
     );
}
