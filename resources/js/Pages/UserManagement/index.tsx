import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
     Cog6ToothIcon,
     EllipsisHorizontalIcon,
     EnvelopeIcon,
     EyeIcon,
     MagnifyingGlassIcon,
     PencilIcon,
     PencilSquareIcon,
     PhoneIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import ModalSearch from "@/Components/Modal/ModalSearch";
import Swal from "sweetalert2";
import Checkbox from "@/Components/Checkbox";
import { get } from "http";
import { Console, log } from "console";
import ModalToDetail from "@/Components/Modal/ModalToDetail";
import Select from "react-tailwindcss-select";
// import DetailMenu from "./DetailMenu";
// import useForm from "@/action/handleChange";
import { set } from "react-datepicker/dist/date_utils";
import ModalToEdit from "@/Components/Modal/ModalToEdit";
import ModalToResetPassword from "@/Components/Modal/ModalToResetPassword";
import AGGrid from "@/Components/AgGrid";
import { Label } from "flowbite-react";
import { data } from "jquery";
import ModalToActions from "@/Components/Modal/ModalToActions";
import SelectTailwind from "react-tailwindcss-select";

export default function UserManagement({ auth, type }: any) {
     //type DataInput
     interface DataInputType {
          name: string;
          email: string;
          user_login: string;
          password: string;
          type: any;
          role: any;
          branch_id: any;
          insurance_id: any;
          upload_type_id: any;
          phone_number: any;
          email_user: any;
     }

     const { dataCombo, dataInsurance, dataRUploadType }: any = usePage().props;

     //type role
     interface Role {
          id: number;
          role_name: string;
     }

     //state
     const [dataInput, setDataInput] = useState<DataInputType>({
          name: "",
          email: "",
          user_login: "",
          password: "",
          type: 2,
          role: [],
          branch_id: "",
          insurance_id: 0,
          upload_type_id: "",
          phone_number: "",
          email_user: "",
     });
     const [dataUserId, setDataUserId] = useState<any>([]);
     const [dataUser, setDataUser] = useState<any>([]);
     const [searchUser, setSearchUser] = useState<any>({
          user_search: [
               {
                    name: "",
                    id: "",
                    flag: "flag",
               },
          ],
     });
     const [dataType, setDataType] = useState<any>([]);
     const [dataRole, setDataRole] = useState<any>([]);
     const [resetPassword, setResetPassword] = useState<any>({
          password: "Adele123",
     });

     const inputDataSearch = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...searchUser.user_search];
          changeVal[i][name] = value;
          setSearchUser({ ...searchUser, user_search: changeVal });
     };

     //modal state
     const [modal, setModal] = useState({
          add: false,
          edit: false,
          reset: false,
          // detail: false,
     });

     //sate data input edit
     const [dataInputEdit, setDataInputEdit] = useState<any>({
          name: "",
          email: "",
          user_login: "",
          password: "",
          employee_id: 0,
          individual_relations_id: 0,
          type: 2,
          user_status: 0,
          company_division_id: 0,
          company_id: 0,
          jobpost: 0,
          role: [],
          newRole: null,
          branch_id: "",
          insurance_id: 0,
          upload_type_id: "",
          phone_number: "",
          email_user: "",
     });

     //handle change role
     const handleRoleChange = (selectedOptions: any) => {
          const selectedRoleIds = selectedOptions
               ? selectedOptions.map((option: any) => option.value)
               : [];
          setDataInput((prevState: DataInputType) => ({
               ...prevState,
               role: selectedRoleIds,
          }));
     };

     //handlechangejobpost
     const handleJobpostChange = (selectedOption: any) => {
          setDataInput((prevState) => ({
               ...prevState,
               jobpost: selectedOption ? selectedOption.value : null, // Jika tidak ada pilihan, set null
          }));
     };

     //handle change email
     const handleUserLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const user_login = e.target.value;

          let name;
          if (user_login.includes("@")) {
               // Jika mengandung '@', ambil bagian sebelum '@'
               name = user_login.split("@")[0];
          } else {
               // Jika tidak mengandung '@', gunakan full user_login sebagai name
               name = user_login;
          }
          // Update state

          setDataInput({ ...dataInput, name: name });
          setDataInputEdit({ ...dataInputEdit, user_login, name });
     };

     //get user by id
     const getUserById = async (userId: number) => {
          try {
               const result = await axios.post(`/settings/getUserId/${userId}`);
               setDataUserId(result.data);

               // set
               setDataInputEdit({
                    name: result.data.name,
                    email: result.data.email,
                    user_login: result.data.user_login,
                    employee_id: result.data.employee_id,
                    individual_relations_id: result.data.individual_relation_id,
                    type: result.data.user_type_id,
                    user_status: result.data.user_status,
                    role: result.data.roles,
                    company_id: result.data.company_id,
                    jobpost: result.data.jobpost_id,
                    company_division_id: result.data.company_division_id,
                    branch_id:
                         result.data.user_type_id === 2
                              ? result.data.BANK_BRANCH_ID
                              : 0,
                    insurance_id:
                         result.data.user_type_id === 4
                              ? result.data.INSURANCE_ID
                              : 0,
                    upload_type_id:
                         result.data.user_type_id === 2 ||
                         result.data.user_type_id === 3
                              ? result.data.UPLOAD_TYPE_ID
                              : 0,
                    phone_number: result.data.USER_PHONE,
                    email_user: result.data.USER_EMAIL,
               });
          } catch (error) {
               // console.log(error);
               throw error;
          }
     };

     //get role
     const getRole = async () => {
          try {
               const result = await axios.post("/getAllRole");
               setDataRole(result.data);
          } catch (error) {
               // console.error('Fetch error:', error);
               throw error;
          }
     };

     const roleFor = dataRole?.map((role: Role) => {
          return {
               value: role.id,
               label: role.role_name,
          };
     });

     //get type
     const getTypeTest = async () => {
          try {
               const result = await axios.post("/getType");
               setDataType(result.data);
          } catch (error) {
               // console.error('Fetch error:', error);
               throw error;
          }
     };

     //modal add
     const addRolePopup = async (e: FormEvent) => {
          getTypeTest();
          getRole();
          setModal({
               add: !modal.add,
               edit: false,
               reset: false,
               // detail: false,
          });
     };

     const getDataRoleSelect = (dataRole: any) => {
          const roleFor = dataRole?.map((role: any) => {
               // console.log("aaab",role.role_name);
               if (role.role_name !== undefined) {
                    return {
                         value: role.id,
                         label: role.role_name,
                    };
               } else {
                    return {
                         value: role.value,
                         label: role.label,
                    };
               }
          });
          // return roleFor;
          if (dataRole.length > 0) {
               return roleFor;
          } else {
               return null;
          }
     };

     if (!dataInputEdit.newRole) {
          dataInputEdit.newRole = dataInputEdit.role.map(
               (role: any) => role.id
          );
     }

     const handleUserStatusChange = (
          e: React.ChangeEvent<HTMLInputElement>
     ) => {
          // Ubah nilai menjadi 1 (on) atau 0 (off) sesuai status switch
          const userStatus = e.target.checked ? 1 : 0;
          setDataInputEdit({ ...dataInputEdit, user_status: userStatus });
     };

     const handleDetailUser = async (e: any) => {
          getUserById(e.id);
          getTypeTest();
          getRole();
          setModal({
               add: false,
               edit: !modal.edit,
               reset: false,
          });
     };

     const [isSuccess, setIsSuccess] = useState<any>("");
     const handleSuccessUser = (message: string) => {
          setIsSuccess("");
          // getMenu()
          if (message !== "") {
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
          }
     };

     const clearSearchUser = async (e: FormEvent) => {
          // Kosongkan input pencarian
          inputDataSearch("name", "", 0);
          // Reset flag untuk menampilkan semua data
          inputDataSearch("flag", "", 0);
          setIsSuccess("Cleared");
     };

     //handleInputChange
     const handleInputChange = (field: string) => (event: any) => {
          setDataInput({
               ...dataInput,
               [field]: event
                    ? event.target
                         ? event.target.value
                         : event.value
                    : "",
          });
     };
     const handleInputChangeEdit = (field: string) => (event: any) => {
          setDataInputEdit({
               ...dataInputEdit,
               [field]: event.target ? event.target.value : event.value,
          });
     };

     const selectComboBranch = dataCombo?.map((query: any) => {
          return {
               value: query.BANK_BRANCH_ID,
               label: query.text_combo,
          };
     });

     const selectInsurance = dataInsurance?.map((query: any) => {
          return {
               value: query.INSURANCE_ID,
               label: query.INSURANCE_NAME,
          };
     });

     const selectRUpload = dataRUploadType?.map((query: any) => {
          return {
               value: query.UPLOAD_TYPE_ID,
               label: query.UPLOAD_TYPE_NAME,
          };
     });

     const getBankBranch = (value: any) => {
          if (value) {
               const selected = selectComboBranch.filter(
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

     const getInsurance = (value: any) => {
          if (value) {
               const selected = selectInsurance.filter(
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

     const getUploadType = (value: any) => {
          if (value) {
               const selected = selectRUpload.filter(
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
     console.log(dataInputEdit);

     return (
          <AuthenticatedLayout user={auth.user} header="User Management">
               <Head title="User Management" />
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}

               {/* modal add */}
               <ModalToAction
                    submitButtonName={"Submit"}
                    headers={"Add User"}
                    show={modal.add}
                    onClose={() => {
                         setModal({
                              add: false,
                              edit: false,
                              reset: false,
                         });
                         setDataInput({
                              name: "",
                              email: "",
                              user_login: "",
                              password: "",
                              type: 2,
                              role: [],
                              branch_id: "",
                              insurance_id: "",
                              upload_type_id: "",
                              phone_number: "",
                              email_user: "",
                         });
                    }}
                    method="POST"
                    title={"Add User"}
                    url={"/settings/addUser"}
                    data={dataInput}
                    onSuccess={handleSuccessUser}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                    }
                    body={
                         <>
                              {/* type */}
                              <div className="mb-2">
                                   <div className="relative">
                                        <InputLabel
                                             className="absolute"
                                             htmlFor="type"
                                             value={"Type"}
                                        />
                                        <div className="ml-[2.3rem] text-red-600">
                                             *
                                        </div>
                                   </div>
                                   <select
                                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                        value={dataInput.type}
                                        onChange={(e) => {
                                             if (e.target.value === "1") {
                                                  setDataInput({
                                                       ...dataInput,
                                                       type: Number(
                                                            e.target.value
                                                       ),
                                                       insurance_id:
                                                            dataInput.type !== 4
                                                                 ? dataInput.insurance_id
                                                                 : 0,
                                                       name: "",
                                                       email: "",
                                                       user_login: "",
                                                       password: "",
                                                       role: 0,
                                                       branch_id: 0,
                                                       upload_type_id: 0,
                                                       phone_number: "",
                                                       email_user: "",
                                                  });
                                             } else if (
                                                  e.target.value === "2"
                                             ) {
                                                  setDataInput({
                                                       ...dataInput,
                                                       type: Number(
                                                            e.target.value
                                                       ),
                                                       insurance_id: 0,
                                                       name: "",
                                                       email: "",
                                                       user_login: "",
                                                       password: "",
                                                       role: [],
                                                       branch_id: "",
                                                       upload_type_id: "",
                                                       phone_number: "",
                                                       email_user: "",
                                                  });
                                             } else if (
                                                  e.target.value === "3"
                                             ) {
                                                  setDataInput({
                                                       ...dataInput,
                                                       type: Number(
                                                            e.target.value
                                                       ),
                                                       insurance_id: 0,
                                                       name: "",
                                                       email: "",
                                                       user_login: "",
                                                       password: "",
                                                       role: [],
                                                       branch_id: 0,
                                                       upload_type_id: "",
                                                       phone_number: "",
                                                       email_user: "",
                                                  });
                                             } else if (
                                                  e.target.value === "4"
                                             ) {
                                                  setDataInput({
                                                       ...dataInput,
                                                       type: Number(
                                                            e.target.value
                                                       ),
                                                       insurance_id: "",
                                                       name: "",
                                                       email: "",
                                                       user_login: "",
                                                       password: "",
                                                       role: [],
                                                       branch_id: 0,
                                                       upload_type_id: 0,
                                                       phone_number: "",
                                                       email_user: "",
                                                  });
                                             }
                                        }}
                                        required
                                   >
                                        <option value={""}>
                                             -- Choose Type --
                                        </option>
                                        {dataType?.map(
                                             (mType: any, i: number) => {
                                                  return (
                                                       <option
                                                            value={
                                                                 mType.user_type_id
                                                            }
                                                            key={i}
                                                       >
                                                            {
                                                                 mType.user_type_name
                                                            }
                                                       </option>
                                                  );
                                             }
                                        )}
                                   </select>
                              </div>

                              {/* pilih asuransi */}
                              {dataInput.type === 4 ? (
                                   <>
                                        {/* pilih asuransi */}
                                        <InputLabel
                                             className=""
                                             htmlFor="type"
                                             value={"Insurance"}
                                             required={true}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 mb-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-[var(--dynamic-color)]`
                                                                 : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                       }`,
                                             }}
                                             options={selectInsurance}
                                             isSearchable={true}
                                             placeholder={
                                                  "--Choose Insurance--"
                                             }
                                             value={dataInput.insurance_id}
                                             onChange={(e) => {
                                                  setDataInput({
                                                       ...dataInput,
                                                       insurance_id: e,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </>
                              ) : null}

                              {/* type */}
                              {dataInput.type !== 1 ? (
                                   <>
                                        {/* role  */}
                                        <div className="relative">
                                             <InputLabel
                                                  className="absolute"
                                                  htmlFor="type"
                                                  value={"Role"}
                                             />
                                             <div className="ml-[2.3rem] text-red-600">
                                                  *
                                             </div>
                                             <div className="mb-2 relative">
                                                  <Select
                                                       classNames={{
                                                            menuButton: () =>
                                                                 `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                            menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar absolute",
                                                            listItem: ({
                                                                 isSelected,
                                                            }: any) =>
                                                                 `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                      isSelected
                                                                           ? `text-white bg-primary-hover-adele`
                                                                           : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                 }`,
                                                       }}
                                                       options={roleFor}
                                                       isSearchable={true}
                                                       isMultiple={true}
                                                       placeholder={
                                                            "Select Role"
                                                       }
                                                       isClearable={true}
                                                       // value={dataInput.role.map(id => roleFor.find((role: { value: any }) => role.value === id)) || null}
                                                       value={
                                                            dataInput.role
                                                                 .length > 0
                                                                 ? dataInput.role.map(
                                                                        (
                                                                             id: any
                                                                        ) =>
                                                                             roleFor.find(
                                                                                  (role: {
                                                                                       value: any;
                                                                                  }) =>
                                                                                       role.value ===
                                                                                       id
                                                                             )
                                                                   )
                                                                 : null // Set to null if no roles selected
                                                       }
                                                       onChange={
                                                            handleRoleChange
                                                       }
                                                       primaryColor={"red"}
                                                  />
                                             </div>
                                        </div>
                                        {/* end role  */}
                                   </>
                              ) : null}

                              {/* branch */}
                              {dataInput.type === 2 ||
                              dataInput.type === "2" ? (
                                   <>
                                        <InputLabel
                                             className=""
                                             htmlFor="Bank_BRANCH"
                                             value={"Bank Branch"}
                                             required={true}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-[var(--dynamic-color)]`
                                                                 : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                       }`,
                                             }}
                                             options={selectComboBranch}
                                             isSearchable={true}
                                             placeholder={
                                                  "--Choose Bank Branch--"
                                             }
                                             value={dataInput.branch_id}
                                             onChange={(e) => {
                                                  setDataInput({
                                                       ...dataInput,
                                                       branch_id: e,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </>
                              ) : null}
                              {/* end of branch */}

                              {/* for email dan phone */}

                              <InputLabel
                                   className="mt-2"
                                   htmlFor="USER_EMAIL"
                                   value={"User Phone Number"}
                              />
                              <TextInput
                                   type="text"
                                   value={dataInput.phone_number}
                                   className=""
                                   onChange={(e) =>
                                        setDataInput({
                                             ...dataInput,
                                             phone_number: e.target.value,
                                        })
                                   }
                                   autoComplete="off"
                                   placeholder="Phone Number"
                              />

                              <InputLabel
                                   className="mt-2"
                                   htmlFor="USER_EMAIL"
                                   value={"User Email"}
                              />
                              <TextInput
                                   type="email"
                                   value={dataInput.email_user}
                                   className=""
                                   onChange={(e) =>
                                        setDataInput({
                                             ...dataInput,
                                             email_user: e.target.value,
                                        })
                                   }
                                   autoComplete="off"
                                   placeholder="example@email.com"
                              />
                              {/* end for email dan phone */}

                              {/* user_login */}
                              <div className="mb-2 mt-2">
                                   <div className="relative">
                                        <InputLabel
                                             className="absolute"
                                             htmlFor="email"
                                             value={"User Login"}
                                        />
                                        <div className="ml-[4.6rem] text-red-600">
                                             *
                                        </div>
                                   </div>
                                   <TextInput
                                        id="user_login"
                                        type="text"
                                        name="user_login"
                                        value={dataInput.user_login}
                                        className="mt-2"
                                        onChange={(e) =>
                                             setDataInput({
                                                  ...dataInput,
                                                  user_login: e.target.value,
                                             })
                                        }
                                        required
                                        autoComplete="off"
                                        placeholder="Email or Other unique id"
                                   />
                              </div>
                              {/* end user_login  */}

                              {/* password */}
                              <div className="mb-2">
                                   <div className="relative">
                                        <InputLabel
                                             className="absolute"
                                             htmlFor="password"
                                             value={"User Password"}
                                        />
                                        <div className="ml-[6.8rem] text-red-600">
                                             *
                                        </div>
                                   </div>
                                   <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={dataInput.password}
                                        className="mt-2"
                                        onChange={(e) =>
                                             setDataInput({
                                                  ...dataInput,
                                                  password: e.target.value,
                                             })
                                        }
                                        required
                                        placeholder="Password"
                                        autoComplete="off"
                                   />
                              </div>
                              {/* end password */}

                              {dataInput.type === 2 || dataInput.type === 3 ? (
                                   <>
                                        {/* for upload type */}
                                        <InputLabel
                                             className=""
                                             htmlFor="upload_type"
                                             value={"Upload Type"}
                                             required={true}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-[var(--dynamic-color)]`
                                                                 : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                       }`,
                                             }}
                                             options={selectRUpload}
                                             isSearchable={true}
                                             isClearable={true}
                                             placeholder={
                                                  "--Choose Upload Type--"
                                             }
                                             value={dataInput.upload_type_id}
                                             onChange={(e) => {
                                                  setDataInput({
                                                       ...dataInput,
                                                       upload_type_id: e,
                                                  });
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                        {/* for upload type */}
                                   </>
                              ) : null}
                         </>
                    }
               />

               {/* modal Edit */}
               <ModalToAction
                    headers={null}
                    submitButtonName={"Submit"}
                    show={modal.edit}
                    onClose={() =>
                         setModal({
                              add: false,
                              edit: false,
                              reset: false,
                         })
                    }
                    method="post"
                    title={"Edit User"}
                    url={`/settings/userEdit/${dataUserId.id}`}
                    data={dataInputEdit}
                    onSuccess={handleSuccessUser}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                    }
                    body={
                         <>
                              <div>
                                   {/* user_login */}
                                   <div className="relative">
                                        <div className="mb-2">
                                             <div className="container">
                                                  <InputLabel
                                                       className="absolute"
                                                       htmlFor="name"
                                                       value={"Name"}
                                                  />
                                                  <div className="ml-[3rem] text-red-600">
                                                       *
                                                  </div>
                                             </div>
                                             <TextInput
                                                  id="name"
                                                  type="text"
                                                  name="name"
                                                  value={
                                                       dataInputEdit?.name || ""
                                                  }
                                                  className="mt-2"
                                                  onChange={(e) =>
                                                       setDataInputEdit({
                                                            ...dataInputEdit,
                                                            name: e.target
                                                                 .value,
                                                       })
                                                  }
                                                  required
                                                  autoComplete="off"
                                                  placeholder="Name or unique id"
                                             />
                                        </div>
                                   </div>
                                   {/* end user_login */}

                                   {/* type */}
                                   <div className="relative">
                                        <div className="mb-2">
                                             <InputLabel
                                                  className="absolute"
                                                  htmlFor="type"
                                                  value={"Type"}
                                             />
                                             <div className="ml-[2.3rem] text-red-600">
                                                  *
                                             </div>
                                             <select
                                                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
                                                  value={
                                                       dataInputEdit?.type || ""
                                                  }
                                                  onChange={(e) => {
                                                       const selectedType =
                                                            Number(
                                                                 e.target.value
                                                            );
                                                       setDataInputEdit({
                                                            ...dataInputEdit,
                                                            type: selectedType,
                                                            role: null,
                                                            branch_id: null,
                                                            insurance_id: null,
                                                       });
                                                  }}
                                             >
                                                  <option value="" disabled>
                                                       -- Select Type --
                                                  </option>
                                                  {dataType?.map(
                                                       (
                                                            mType: any,
                                                            i: number
                                                       ) => (
                                                            <option
                                                                 value={
                                                                      mType.user_type_id
                                                                 }
                                                                 key={i}
                                                            >
                                                                 {
                                                                      mType.user_type_name
                                                                 }
                                                            </option>
                                                       )
                                                  )}
                                             </select>
                                        </div>
                                   </div>
                                   {/* type */}

                                   {/* pilih asuransi */}
                                   {dataInputEdit.type === 4 ? (
                                        <>
                                             {/* pilih asuransi */}
                                             <InputLabel
                                                  className=""
                                                  htmlFor="type"
                                                  value={"Insurance"}
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm text-gray-500 mb-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                       menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-[var(--dynamic-color)]`
                                                                      : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectInsurance}
                                                  isSearchable={true}
                                                  placeholder={
                                                       "--Choose Insurance--"
                                                  }
                                                  value={{
                                                       label: getInsurance(
                                                            dataInputEdit.insurance_id
                                                       ),
                                                       value: dataInputEdit.insurance_id,
                                                  }}
                                                  onChange={(val: any) => {
                                                       setDataInputEdit({
                                                            ...dataInputEdit,
                                                            insurance_id:
                                                                 val.value,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
                                                  }
                                             />
                                        </>
                                   ) : null}

                                   {dataInputEdit?.type !== 1 ? (
                                        <>
                                             {/* Role */}
                                             <div className="relative">
                                                  <div className="mb-2">
                                                       <InputLabel
                                                            className="absolute"
                                                            htmlFor=""
                                                            value={"Role"}
                                                       />
                                                       <div className="ml-[2.2rem] text-red-600">
                                                            *
                                                       </div>
                                                       <div className="mb-2">
                                                            <Select
                                                                 classNames={{
                                                                      menuButton:
                                                                           () =>
                                                                                `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                      menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                      listItem:
                                                                           ({
                                                                                isSelected,
                                                                           }: any) =>
                                                                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                     isSelected
                                                                                          ? `text-white bg-primary-hover-adele`
                                                                                          : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                                                }`,
                                                                 }}
                                                                 options={
                                                                      roleFor
                                                                 }
                                                                 isSearchable={
                                                                      true
                                                                 }
                                                                 isMultiple={
                                                                      true
                                                                 }
                                                                 placeholder={
                                                                      "Select"
                                                                 }
                                                                 isClearable={
                                                                      true
                                                                 }
                                                                 // value={dataInputEdit?.role?.map(id => roleFor.find(role => role.value === id))}
                                                                 value={getDataRoleSelect(
                                                                      dataInputEdit?.role
                                                                 )}
                                                                 onChange={(
                                                                      val: any
                                                                 ) => {
                                                                      const selectedRoleIds =
                                                                           val
                                                                                ? val.map(
                                                                                       (
                                                                                            option: any
                                                                                       ) =>
                                                                                            option.value
                                                                                  )
                                                                                : [];
                                                                      setDataInputEdit(
                                                                           {
                                                                                ...dataInputEdit,
                                                                                role: val,
                                                                                newRole: selectedRoleIds,
                                                                           }
                                                                      );
                                                                      // const selectedRoleIds =
                                                                      //      val
                                                                      //           ? val.map(
                                                                      //                  (
                                                                      //                       option: any
                                                                      //                  ) =>
                                                                      //                       option.value
                                                                      //             )
                                                                      //           : [];
                                                                      // setDataInputEdit(
                                                                      //      {
                                                                      //           ...dataInputEdit,
                                                                      //           role: val,
                                                                      //           newRole: selectedRoleIds,
                                                                      //      }
                                                                      // );
                                                                 }}
                                                                 primaryColor={
                                                                      "red"
                                                                 }
                                                            />
                                                       </div>
                                                  </div>
                                             </div>
                                             {/* end Role */}
                                        </>
                                   ) : null}

                                   {/* branch */}
                                   {dataInputEdit?.type === 2 ||
                                   dataInputEdit?.type === "2" ? (
                                        <>
                                             <InputLabel
                                                  className=""
                                                  htmlFor="Bank_BRANCH"
                                                  value={"Bank Branch"}
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                       menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-[var(--dynamic-color)]`
                                                                      : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectComboBranch}
                                                  isSearchable={true}
                                                  placeholder={
                                                       "--Choose Bank Branch--"
                                                  }
                                                  value={{
                                                       label: getBankBranch(
                                                            dataInputEdit.branch_id
                                                       ),
                                                       value: dataInputEdit.branch_id,
                                                  }}
                                                  onChange={(val: any) => {
                                                       setDataInputEdit({
                                                            ...dataInputEdit,
                                                            branch_id:
                                                                 val.value,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
                                                  }
                                             />
                                        </>
                                   ) : null}
                                   {/* end of branch */}

                                   {dataInputEdit.type === 2 ||
                                   dataInputEdit.type === 3 ? (
                                        <>
                                             {/* for upload type */}
                                             <InputLabel
                                                  className="mt-2"
                                                  htmlFor="upload_type"
                                                  value={"Upload Type"}
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                       menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-[var(--dynamic-color)]`
                                                                      : `text-gray-500 hover:bg-[var(--dynamic-color)] hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectRUpload}
                                                  isSearchable={true}
                                                  placeholder={
                                                       "--Choose Upload Type--"
                                                  }
                                                  value={{
                                                       label: getUploadType(
                                                            dataInputEdit.upload_type_id
                                                       ),
                                                       value: dataInputEdit.upload_type_id,
                                                  }}
                                                  onChange={(val: any) => {
                                                       setDataInputEdit({
                                                            ...dataInputEdit,
                                                            upload_type_id:
                                                                 val.value,
                                                       });
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
                                                  }
                                             />
                                             {/* for upload type */}
                                        </>
                                   ) : null}

                                   {/* for email dan phone */}

                                   <InputLabel
                                        className="mt-2"
                                        htmlFor="USER_EMAIL"
                                        value={"User Phone Number"}
                                   />
                                   <TextInput
                                        type="text"
                                        value={dataInputEdit.phone_number}
                                        className=""
                                        onChange={(e) =>
                                             setDataInputEdit({
                                                  ...dataInputEdit,
                                                  phone_number: e.target.value,
                                             })
                                        }
                                        autoComplete="off"
                                        placeholder="Phone Number"
                                   />

                                   <InputLabel
                                        className="mt-2"
                                        htmlFor="USER_EMAIL"
                                        value={"User Email"}
                                   />
                                   <TextInput
                                        type="email"
                                        value={dataInputEdit.email_user}
                                        className=""
                                        onChange={(e) =>
                                             setDataInputEdit({
                                                  ...dataInputEdit,
                                                  email_user: e.target.value,
                                             })
                                        }
                                        autoComplete="off"
                                        placeholder="example@email.com"
                                   />
                                   {/* end for email dan phone */}

                                   {/* user_login */}
                                   <div className="relative">
                                        <div className="mb-2 mt-2">
                                             <div className="container">
                                                  <InputLabel
                                                       className="absolute"
                                                       htmlFor="user_login"
                                                       value={"User Login"}
                                                  />
                                                  <div className="ml-[4.6rem] text-red-600">
                                                       *
                                                  </div>
                                             </div>
                                             <TextInput
                                                  id="user_login"
                                                  type="text"
                                                  name="user_login"
                                                  value={
                                                       dataInputEdit?.user_login
                                                  }
                                                  className="mt-2"
                                                  onChange={
                                                       handleUserLoginChange
                                                  }
                                                  required
                                                  autoComplete="off"
                                                  placeholder="user login or unique id"
                                             />
                                        </div>
                                   </div>
                                   {/* end user_login */}

                                   {/* isActive user */}
                                   <div className="flex items-center mt-4 ">
                                        <span className="mr-2 text-sm">
                                             Is Active
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                             <input
                                                  type="checkbox"
                                                  className="sr-only peer"
                                                  checked={
                                                       dataInputEdit.user_status
                                                  }
                                                  onChange={
                                                       handleUserStatusChange
                                                  }
                                             />
                                             <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[var(--dynamic-color)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                        </label>
                                   </div>
                                   {/* end isActive user */}

                                   {/* Reset Password */}
                                   <div className="flex text-sm mt-4">
                                        Click
                                        <div
                                             className="ml-1 hover:text-blue-400 text-sm cursor-pointer"
                                             onClick={() => {
                                                  setModal({
                                                       add: false,
                                                       edit: false,
                                                       reset: true,
                                                  });
                                             }}
                                        >
                                             Here for Reset Password
                                        </div>
                                   </div>
                                   {/* Switch for User Status */}
                              </div>
                         </>
                    }
               />

               {/* modal reset password */}
               <ModalToResetPassword
                    submitButtonName={""}
                    headers={null}
                    closeAllModal={() => {}}
                    show={modal.reset}
                    onClose={() =>
                         setModal({
                              add: false,
                              edit: true,
                              reset: false,
                         })
                    }
                    method="patch"
                    title={"Reset Password"}
                    url={`/settings/userResetPassword/${dataUserId.id}`}
                    data={resetPassword}
                    onSuccess={handleSuccessUser}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                    }
                    body={
                         <>
                              <div>
                                   <div className="relative">
                                        <div className="mb-2 text-center">
                                             <div className="container ">
                                                  <InputLabel
                                                       className=""
                                                       htmlFor="password"
                                                       value={`Are you sure for reseting password ${dataInputEdit.email} to be 'Adele123'?`}
                                                  />
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </>
                    }
               />

               {/* body */}
               <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                         <div className="bg-white mb-4 rounded-md p-4">
                              <div
                                   className="bg-[var(--dynamic-color)] w-fit p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => addRolePopup(e)}
                              >
                                   <span>Add User</span>
                              </div>
                         </div>

                         <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                              <TextInput
                                   type="text"
                                   className="mt-2 ring-1"
                                   value={searchUser.user_search[0].name}
                                   onChange={(e) => {
                                        inputDataSearch(
                                             "name",
                                             e.target.value,
                                             0
                                        );
                                   }}
                                   onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                             const title =
                                                  searchUser.user_search[0]
                                                       .name;
                                             const id =
                                                  searchUser.user_search[0].id;
                                             if (title || id) {
                                                  inputDataSearch(
                                                       "flag",
                                                       title || id,
                                                       0
                                                  );
                                                  setIsSuccess("success");
                                                  setTimeout(() => {
                                                       setIsSuccess("");
                                                  });
                                             } else {
                                                  inputDataSearch(
                                                       "flag",
                                                       "",
                                                       0
                                                  );
                                                  setIsSuccess(
                                                       "Get All Job Post"
                                                  );
                                             }
                                        }
                                   }}
                                   placeholder="Search User Name"
                              />
                              <div className="mt-4 flex justify-end gap-2">
                                   <div
                                        className="bg-[var(--dynamic-color)] text-white p-2 w-fit rounded-md text-center hover:bg-primary-hover-adele cursor-pointer"
                                        onClick={() => {
                                             if (
                                                  searchUser.user_search[0]
                                                       .id === "" &&
                                                  searchUser.user_search[0]
                                                       .name === ""
                                             ) {
                                                  inputDataSearch(
                                                       "flag",
                                                       "",
                                                       0
                                                  );
                                             } else {
                                                  inputDataSearch(
                                                       "flag",
                                                       "",
                                                       0
                                                  );
                                             }
                                             setIsSuccess("Search");
                                        }}
                                   >
                                        Search
                                   </div>
                                   <div
                                        className="bg-[var(--dynamic-color)] text-white p-2 w-fit rounded-md text-center hover:bg-primary-hover-adele cursor-pointer"
                                        onClick={(e) => clearSearchUser(e)}
                                   >
                                        Clear Search
                                   </div>
                              </div>
                         </div>
                    </div>
                    {/* AGGrid */}
                    <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
                         <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
                              <AGGrid
                                   addButtonLabel={null}
                                   addButtonModalState={undefined}
                                   withParam={null}
                                   searchParam={searchUser.user_search}
                                   // loading={isLoading.get_policy}
                                   url={"getUser"}
                                   doubleClickEvent={handleDetailUser}
                                   triggeringRefreshData={isSuccess}
                                   colDefs={[
                                        {
                                             headerName: "No.",
                                             valueGetter: "node.rowIndex + 1",
                                             flex: 3,
                                        },
                                        {
                                             headerName: "User Login",
                                             field: "user_login",
                                             flex: 7,
                                        },
                                        {
                                             headerName: "Name",
                                             field: "name",
                                             flex: 7,
                                        },
                                        {
                                             headerName: "User Status",
                                             field: "user_status",
                                             valueGetter: (params: any) => {
                                                  return params.data
                                                       ?.user_status === 1
                                                       ? "Active"
                                                       : "Inactive";
                                             },
                                             flex: 3,
                                             cellStyle: (params: any) => {
                                                  return {
                                                       color:
                                                            params.data
                                                                 ?.user_status ===
                                                            1
                                                                 ? "green"
                                                                 : "red",
                                                       fontWeight: "bold",
                                                  };
                                             },
                                        },
                                   ]}
                              />
                         </div>
                    </div>
               </div>
          </AuthenticatedLayout>
     );
}
