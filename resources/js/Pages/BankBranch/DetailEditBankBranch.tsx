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
import CurrencyInput from "react-currency-input-field";
import SelectTailwind from "react-tailwindcss-select";

export default function DetailEditBankBranch({
     textButton,
     dataEditDetailBankBranch,
     setDataEditDetailBankBranch,
}: PropsWithChildren<{
     textButton: any;
     dataEditDetailBankBranch: any;
     setDataEditDetailBankBranch: any;
}>) {
     // dijalankan saat buka add modal branch
     useEffect(() => {
          getComboParentBranch();
          getKanwil();
     }, []);

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

     const getKanwilSelect = (value: any) => {
          if (value) {
               const selected = selectKanwil.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               if (selected.length === 0) {
                    return "";
               } else {
                    return selected[0].label;
               }
          }
     };

     const getParentSelect = (value: any) => {
          if (value) {
               const selected = comboParentBranch.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               if (selected.length === 0) {
                    return "";
               } else {
                    return selected[0].label;
               }
          }
     };
     return (
          <>
               <>
                    {/* for parent Branch */}
                    <InputLabel
                         className=""
                         htmlFor="BANK_BRANCH_PARENT_ID"
                         value={"Bank Branch Parent"}
                         required={
                              textButton.textButton === "Edit" ? false : true
                         }
                    />
                    <SelectTailwind
                         classNames={{
                              menuButton: () =>
                                   `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                        textButton.textButton !== "Edit"
                                             ? `bg-white`
                                             : `bg-gray-300`
                                   }`,
                              menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                              listItem: ({ isSelected }: any) =>
                                   `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                             ? `text-white bg-primary-adele`
                                             : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                   }`,
                         }}
                         options={comboParentBranch}
                         isSearchable={true}
                         placeholder={"--Choose Parent--"}
                         value={{
                              label: getParentSelect(
                                   dataEditDetailBankBranch.BANK_BRANCH_PARENT_ID
                              ),
                              value: dataEditDetailBankBranch.BANK_BRANCH_PARENT_ID,
                         }}
                         isDisabled={
                              textButton.textButton === "Edit" ? true : false
                         }
                         onChange={(val: any) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   BANK_BRANCH_PARENT_ID: val.value,
                              });
                         }}
                         primaryColor={"bg-primary-adele"}
                    />

                    {/* for kanwil */}
                    <InputLabel
                         className=""
                         htmlFor="BANK_BRANCH_KANWIL"
                         value={"Bank Branch Kanwil"}
                         required={
                              textButton.textButton === "Edit" ? false : true
                         }
                    />
                    <SelectTailwind
                         classNames={{
                              menuButton: () =>
                                   `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none hover:border-gray-400 ${
                                        textButton.textButton !== "Edit"
                                             ? `bg-white`
                                             : `bg-gray-300`
                                   }`,
                              menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                              listItem: ({ isSelected }: any) =>
                                   `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                        isSelected
                                             ? `text-white bg-primary-adele`
                                             : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                   }`,
                         }}
                         options={selectKanwil}
                         isSearchable={true}
                         placeholder={"--Choose Kanwil--"}
                         value={{
                              label: getKanwilSelect(
                                   dataEditDetailBankBranch.KANWIL_ID
                              ),
                              value: dataEditDetailBankBranch.KANWIL_ID,
                         }}
                         isDisabled={
                              textButton.textButton === "Edit" ? true : false
                         }
                         onChange={(val: any) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   KANWIL_ID: val.value,
                              });
                         }}
                         primaryColor={"bg-primary-adele"}
                    />

                    {/* for Branch Name */}
                    <InputLabel
                         className="mt-2"
                         htmlFor="BANK_BRANCH_NAME"
                         value={"Bank Branch Name"}
                         required={
                              textButton.textButton === "Edit" ? false : true
                         }
                    />
                    <TextInput
                         type="text"
                         name="BANK_BRANCH_NAME"
                         value={dataEditDetailBankBranch.BANK_BRANCH_NAME}
                         className={
                              textButton.textButton === "Edit"
                                   ? "bg-gray-300 text-black ring-1"
                                   : "ring-1"
                         }
                         onChange={(e) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   BANK_BRANCH_NAME: e.target.value,
                              });
                         }}
                         disabled={
                              textButton.textButton === "Edit" ? true : false
                         }
                         required
                         autoComplete="off"
                         placeholder="Bank Branch Name"
                    />

                    {/* for Branch Name AO */}
                    <InputLabel
                         className="mt-2"
                         htmlFor="BANK_BRANCH_NAME_AO"
                         value={"Bank Branch Name AO"}
                         required={
                              textButton.textButton === "Edit" ? false : true
                         }
                    />
                    <TextInput
                         type="text"
                         name="BANK_BRANCH_NAME_AO"
                         value={
                              dataEditDetailBankBranch.BANK_BRANCH_NAME_AO ===
                              null
                                   ? ""
                                   : dataEditDetailBankBranch.BANK_BRANCH_NAME_AO
                         }
                         className={
                              textButton.textButton === "Edit"
                                   ? "bg-gray-300 text-black ring-1"
                                   : "ring-1"
                         }
                         onChange={(e) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   BANK_BRANCH_NAME_AO: e.target.value,
                              });
                         }}
                         disabled={
                              textButton.textButton === "Edit" ? true : false
                         }
                         required
                         autoComplete="off"
                         placeholder="Bank Branch Name AO"
                    />

                    {/* for Branch Code */}
                    <InputLabel
                         className="mt-2"
                         htmlFor="BANK_BRANCH_CODE"
                         value={"Bank Branch Code"}
                         required={
                              textButton.textButton === "Edit" ? false : true
                         }
                    />
                    <TextInput
                         type="text"
                         name="BANK_BRANCH_CODE"
                         value={dataEditDetailBankBranch.BANK_BRANCH_CODE}
                         className={
                              textButton.textButton === "Edit"
                                   ? "bg-gray-300 text-black ring-1"
                                   : "ring-1"
                         }
                         onChange={(e) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   BANK_BRANCH_CODE: e.target.value,
                              });
                         }}
                         required
                         autoComplete="off"
                         placeholder="Bank Branch Code"
                         disabled={
                              textButton.textButton === "Edit" ? true : false
                         }
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
                         value={
                              dataEditDetailBankBranch.BANK_BRANCH_PHONENUMBER ===
                              null
                                   ? ""
                                   : dataEditDetailBankBranch.BANK_BRANCH_PHONENUMBER
                         }
                         className={
                              textButton.textButton === "Edit"
                                   ? "bg-gray-300 text-black ring-1"
                                   : "ring-1"
                         }
                         onChange={(e) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   BANK_BRANCH_PHONENUMBER: e.target.value,
                              });
                         }}
                         disabled={
                              textButton.textButton === "Edit" ? true : false
                         }
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
                         className={
                              textButton.textButton === "Edit"
                                   ? "bg-gray-300 mb-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md ring-1 sm:text-sm sm:leading-6"
                                   : "mb-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md ring-1 sm:text-sm sm:leading-6"
                         }
                         value={
                              dataEditDetailBankBranch.BANK_BRANCH_ADDRESS ===
                              null
                                   ? ""
                                   : dataEditDetailBankBranch.BANK_BRANCH_ADDRESS
                         }
                         disabled={
                              textButton.textButton === "Edit" ? true : false
                         }
                         onChange={(e: any) => {
                              setDataEditDetailBankBranch({
                                   ...dataEditDetailBankBranch,
                                   BANK_BRANCH_ADDRESS: e.target.value,
                              });
                         }}
                    />
               </>
          </>
     );
}
