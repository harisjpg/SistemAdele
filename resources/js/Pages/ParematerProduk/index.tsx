import DatePickerFlowBite from "@/Components/DatePicker";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { FormEvent, useEffect, useState } from "react";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import DataTables from "@/Components/DataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loader from "@/Components/Loader";
import TextInput from "@/Components/TextInput";
import TextSearch from "@/Components/TextSearch";
import { ArrowPathIcon, EyeIcon } from "@heroicons/react/20/solid";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAction from "@/Components/Modal/ModalToAction";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Checkbox from "@/Components/Checkbox";
import Swal from "sweetalert2";

export default function ParameterProduk({ auth }: any) {
     // for Breadcrumbs
     const forBreadcrumbs = [
          { name: "Parameter Produk", href: "#", current: true },
     ];

     // for success alert
     const [isSuccess, setIsSuccess] = useState<string>("");

     // for modal add parent produk
     const [modalAddParent, setModalAddParent] = useState<any>({
          modalAdd: false,
          modalAddParameter: false,
          modalEditParameter: false,
     });
     // end for modal add parent produk

     // flag for category and uncategory
     const [category, setCategory] = useState<any>(false);
     // end flag for category adn uncategory

     // state for modal add parameter produk
     const [dataParameterProduk, setDataParameterProduk] = useState<any>({
          PARAMETER_PRODUK_NAME: "",
          PARAMETER_PRODUK_BOBOT: "",
          PARAMETER_PRODUK_PARENT: "",
          PARAMETER_PRODUK_IS_CATEGORY: "",
     });

     // get data parameter produk
     const [arrDataParameter, setArrDataParameter] = useState<any>([]);
     const getDataParameterProduk = async () => {
          await axios
               .post(`/getDataParameterProduk`, {})
               .then((res) => {
                    setArrDataParameter(res.data);
               })
               .catch((err) => {
                    console.log(err);
               });
     };
     // end get data parameter produk

     useEffect(() => {
          getDataParameterProduk();
     }, []);

     const selectParent = arrDataParameter?.map((query: any) => {
          return {
               value: query.PARAMETER_PRODUK_ID,
               label: query.PARAMETER_PRODUK_NAME,
          };
     });

     const handleSuccessTambahParameterProduk = async (message: any) => {
          setIsSuccess("");
          if (message != "") {
               setDataParameterProduk({
                    PARAMETER_PRODUK_NAME: "",
                    PARAMETER_PRODUK_BOBOT: "",
                    PARAMETER_PRODUK_PARENT: "",
                    PARAMETER_PRODUK_IS_CATEGORY: "",
               });
               getDataParameterProduk();
               setIsSuccess(message[0]);
               setTimeout(() => {
                    setIsSuccess("");
               }, 2000);
          }
     };

     const handleCheckCategory = async (e: any) => {
          const { checked } = e.target;

          if (checked) {
               setDataParameterProduk({
                    ...dataParameterProduk,
                    PARAMETER_PRODUK_IS_CATEGORY: 1,
               });
               setCategory(true);
          } else {
               setDataParameterProduk({
                    ...dataParameterProduk,
                    PARAMETER_PRODUK_IS_CATEGORY: "",
               });
               setCategory(false);
          }
     };

     // handle Menu Sub
     const handleClick = (i: any) => {
          const element = document.getElementById("item" + i);
          if (!element?.className) {
               element?.setAttribute("class", "hidden");
          } else {
               element?.setAttribute("class", "");
          }
     };
     // end handle menu sub

     // handle add parameter
     const handleClickAddParameter = async (
          e: FormEvent,
          idParameter: string
     ) => {
          e.preventDefault();
          setDataParameterProduk({
               ...dataParameterProduk,
               PARAMETER_PRODUK_PARENT: idParameter,
          });
          setModalAddParent({
               modalAdd: false,
               modalAddParameter: true,
               modalEditParameter: false,
          });
     };
     // end handle add parameter

     const checkCheckedCategory = (id: any) => {
          if (id === 1) {
               return true;
          }
     };

     function BasicInfo(dataChildrenNew: any): React.ReactElement {
          return (
               <>
                    {dataChildrenNew?.length !== 0
                         ? dataChildrenNew
                                ?.filter(
                                     (dataFilter: any) =>
                                          dataFilter.PARAMETER_PRODUK_IS_DELETED ===
                                          0
                                )
                                ?.map((dChilds: any, a: number) => (
                                     <div className="pt-1 pl-[0.32rem]" key={a}>
                                          <ul className="flex flex-col pl-4 font-semibold text-black border-l border-red-700 hover:cursor-pointer">
                                               <li>
                                                    <div
                                                         className="relative flex justify-between hover:text-red-600 w-fit"
                                                         onClick={() => {
                                                              handleClick(
                                                                   dChilds.PARAMETER_PRODUK_ID
                                                              );
                                                         }}
                                                    >
                                                         <div className="flex items-center justify-center pr-2">
                                                              <span
                                                                   className={
                                                                        dChilds.PARAMETER_PRODUK_IS_CATEGORY ===
                                                                        0
                                                                             ? "bg-green-500 h-3 w-3 rounded-full"
                                                                             : ""
                                                                   }
                                                              ></span>
                                                         </div>
                                                         <div className="flex items-center w-full gap-1">
                                                              <div className="text-sm ">
                                                                   <span>
                                                                        {
                                                                             dChilds.PARAMETER_PRODUK_NAME
                                                                        }
                                                                   </span>
                                                              </div>
                                                              <div className="text-xs text-slate-500">
                                                                   <span>
                                                                        {" "}
                                                                        /{" "}
                                                                        {new Intl.NumberFormat(
                                                                             "en-US",
                                                                             {
                                                                                  style: "decimal",
                                                                                  minimumFractionDigits: 2,
                                                                                  maximumFractionDigits: 2,
                                                                             }
                                                                        ).format(
                                                                             dChilds.PARAMETER_PRODUK_BOBOT
                                                                        )}
                                                                   </span>
                                                              </div>
                                                         </div>
                                                    </div>
                                                    <div
                                                         className="hidden"
                                                         key={a}
                                                         id={
                                                              "item" +
                                                              dChilds.PARAMETER_PRODUK_ID
                                                         }
                                                    >
                                                         <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                                              <li>
                                                                   <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                                        <div
                                                                             className="text-sm bg-green-500 p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                                                             onClick={(
                                                                                  e
                                                                             ) => {
                                                                                  handleClickEditParameter(
                                                                                       dChilds
                                                                                  );
                                                                             }}
                                                                        >
                                                                             <span>
                                                                                  Edit
                                                                             </span>
                                                                        </div>
                                                                        <div
                                                                             className="text-sm bg-primary-adele p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                             onClick={(
                                                                                  e
                                                                             ) =>
                                                                                  handleDeleteParameter(
                                                                                       dChilds
                                                                                  )
                                                                             }
                                                                        >
                                                                             <span>
                                                                                  Delete
                                                                             </span>
                                                                        </div>
                                                                   </div>
                                                              </li>
                                                         </ul>
                                                    </div>
                                                    {BasicInfo(
                                                         dChilds.children
                                                    )}
                                               </li>
                                          </ul>
                                     </div>
                                ))
                         : null}
               </>
          );
     }

     // for edit parameter produk
     const [dataEditParameterProduk, setDataEditParameterProduk] =
          useState<any>([]);

     const handleClickEditParameter = async (dataParameter: any) => {
          setDataEditParameterProduk(dataParameter);

          setModalAddParent({
               ...modalAddParent,
               modalAdd: false,
               modalAddParameter: false,
               modalEditParameter: true,
          });
     };
     // end for edit parameter produk

     const prosesDelete = async (dataParameter: any) => {
          await axios
               .post(`/deleteParameter`, { data: dataParameter })
               .then((res) => {
                    setIsSuccess("");
                    if (res.data.message != "") {
                         setDataParameterProduk({
                              PARAMETER_PRODUK_NAME: "",
                              PARAMETER_PRODUK_BOBOT: "",
                              PARAMETER_PRODUK_PARENT: "",
                              PARAMETER_PRODUK_IS_CATEGORY: "",
                         });
                         getDataParameterProduk();
                         setIsSuccess(res.data[0]);
                         setTimeout(() => {
                              setIsSuccess("");
                         }, 2000);
                    }
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const handleDeleteParameter = (dataParameter: any) => {
          Swal.fire({
               title: "Are you sure?",
               text: "You won't be able to revert this!",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Yes, delete it!",
          }).then((result: any) => {
               if (result.isConfirmed) {
                    prosesDelete(dataParameter);
               }
          });
     };

     const getLabelParent = (value: any) => {
          if (value) {
               const selected = selectParent.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     return (
          <AuthenticatedLayout user={auth.user} header={"Parameter Produk"}>
               <Head title={"Parameter Produk"} />

               {/* for alert success */}
               {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )}

               {/* add modal parent group  */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalAddParent.modalAdd}
                    onClose={() =>
                         setModalAddParent({
                              ...modalAddParent,
                              modalAdd: false,
                              modalAddParameter: false,
                              modalEditParameter: false,
                         })
                    }
                    title={
                         category
                              ? "Tambah Category Produk"
                              : "Tambah Parameter Produk"
                    }
                    url={`/addParameterProduk`}
                    data={dataParameterProduk}
                    onSuccess={handleSuccessTambahParameterProduk}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[35%]"
                    }
                    body={
                         <>
                              {/* form add parent parameter produk */}
                              <div className="grid grid-cols-1">
                                   <div>
                                        <InputLabel
                                             value={
                                                  category === true
                                                       ? "Nama Category"
                                                       : "Nama Parameter"
                                             }
                                             required={false}
                                        />
                                        <TextInput
                                             type="text"
                                             name="PARAMETER_PRODUK_NAME"
                                             value={
                                                  dataParameterProduk.PARAMETER_PRODUK_NAME
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataParameterProduk({
                                                       ...dataParameterProduk,
                                                       PARAMETER_PRODUK_NAME:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder={
                                                  category === true
                                                       ? "Nama Category"
                                                       : "Nama Parameter"
                                             }
                                        />
                                   </div>
                                   {category === false && (
                                        <div className="mt-2">
                                             <InputLabel
                                                  value="Nilai Bobot Parameter"
                                                  required={false}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="PARAMETER_PRODUK_BOBOT"
                                                  value={
                                                       dataParameterProduk.PARAMETER_PRODUK_BOBOT
                                                  }
                                                  className="ring-1"
                                                  onChange={(e) => {
                                                       setDataParameterProduk({
                                                            ...dataParameterProduk,
                                                            PARAMETER_PRODUK_BOBOT:
                                                                 e.target.value,
                                                       });
                                                  }}
                                                  required
                                                  autoComplete="off"
                                                  placeholder="0.00"
                                             />
                                        </div>
                                   )}
                                   <div className="flex gap-2 bg-white p-2 rounded-md shadow-md mt-4 ring-1 ring-primary-adele">
                                        <div>
                                             <Checkbox
                                                  name="PARAMETER_PRODUK_IS_CATEGORY"
                                                  id="PARAMETER_PRODUK_IS_CATEGORY"
                                                  value={
                                                       dataParameterProduk.PARAMETER_PRODUK_IS_CATEGORY
                                                  }
                                                  defaultChecked={checkCheckedCategory(
                                                       dataParameterProduk.PARAMETER_PRODUK_IS_CATEGORY
                                                  )}
                                                  onChange={(e) => {
                                                       handleCheckCategory(e);
                                                  }}
                                             />
                                        </div>
                                        <div className="text-sm flex items-center">
                                             <span>Is Category</span>
                                        </div>
                                   </div>
                              </div>
                              {/* end form add parent parameter produk */}
                         </>
                    }
               />
               {/* end add modal parent group */}

               {/* add modal parameter produk */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalAddParent.modalAddParameter}
                    onClose={() =>
                         setModalAddParent({
                              ...modalAddParent,
                              modalAdd: false,
                              modalAddParameter: false,
                              modalEditParameter: false,
                         })
                    }
                    title={"Tambah Parameter Produk"}
                    url={`/addParameterProduk`}
                    data={dataParameterProduk}
                    onSuccess={handleSuccessTambahParameterProduk}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[35%]"
                    }
                    body={
                         <>
                              {/* form add parent parameter produk */}
                              <div className="grid grid-cols-1">
                                   <div>
                                        <InputLabel
                                             value={"Nama Parameter"}
                                             required={false}
                                        />
                                        <TextInput
                                             type="text"
                                             name="PARAMETER_PRODUK_NAME"
                                             value={
                                                  dataParameterProduk.PARAMETER_PRODUK_NAME
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataParameterProduk({
                                                       ...dataParameterProduk,
                                                       PARAMETER_PRODUK_NAME:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder={"Nama Parameter"}
                                        />
                                   </div>
                                   <div className="mt-2">
                                        <InputLabel
                                             value="Nilai Bobot Parameter"
                                             required={false}
                                        />
                                        <TextInput
                                             type="text"
                                             name="PARAMETER_PRODUK_BOBOT"
                                             value={
                                                  dataParameterProduk.PARAMETER_PRODUK_BOBOT
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataParameterProduk({
                                                       ...dataParameterProduk,
                                                       PARAMETER_PRODUK_BOBOT:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder="0.00"
                                        />
                                   </div>
                              </div>
                              {/* end form add parent parameter produk */}
                         </>
                    }
               />
               {/* end add modal parameter produk */}

               {/* for edit modal parameter */}
               <ModalToAdd
                    buttonAddOns={""}
                    show={modalAddParent.modalEditParameter}
                    onClose={() =>
                         setModalAddParent({
                              ...modalAddParent,
                              modalAdd: false,
                              modalAddParameter: false,
                              modalEditParameter: false,
                         })
                    }
                    title={
                         dataEditParameterProduk.PARAMETER_PRODUK_IS_CATEGORY ===
                         0
                              ? "Edit Parameter Produk"
                              : "Edit Category Parameter"
                    }
                    url={`/editParameterProduk`}
                    data={dataEditParameterProduk}
                    onSuccess={handleSuccessTambahParameterProduk}
                    classPanel={
                         "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[35%]"
                    }
                    body={
                         <>
                              {/* form add parent parameter produk */}
                              <div className="grid grid-cols-1">
                                   {dataEditParameterProduk.PARAMETER_PRODUK_IS_CATEGORY ===
                                        0 && (
                                        <div>
                                             <InputLabel
                                                  value="Parent Category"
                                                  required={false}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                       menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                       listItem: ({
                                                            isSelected,
                                                       }: any) =>
                                                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                 isSelected
                                                                      ? `text-white bg-primary-adele`
                                                                      : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                            }`,
                                                  }}
                                                  options={selectParent}
                                                  isSearchable={true}
                                                  isClearable={true}
                                                  placeholder={"--Pilih--"}
                                                  value={
                                                       dataEditParameterProduk.PARAMETER_PRODUK_PARENT ===
                                                       null
                                                            ? null
                                                            : {
                                                                   label: getLabelParent(
                                                                        dataEditParameterProduk?.PARAMETER_PRODUK_PARENT
                                                                   ),
                                                                   value: dataEditParameterProduk?.PARAMETER_PRODUK_PARENT,
                                                              }
                                                  }
                                                  onChange={(e: any) => {
                                                       setDataEditParameterProduk(
                                                            {
                                                                 ...dataEditParameterProduk,
                                                                 PARAMETER_PRODUK_PARENT:
                                                                      e.value,
                                                            }
                                                       );
                                                  }}
                                                  primaryColor={
                                                       "bg-primary-adele"
                                                  }
                                             />
                                        </div>
                                   )}
                                   <div>
                                        <InputLabel
                                             value={
                                                  dataEditParameterProduk.PARAMETER_PRODUK_IS_CATEGORY ===
                                                  0
                                                       ? "Nama Parameter Produk"
                                                       : "Nama Category Parameter"
                                             }
                                             required={false}
                                        />
                                        <TextInput
                                             type="text"
                                             name="PARAMETER_PRODUK_NAME"
                                             value={
                                                  dataEditParameterProduk.PARAMETER_PRODUK_NAME
                                             }
                                             className="ring-1"
                                             onChange={(e) => {
                                                  setDataEditParameterProduk({
                                                       ...dataEditParameterProduk,
                                                       PARAMETER_PRODUK_NAME:
                                                            e.target.value,
                                                  });
                                             }}
                                             required
                                             autoComplete="off"
                                             placeholder={"Nama Parameter"}
                                        />
                                   </div>
                                   {dataEditParameterProduk.PARAMETER_PRODUK_IS_CATEGORY ===
                                        0 && (
                                        <div className="mt-2">
                                             <InputLabel
                                                  value="Nilai Bobot Parameter"
                                                  required={false}
                                             />
                                             <TextInput
                                                  type="text"
                                                  name="PARAMETER_PRODUK_BOBOT"
                                                  value={
                                                       dataEditParameterProduk.PARAMETER_PRODUK_BOBOT ??
                                                       ""
                                                  }
                                                  className="ring-1 text-right"
                                                  onChange={(e) => {
                                                       const val =
                                                            e.target.value;

                                                       // Boleh kosong atau angka dengan max 2 digit di belakang koma
                                                       const regex =
                                                            /^(\d+)?(\.\d{0,2})?$/;

                                                       if (
                                                            regex.test(val) ||
                                                            val === ""
                                                       ) {
                                                            setDataEditParameterProduk(
                                                                 {
                                                                      ...dataEditParameterProduk,
                                                                      PARAMETER_PRODUK_BOBOT:
                                                                           val,
                                                                 }
                                                            );
                                                       }
                                                  }}
                                                  required
                                                  autoComplete="off"
                                                  placeholder="0.00"
                                             />
                                        </div>
                                   )}
                              </div>
                              {/* end form add parent parameter produk */}
                         </>
                    }
               />
               {/* end for edit modal parameter */}

               {/* section Parameter Produk */}
               <section>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                         <div>
                              <span className="text-lg font-bold text-primary-adele">
                                   Parameter Produk
                              </span>
                         </div>
                         <div>
                              <Breadcrumbs forBreadcrumbs={forBreadcrumbs} />
                         </div>
                    </div>
                    {/* End Header */}
                    {/* body section*/}
                    <div className="bg-white mt-6 p-4 rounded-md content-body overflow-y-auto custom-scrollbar">
                         {/* Content */}
                         <div className="flex items-center justify-between">
                              <div
                                   className="text-sm font-semibold hover:cursor-pointer hover:bg-primary-hover-adele bg-primary-adele w-fit p-2 text-white rounded-md mb-2 sticky top-0 z-50"
                                   onClick={(e) => {
                                        setModalAddParent({
                                             ...modalAddParent,
                                             modalAdd: true,
                                             modalAddParameter: false,
                                             modalEditParameter: false,
                                        });
                                        setDataParameterProduk({
                                             ...dataParameterProduk,
                                             PARAMETER_PRODUK_IS_CATEGORY: 1,
                                        });
                                        setCategory(true);
                                   }}
                              >
                                   Tambah Category Parameter
                              </div>
                              <div className="flex">
                                   <div className="flex items-center justify-center pr-2 text-sm font-semibold">
                                        <span
                                             className={
                                                  "bg-red-500 h-3 w-3 rounded-full mr-2"
                                             }
                                        ></span>
                                        : Parameter Category
                                   </div>
                                   <div className="flex items-center justify-center pr-2 text-sm font-semibold">
                                        <span
                                             className={
                                                  "bg-green-500 h-3 w-3 rounded-full mr-2"
                                             }
                                        ></span>
                                        : Parameter Produk
                                   </div>
                              </div>
                         </div>
                         <div>
                              <ul className="flex flex-col space-y-0 text-lg">
                                   {arrDataParameter
                                        ?.filter(
                                             (dataFilter: any) =>
                                                  dataFilter.PARAMETER_PRODUK_IS_DELETED ===
                                                       0 &&
                                                  dataFilter.PARAMETER_PRODUK_IS_CATEGORY ===
                                                       1
                                        )
                                        ?.map((item: any, i: number) => (
                                             <li className="" key={i}>
                                                  <div
                                                       className="relative flex justify-between font-semibold text-black hover:text-red-600 w-fit hover:cursor-pointer"
                                                       // onClick={(e) => {
                                                       //     e.preventDefault();
                                                       //     const bb =
                                                       //         document.getElementById(
                                                       //             "item" + i
                                                       //         );
                                                       //     bb?.hidden === false;
                                                       // }}
                                                       onClick={() => {
                                                            handleClick(
                                                                 item.PARAMETER_PRODUK_ID
                                                            );
                                                       }}
                                                  >
                                                       <div className="flex items-center justify-center pr-2">
                                                            <span
                                                                 className={
                                                                      "bg-red-500 h-3 w-3 rounded-full"
                                                                 }
                                                            ></span>
                                                       </div>
                                                       <div className="flex items-center w-full gap-1">
                                                            <div className="text-sm p-2">
                                                                 <span>
                                                                      {
                                                                           item.PARAMETER_PRODUK_NAME
                                                                      }
                                                                 </span>
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div
                                                       className="hidden"
                                                       key={i}
                                                       id={
                                                            "item" +
                                                            item.PARAMETER_PRODUK_ID
                                                       }
                                                  >
                                                       <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                                            <li>
                                                                 <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                                      <>
                                                                           <div
                                                                                className="text-sm bg-green-700 p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                                onClick={(
                                                                                     e
                                                                                ) =>
                                                                                     handleClickAddParameter(
                                                                                          e,
                                                                                          item.PARAMETER_PRODUK_ID
                                                                                     )
                                                                                }
                                                                           >
                                                                                <span>
                                                                                     Tambah
                                                                                     Parameter
                                                                                </span>
                                                                           </div>
                                                                           <div
                                                                                className="text-sm bg-blue-700 p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                                onClick={(
                                                                                     e
                                                                                ) =>
                                                                                     handleClickEditParameter(
                                                                                          item
                                                                                     )
                                                                                }
                                                                           >
                                                                                <span>
                                                                                     Edit
                                                                                </span>
                                                                           </div>
                                                                           <div
                                                                                className="text-sm bg-primary-adele p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                                onClick={(
                                                                                     e
                                                                                ) =>
                                                                                     handleDeleteParameter(
                                                                                          item
                                                                                     )
                                                                                }
                                                                           >
                                                                                <span>
                                                                                     Delete
                                                                                </span>
                                                                           </div>
                                                                      </>
                                                                 </div>
                                                            </li>
                                                       </ul>
                                                  </div>
                                                  {BasicInfo(item.children)}
                                             </li>
                                        ))}
                              </ul>
                         </div>
                         <div>
                              <div>
                                   <ul className="flex flex-col space-y-0 text-lg">
                                        {arrDataParameter
                                             ?.filter(
                                                  (dataFilter: any) =>
                                                       dataFilter.PARAMETER_PRODUK_IS_CATEGORY ===
                                                            0 &&
                                                       dataFilter.PARAMETER_PRODUK_IS_DELETED ===
                                                            0
                                             )
                                             ?.map((item: any, i: number) => (
                                                  <>
                                                       <div className="mt-2 font-semibold border-b-2 w-fit border-primary-adele">
                                                            <span>
                                                                 Belum
                                                                 Dikategorikan
                                                            </span>
                                                       </div>
                                                       <li className="" key={i}>
                                                            <div
                                                                 className="relative flex justify-between font-semibold text-black hover:text-red-600 w-fit hover:cursor-pointer"
                                                                 // onClick={(e) => {
                                                                 //     e.preventDefault();
                                                                 //     const bb =
                                                                 //         document.getElementById(
                                                                 //             "item" + i
                                                                 //         );
                                                                 //     bb?.hidden === false;
                                                                 // }}
                                                                 onClick={() => {
                                                                      handleClick(
                                                                           item.PARAMETER_PRODUK_ID
                                                                      );
                                                                 }}
                                                            >
                                                                 <div className="flex items-center justify-center pr-2">
                                                                      <span
                                                                           className={
                                                                                item.PARAMETER_PRODUK_IS_CATEGORY ===
                                                                                0
                                                                                     ? "bg-green-500 h-3 w-3 rounded-full"
                                                                                     : "bg-red-500 h-3 w-3 rounded-full"
                                                                           }
                                                                      ></span>
                                                                 </div>
                                                                 <div className="flex items-center w-full gap-1">
                                                                      <div className="text-sm p-2">
                                                                           {item.PARAMETER_PRODUK_IS_CATEGORY ===
                                                                           1 ? (
                                                                                <span>
                                                                                     {
                                                                                          item.PARAMETER_PRODUK_NAME
                                                                                     }
                                                                                </span>
                                                                           ) : (
                                                                                <div>
                                                                                     <span>
                                                                                          {
                                                                                               item.PARAMETER_PRODUK_NAME
                                                                                          }
                                                                                     </span>
                                                                                     <span className="text-slate-400 text-xs">
                                                                                          {" "}
                                                                                          /{" "}
                                                                                          {new Intl.NumberFormat(
                                                                                               "en-US",
                                                                                               {
                                                                                                    style: "decimal",
                                                                                                    minimumFractionDigits: 2,
                                                                                                    maximumFractionDigits: 2,
                                                                                               }
                                                                                          ).format(
                                                                                               item.PARAMETER_PRODUK_BOBOT
                                                                                          )}
                                                                                     </span>
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                            <div
                                                                 className="hidden"
                                                                 key={i}
                                                                 id={
                                                                      "item" +
                                                                      item.PARAMETER_PRODUK_ID
                                                                 }
                                                            >
                                                                 <ul className="flex flex-col pl-4 ml-[0.30rem] text-gray-500 border-l border-red-700">
                                                                      <li>
                                                                           <div className="bg-gray-200 w-fit p-4 rounded-md flex gap-2 items-center transition delay-700 duration-300 ease-in-out">
                                                                                {item.PARAMETER_PRODUK_IS_CATEGORY ===
                                                                                1 ? (
                                                                                     <>
                                                                                          <div
                                                                                               className="text-sm bg-primary-adele p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                                               onClick={(
                                                                                                    e
                                                                                               ) =>
                                                                                                    handleClickAddParameter(
                                                                                                         e,
                                                                                                         item.PARAMETER_PRODUK_ID
                                                                                                    )
                                                                                               }
                                                                                          >
                                                                                               <span>
                                                                                                    Tambah
                                                                                                    Parameter
                                                                                               </span>
                                                                                          </div>
                                                                                          <div
                                                                                               className="text-sm bg-primary-adele p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                                               onClick={(
                                                                                                    e
                                                                                               ) =>
                                                                                                    handleClickEditParameter(
                                                                                                         item
                                                                                                    )
                                                                                               }
                                                                                          >
                                                                                               <span>
                                                                                                    Edit
                                                                                               </span>
                                                                                          </div>
                                                                                     </>
                                                                                ) : (
                                                                                     <>
                                                                                          <div
                                                                                               className="text-sm bg-green-500 p-2 rounded-md text-white cursor-pointer hover:bg-red-400"
                                                                                               onClick={(
                                                                                                    e
                                                                                               ) => {
                                                                                                    handleClickEditParameter(
                                                                                                         item
                                                                                                    );
                                                                                               }}
                                                                                          >
                                                                                               <span>
                                                                                                    Edit
                                                                                               </span>
                                                                                          </div>
                                                                                          <div
                                                                                               className="text-sm bg-primary-adele p-2 rounded-md text-white cursor-pointer hover:bg-primary-hover-adele"
                                                                                               onClick={(
                                                                                                    e
                                                                                               ) =>
                                                                                                    handleDeleteParameter(
                                                                                                         item
                                                                                                    )
                                                                                               }
                                                                                          >
                                                                                               <span>
                                                                                                    Delete
                                                                                               </span>
                                                                                          </div>
                                                                                     </>
                                                                                )}
                                                                           </div>
                                                                      </li>
                                                                 </ul>
                                                            </div>
                                                            {BasicInfo(
                                                                 item.children
                                                            )}
                                                       </li>
                                                  </>
                                             ))}
                                   </ul>
                              </div>
                         </div>
                         {/* End Content */}
                    </div>
                    {/* end body section */}
               </section>
          </AuthenticatedLayout>
     );
}
