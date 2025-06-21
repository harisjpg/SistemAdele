import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import axios from "axios";
import {
     FormEvent,
     PropsWithChildren,
     useEffect,
     useRef,
     useState,
} from "react";
import SelectTailwind from "react-tailwindcss-select";

export default function AddBankBranch({
     setDataBankBranch,
     dataBankBranch,
}: PropsWithChildren<{ setDataBankBranch: any; dataBankBranch: any }>) {
     // dijalankan saat buka add modal branch
     useEffect(() => {
          getComboParentBranch();
          getKanwil();
     }, []);

     // for result combo parent branch
     const [resultComboBranch, setResultComboBranch] = useState<any>([]);
     // for get parent branch
     const getComboParentBranch = async () => {
          await axios
               .post(`/getComboParentBranch`, {})
               .then((res) => {
                    setResultComboBranch(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     // for result combo parent branch
     const [resultKanwil, setResultKanwil] = useState<any>([]);
     // for get parent branch
     const getKanwil = async () => {
          await axios
               .post(`/getKanwil`, {})
               .then((res) => {
                    setResultKanwil(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const comboParentBranch = resultComboBranch?.map((query: any) => {
          return {
               value: query.BANK_BRANCH_ID,
               label: query.text_combo,
          };
     });

     const selectKanwil = resultKanwil?.map((query: any) => {
          return {
               value: query.kanwil_id,
               label: query.kanwil_name,
          };
     });
     return (
          <>
               {/* for parent Branch */}
               <InputLabel
                    className=""
                    htmlFor="BANK_BRANCH_PARENT_ID"
                    value={"Bank Branch Parent"}
                    required={true}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-[var(--dynamic-color)]`
                                        : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                              }`,
                    }}
                    options={comboParentBranch}
                    isSearchable={true}
                    placeholder={"--Choose Parent--"}
                    value={dataBankBranch.BANK_BRANCH_PARENT_ID}
                    onChange={(e) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_PARENT_ID: e,
                         });
                    }}
                    primaryColor={"bg-[var(--dynamic-color)]"}
               />

               {/* for kanwil */}
               <InputLabel
                    className=""
                    htmlFor="BANK_BRANCH_KANWIL"
                    value={"Bank Branch Kanwil"}
                    required={true}
               />
               <SelectTailwind
                    classNames={{
                         menuButton: () =>
                              `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                         menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                         listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                   isSelected
                                        ? `text-white bg-[var(--dynamic-color)]`
                                        : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                              }`,
                    }}
                    options={selectKanwil}
                    isSearchable={true}
                    placeholder={"--Choose Kanwil--"}
                    value={dataBankBranch.BANK_BRANCH_KANWIL}
                    onChange={(e) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_KANWIL: e,
                         });
                    }}
                    primaryColor={"bg-[var(--dynamic-color)]"}
               />

               {/* for Branch Name */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_BRANCH_NAME"
                    value={"Bank Branch Name"}
                    required={true}
               />
               <TextInput
                    type="text"
                    name="BANK_BRANCH_NAME"
                    value={dataBankBranch.BANK_BRANCH_NAME}
                    className="ring-1"
                    onChange={(e) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_NAME: e.target.value,
                         });
                    }}
                    required
                    autoComplete="off"
                    placeholder="Bank Branch Name"
               />

               {/* for Branch Name */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_BRANCH_NAME_AO"
                    value={"Bank Branch Name AO"}
                    required={true}
               />
               <TextInput
                    type="text"
                    name="BANK_BRANCH_NAME_AO"
                    value={dataBankBranch.BANK_BRANCH_NAME_AO}
                    className="ring-1"
                    onChange={(e) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_NAME_AO: e.target.value,
                         });
                    }}
                    required
                    autoComplete="off"
                    placeholder="Bank Branch Name AO"
               />

               {/* for Branch Code */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_BRANCH_CODE"
                    value={"Bank Branch Code"}
                    required={true}
               />
               <TextInput
                    type="text"
                    name="BANK_BRANCH_CODE"
                    value={dataBankBranch.BANK_BRANCH_CODE}
                    className="ring-1"
                    onChange={(e) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_CODE: e.target.value,
                         });
                    }}
                    required
                    autoComplete="off"
                    placeholder="Bank Branch Code"
               />

               {/* for Branch Phone Number */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_BRANCH_PHONENUMBER"
                    value={"Bank Branch Phone"}
                    required={false}
               />
               <TextInput
                    type="text"
                    name="BANK_BRANCH_PHONENUMBER"
                    value={dataBankBranch.BANK_BRANCH_PHONENUMBER}
                    className="ring-1"
                    onChange={(e) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_PHONENUMBER: e.target.value,
                         });
                    }}
                    autoComplete="off"
                    placeholder="Bank Branch Phone"
               />

               {/* for Branch Address */}
               <InputLabel
                    className="mt-2"
                    htmlFor="BANK_BRANCH_ADDRESS"
                    value={"Bank Branch Address"}
                    required={false}
               />
               <TextArea
                    className="mb-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md ring-1 sm:text-sm sm:leading-6"
                    value={dataBankBranch.BANK_BRANCH_ADDRESS}
                    onChange={(e: any) => {
                         setDataBankBranch({
                              ...dataBankBranch,
                              BANK_BRANCH_ADDRESS: e.target.value,
                         });
                    }}
               />
          </>
     );
}
