import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
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
import { FormEvent, useEffect, useState } from "react";
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
import DetailMenu from "./DetailMenu";
import SequenceEdit from "@/Components/sequenceEdit";
import AGGrid from "@/Components/AgGrid";
import { get } from "jquery";
import { set } from "react-datepicker/dist/date_utils";
import Select from "react-tailwindcss-select";
import Checkbox from "@/Components/Checkbox";

export default function ACLMenu({ auth, custom_menu }: PageProps) {
     const [refreshGrid, setRefreshGrid] = useState<any>("");

     //data show
     const [show, setShow] = useState<any>([]);
     const getmenusShow = async () => {
          try {
               const res = await axios.get(`/showMenu`);
               setShow(res.data);
          } catch (error) {
               console.log(error);
          }
     };

     const [seqMenu, setSeqMenu] = useState<any>([]);

     const [menuData, setMenuData] = useState<any>([]);
     const [searchMenu, setSearchMenu] = useState<any>({
          menu_search: [
               {
                    menu_name: "",
                    id: "",
                    flag: "flag",
               },
          ],
     });

     const [comboMenu, setComboMenu] = useState<any>([]);

     const [detailMenu, setDetailMenu] = useState<any>({
          id: "",
          menu_name: "",
     });

     // getComboMenu
     const getComboMenu = async () => {
          try {
               const res = await axios.post(`/getMenuCombo`);
               setComboMenu(res.data);
          } catch (error) {
               console.log(error);
          }
     };

     //clearSearchMenu
     const clearSearchMenu = async (pageNumber = "page=1") => {
          await axios
               .post(`/getMenus?${pageNumber}`, {})
               .then((res) => {
                    setMenuData(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const [modal, setModal] = useState({
          add: false,
          edit: false,
          detail: false,
          sequence: false,
     });

     const addMenuPopup = async (e: FormEvent) => {
          e.preventDefault();
          getmenusShow();
          getComboMenu();
          setModal({
               add: !modal.add,
               edit: false,
               detail: false,
               sequence: false,
          });
     };

     const addSequencePopup = async (e: FormEvent) => {
          e.preventDefault();

          getComboMenu();
          setModal({
               add: false,
               edit: false,
               detail: false,
               sequence: !modal.sequence,
          });
     };

     const { data, setData } = useForm<any>({
          menu_parent: "",
          menu_name: "",
          menu_url: "",
          menu_sequence: "",
          menu_is_deleted: "",
          menu_is_upper_mark: "",
          menu_is_lower_mark: "",
     });

     const inputDataSearch = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...searchMenu.menu_search];
          changeVal[i][name] = value;
          setSearchMenu({ ...searchMenu, menu_search: changeVal });
     };

     // Fungsi untuk menghapus input pencarian dan menampilkan semua data
     const clearSearch = async (e: FormEvent) => {
          e.preventDefault();
          inputDataSearch("jobpost_title", "", 0);
          inputDataSearch("flag", "", 0);
          setRefreshGrid("success");
          setTimeout(() => {
               setRefreshGrid("");
          }, 1000);
     };

     const [isSuccess, setIsSuccess] = useState<any>("");

     const handleSuccessMenu = (message: string, e: any) => {
          setIsSuccess("");
          if (message !== "") {
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
               setRefreshGrid("success");
               setTimeout(() => {
                    setRefreshGrid("");
               }, 1000);
          }
          //get combo menu
          getComboMenu();
          Swal.fire({
               title: `${
                    message && message.length > 0 ? message[0] : "Success"
               } Please Arrange the Sequence`,
               icon: "info",
               timer: 2000,
               timerProgressBar: true,
               showConfirmButton: false,
               willClose: () => {
                    setModal({
                         add: false,
                         edit: false,
                         detail: false,
                         sequence: true,
                    });
               },
          });
     };

     const handleSuccessMenuSeq = (message: string) => {
          setIsSuccess("");
          // getMenu()
          if (message !== "") {
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 5000);
          }
          window.location.reload();
     };

     const handleItemsChange = (updatedItems: any) => {
          setSeqMenu(updatedItems);
     };

     const handleDetailMenu = async (data: any) => {
          getmenusShow();
          setData({
               id: data.id,
               menu_parent_id: data.menu_parent_id,
               menu_name: data.menu_name,
               menu_url: data.menu_url,
               menu_sequence: data.menu_sequence,
               menu_is_deleted: data.menu_is_deleted,
               menu_is_upper_mark: data.menu_is_upper_mark,
               menu_is_lower_mark: data.menu_is_lower_mark,
          });
          setModal({
               add: false,
               edit: !modal.edit,
               detail: false,
               sequence: false,
          });
     };

     const optionsParent = show.map((mData: any, i: number) => {
          return {
               value: mData.id,
               label: mData.text_combo,
          };
     });

     // action delete
     const toggleMenuDeleteStatus = (id: number) => {
          // Periksa apakah id menu yang ingin diubah sesuai dengan id dalam state
          setData({
               ...data,
               menu_is_deleted: data.menu_is_deleted === 1 ? 0 : 1,
          });
     };

     const actionDelete = async (e: any, idMenu: any, flag: any) => {
          e.preventDefault();
          console.log(idMenu, flag);
          Swal.fire({
               title: "Are you sure?",
               text: "You won't be able to revert this!",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, do it!",
          }).then(async (result) => {
               if (result.isConfirmed) {
                    try {
                         // send request to server
                         const response = await axios.post(
                              `/changeMenuStatus`,
                              {
                                   idMenu,
                                   flag,
                              }
                         );
                         // check status response
                         if (response.status === 200) {
                              Swal.fire(
                                   "Deleted!",
                                   "Your menu has been deleted.",
                                   "success"
                              );
                              handleSuccessMenu(response.data, e); // Panggil fungsi sukses untuk memperbarui UI atau state
                         } else {
                              throw new Error("Unexpected response status");
                         }
                    } catch (error) {
                         console.error(error);
                         Swal.fire(
                              "Error!",
                              "There was an error deleting the menu.",
                              "error"
                         );
                    }
               }
          });
     };
     //end action delete

     // for checbox upper

     const handleCheckboxUp = (e: any) => {
          const { checked } = e.target;

          if (checked) {
               setData("menu_is_upper_mark", 1);
          } else {
               setData("menu_is_upper_mark", 0);
          }
     };

     const handleCheckboxLower = (e: any) => {
          const { checked } = e.target;

          if (checked) {
               setData("menu_is_lower_mark", 1);
          } else {
               setData("menu_is_lower_mark", 0);
          }
     };

     // for checkbox
     const checkCheckedUpper = (id: any) => {
          if (id === 1) {
               return true;
          }
     };

     const checkCheckedLower = (id: any) => {
          if (id === 1) {
               return true;
          }
     };

     return (
          <AuthenticatedLayout user={auth.user} header={"Menu"}>
               <Head title="Menu" />
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}

               {/* modal Add */}
               <ModalToAction
                    submitButtonName={"Submit"}
                    headers={"Add Menu"}
                    method="POST"
                    show={modal.add}
                    onClose={() => {
                         setModal({ ...modal, add: false });

                         setData({
                              menu_name: "",
                              menu_url: "",
                         });
                    }}
                    title={"Add Menu"}
                    url={`/setting/addMenu`}
                    data={data}
                    onSuccess={handleSuccessMenu}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                    }
                    body={
                         <>
                              {/* Parent */}
                              <div className="mb-3">
                                   <div>
                                        <InputLabel
                                             className=""
                                             htmlFor="name_parent"
                                             value={"Parent"}
                                        />
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
                                                                 ? `text-white bg-primary-adele`
                                                                 : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                       }`,
                                             }}
                                             options={optionsParent}
                                             isSearchable={true}
                                             isMultiple={false}
                                             placeholder={"Choose Parent"}
                                             isClearable={true}
                                             value={
                                                  optionsParent.find(
                                                       (el: { value: any }) =>
                                                            el.value ===
                                                            data.menu_parent
                                                  ) || null
                                             }
                                             onChange={(val: any) => {
                                                  setData(
                                                       "menu_parent",
                                                       val ? val.value : null
                                                  );
                                             }}
                                             primaryColor={"red"}
                                        />
                                   </div>
                                   <div className="mt-2">
                                        <InputLabel
                                             className="relative"
                                             htmlFor="menu_name"
                                             value={"Menu Name"}
                                             required
                                        />
                                        <TextInput
                                             id="menu_name"
                                             type="text"
                                             name="menu_name"
                                             value={data.menu_name}
                                             className="mt-2"
                                             onChange={(e) =>
                                                  setData(
                                                       "menu_name",
                                                       e.target.value
                                                  )
                                             }
                                             required
                                             autoComplete="off"
                                             placeholder="Name Menu"
                                        />
                                   </div>
                                   <div className="mt-2">
                                        <InputLabel
                                             className=""
                                             htmlFor="menu_url"
                                             value={"Menu URL"}
                                        />

                                        <TextInput
                                             id="menu_url"
                                             type="text"
                                             name="menu_url"
                                             value={data.menu_url}
                                             autoComplete="off"
                                             className="mt-2"
                                             onChange={(e) =>
                                                  setData(
                                                       "menu_url",
                                                       e.target.value
                                                  )
                                             }
                                             placeholder="Menu URL"
                                        />
                                   </div>
                                   <div className="grid grid-cols-2 mt-3 gap-2">
                                        <div className="flex gap-2 bg-white p-2 rounded-md shadow-md">
                                             <div>
                                                  <Checkbox
                                                       name="menu_is_upper_mark"
                                                       id="menu_is_upper_mark"
                                                       value={
                                                            data.menu_is_upper_mark
                                                       }
                                                       // defaultChecked={checkCheckedMRelation(
                                                       //      typeRelation.RELATION_TYPE_ID
                                                       // )}
                                                       onChange={(e) => {
                                                            handleCheckboxUp(e);
                                                       }}
                                                  />
                                             </div>
                                             <div className="text-sm flex items-center">
                                                  <span>Menu Upper Mark</span>
                                             </div>
                                        </div>
                                        <div className="flex gap-2 bg-white p-2 rounded-md shadow-md">
                                             <div>
                                                  <Checkbox
                                                       name="menu_is_lower_mark"
                                                       id="menu_is_lower_mark"
                                                       value={
                                                            data.menu_is_lower_mark
                                                       }
                                                       // defaultChecked={checkCheckedMRelation(
                                                       //      typeRelation.RELATION_TYPE_ID
                                                       // )}
                                                       onChange={(e) => {
                                                            handleCheckboxLower(
                                                                 e
                                                            );
                                                       }}
                                                  />
                                             </div>
                                             <div className="text-sm flex items-center">
                                                  <span>Menu Lower Mark</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* modal end add */}

               {/* modal Edit */}
               <ModalToAction
                    submitButtonName={"Submit"}
                    headers={"Add Menu"}
                    method="POST"
                    show={modal.edit}
                    onClose={() => {
                         setModal({ ...modal, edit: false });
                         setData({
                              menu_name: "",
                              menu_url: "",
                         });
                    }}
                    title={"Edit Menu"}
                    url={`/setting/editMenu`}
                    data={data}
                    buttonAddOns={
                         data.menu_is_deleted === 1 ? "Reactivate" : "Delete"
                    }
                    actionDelete={actionDelete}
                    toggleMenuDeleteStatus={toggleMenuDeleteStatus}
                    onSuccess={handleSuccessMenu}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                    }
                    body={
                         <>
                              {/* Parent */}
                              <div className="mb-3">
                                   <div>
                                        <InputLabel
                                             className=""
                                             htmlFor="name_parent"
                                             value={"Parent"}
                                        />
                                        <Select
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm text-gray-500 mt-2 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                  menu: "text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                  listItem: ({
                                                       isSelected,
                                                  }: any) =>
                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                            isSelected
                                                                 ? `text-white bg-primary-hover-adele`
                                                                 : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                                                       }`,
                                             }}
                                             options={optionsParent}
                                             isSearchable={true}
                                             isMultiple={false}
                                             placeholder={"Choose Parent"}
                                             isClearable={true}
                                             value={
                                                  optionsParent.find(
                                                       (el: { value: any }) =>
                                                            el.value ===
                                                            data.menu_parent_id
                                                  ) || null
                                             }
                                             onChange={(val: any) => {
                                                  setData(
                                                       "menu_parent_id",
                                                       val ? val.value : null
                                                  );
                                             }}
                                             primaryColor={"red"}
                                        />
                                   </div>
                                   <div className="mt-2">
                                        <InputLabel
                                             className="absolute"
                                             htmlFor="menu_name"
                                             value={"Menu Name"}
                                        />
                                        <div className="ml-[5.5rem] text-red-600">
                                             *
                                        </div>
                                        <TextInput
                                             id="menu_name"
                                             type="text"
                                             name="menu_name"
                                             value={data.menu_name || ""}
                                             className="mt-2"
                                             onChange={(e) =>
                                                  setData(
                                                       "menu_name",
                                                       e ? e.target.value : ""
                                                  )
                                             }
                                             autoComplete="off"
                                             required
                                             placeholder="Name Menu"
                                        />
                                   </div>
                                   <div className="mt-2">
                                        <InputLabel
                                             className=""
                                             htmlFor="menu_url"
                                             value={"Menu URL"}
                                        />

                                        <TextInput
                                             id="menu_url"
                                             type="text"
                                             name="menu_url"
                                             value={data.menu_url || ""}
                                             className="mt-2"
                                             onChange={(e) =>
                                                  setData(
                                                       "menu_url",
                                                       e ? e.target.value : ""
                                                  )
                                             }
                                             autoComplete="off"
                                             placeholder="Menu URL"
                                        />
                                   </div>
                                   <div className="grid grid-cols-2 mt-3 gap-2">
                                        <div className="flex gap-2 bg-white p-2 rounded-md shadow-md">
                                             <div>
                                                  <Checkbox
                                                       name="menu_is_upper_mark"
                                                       id="menu_is_upper_mark"
                                                       value={
                                                            data.menu_is_upper_mark
                                                       }
                                                       defaultChecked={checkCheckedUpper(
                                                            data.menu_is_upper_mark
                                                       )}
                                                       onChange={(e) => {
                                                            handleCheckboxUp(e);
                                                       }}
                                                  />
                                             </div>
                                             <div className="text-sm flex items-center">
                                                  <span>Menu Upper Mark</span>
                                             </div>
                                        </div>
                                        <div className="flex gap-2 bg-white p-2 rounded-md shadow-md">
                                             <div>
                                                  <Checkbox
                                                       name="menu_is_lower_mark"
                                                       id="menu_is_lower_mark"
                                                       value={
                                                            data.menu_is_lower_mark
                                                       }
                                                       defaultChecked={checkCheckedLower(
                                                            data.menu_is_lower_mark
                                                       )}
                                                       onChange={(e) => {
                                                            handleCheckboxLower(
                                                                 e
                                                            );
                                                       }}
                                                  />
                                             </div>
                                             <div className="text-sm flex items-center">
                                                  <span>Menu Lower Mark</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </>
                    }
               />
               {/* modal end add */}

               {/* modal sequence */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modal.sequence}
                    onClose={() => setModal({ ...modal, sequence: false })}
                    title={"Sort Sequence"}
                    url={`/setting/changeSeqMenu`}
                    data={seqMenu}
                    onSuccess={handleSuccessMenuSeq}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
                    }
                    body={
                         <SequenceEdit
                              initialItems={comboMenu as any}
                              onItemsChange={handleItemsChange}
                         />
                    }
               />
               {/* modal end sequence */}

               {/* Modal detail */}
               {/* <DetailMenu
                idMenu={detailMenu.id}
                comboMenu={comboMenu}
                modal={modal.edit}
                setModal={() =>{
                    console.log('Modal close');
                    setModal({  
                        add: false,
                        edit: false,
                        detail: false,
                        sequence: false
                    })}
                }
                handleSuccess={handleSuccessMenu}
            /> */}
               {/* modal end detail */}

               <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
                    <div className="flex flex-col">
                         <div className="flex bg-white mb-4 rounded-md p-4 gap-2">
                              <div
                                   className="bg-primary-adele w-fit p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => addMenuPopup(e)}
                              >
                                   <span>Add Menu</span>
                              </div>
                              <div
                                   className="ml-auto bg-primary-adele w-fit p-2 rounded-md text-white hover:bg-primary-hover-adele hover:cursor-pointer"
                                   onClick={(e) => addSequencePopup(e)}
                              >
                                   <span>Change Sequence</span>
                              </div>
                         </div>
                         <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
                              <TextInput
                                   type="text"
                                   value={searchMenu.menu_search[0].menu_name}
                                   className="mt-2 ring-1"
                                   onChange={(e) => {
                                        inputDataSearch(
                                             "menu_name",
                                             e.target.value,
                                             0
                                        );
                                        if (
                                             searchMenu.menu_search[0]
                                                  .menu_name === ""
                                        ) {
                                             inputDataSearch("flag", "flag", 0);
                                        } else {
                                             inputDataSearch("flag", "", 0);
                                        }
                                   }}
                                   onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                             const title =
                                                  searchMenu.menu_search[0]
                                                       .menu_name;
                                             const id =
                                                  searchMenu.menu_search[0].id;
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
                                                       "Get All Permission"
                                                  );
                                             }
                                        }
                                   }}
                                   // onKeyDo
                                   placeholder="Search Menu Name"
                              />
                              <div className="mt-4 flex justify-end gap-2">
                                   <div
                                        className="bg-primary-adele text-white p-2 w-fit rounded-md text-center hover:bg-primary-hover-adele cursor-pointer"
                                        onClick={() => {
                                             if (
                                                  searchMenu.menu_search[0]
                                                       .id === "" &&
                                                  searchMenu.menu_search[0]
                                                       .menu_name === ""
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
                                             setRefreshGrid("success");
                                             setTimeout(() => {
                                                  setRefreshGrid("");
                                             }, 1000);
                                        }}
                                   >
                                        Search
                                   </div>
                                   <div
                                        className="bg-primary-adele text-white p-2 w-fit rounded-md text-center hover:bg-primary-hover-adele cursor-pointer"
                                        onClick={() => {
                                             // Clear the search field and reset the flag
                                             inputDataSearch(
                                                  "menu_name",
                                                  "",
                                                  0
                                             );
                                             inputDataSearch("flag", "", 0);

                                             // Refresh the grid to show the default data (without search filters)
                                             setRefreshGrid("success");
                                             setTimeout(() => {
                                                  setRefreshGrid("");
                                             }, 1000);
                                        }}
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
                                   searchParam={searchMenu.menu_search}
                                   // loading={isLoading.get_policy}
                                   url={"getMenusJson"}
                                   doubleClickEvent={handleDetailMenu}
                                   triggeringRefreshData={isSuccess}
                                   colDefs={[
                                        {
                                             headerName: "No.",
                                             valueGetter: "node.rowIndex + 1",
                                             flex: 1.5,
                                        },
                                        {
                                             headerName: "Menu Name",
                                             field: "menu_name",
                                             flex: 7,
                                             cellStyle: (params: any) => {
                                                  if (
                                                       params.data &&
                                                       params.data
                                                            .menu_is_deleted ===
                                                            1
                                                  ) {
                                                       return { color: "red" };
                                                  }
                                                  return null;
                                             },
                                             // Tambahkan cellRenderer di sini untuk menambahkan teks (delete)
                                             cellRenderer: (params: any) => {
                                                  if (
                                                       params.data &&
                                                       params.data
                                                            .menu_is_deleted ===
                                                            1
                                                  ) {
                                                       return `${params.value} (delete)`;
                                                  }
                                                  return params.value;
                                             },
                                        },
                                        {
                                             headerName: "URL",
                                             field: "menu_url",
                                             flex: 4,
                                        },
                                        {
                                             headerName: "Parent",
                                             field: "menu_parent_id",
                                             flex: 3,
                                             valueGetter: (params: any) => {
                                                  // Return menu_parent_id for sorting purposes
                                                  return params.data
                                                       ? params.data
                                                              .menu_parent_id
                                                       : null;
                                             },
                                             cellRenderer: (params: any) => {
                                                  // Return parent menu name for display purposes
                                                  if (
                                                       params.data &&
                                                       params.data.parent &&
                                                       params.data.parent
                                                            .menu_name
                                                  ) {
                                                       return params.data.parent
                                                            .menu_name;
                                                  }
                                                  return "as parent"; // Default display if no parent
                                             },
                                        },
                                        {
                                             headerName: "Sequence",
                                             field: "menu_sequence",
                                             flex: 3,
                                        },
                                   ]}
                              />
                         </div>
                    </div>
               </div>
          </AuthenticatedLayout>
     );
}
