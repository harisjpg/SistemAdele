import DatePickerFlowBite from "@/Components/DatePicker";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import dateFormat from "dateformat";
import SelectTailwind from "react-tailwindcss-select";
import DataTables from "@/Components/DataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loader from "@/Components/Loader";

export default function LaporanPengajuan({ auth }: any) {
     const { arrJenisAsuransi, arrStatusPengajuan, arrStatusProses }: any =
          usePage().props;
     const selectInsurance = arrJenisAsuransi?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });
     const selectPengajuan = arrStatusPengajuan?.map((query: any) => {
          return {
               value: query.staging_pengajuan_id,
               label: query.staging_pengajuan_name,
          };
     });
     const selectStatusProses = arrStatusProses?.map((query: any) => {
          return {
               value: query.offer_status_id,
               label: query.offer_status_name,
          };
     });
     // data for filtering data
     const [dataFiltering, setDataFiltering] = useState<any>({
          START_DATE: "",
          END_DATE: "",
          JENIS_INSURANCE: null,
          STATUS_PENGAJUAN: null,
          STATUS_PROSES: null,
     });
     // end data for filtering data

     // for refresh table
     const [refreshTrigger, setRefreshTrigger] = useState<string>("");
     // end for refresh table

     const [loaderFetch, setLoaderFetch] = useState<boolean>(false);
     // for generate excel
     const handleForGenerateExcel = async (e: FormEvent) => {
          setLoaderFetch(true);
          e.preventDefault();
          await axios
               .post(
                    `/getGenerateExcel`,
                    { dataFiltering },
                    { responseType: "blob" }
               )
               .then((res) => {
                    setLoaderFetch(false);
                    const date = new Date();
                    const blob = res.data;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download =
                         date.toLocaleDateString("en-CA") +
                         " - LaporanPengajuan.xlsx"; // Set the default download filename
                    link.click(); // Trigger the file download
                    window.URL.revokeObjectURL(url); // Clean up the object URL
               })
               .catch((err) => {
                    console.log(err);
               });
     };
     // end for generate excel
     return (
          <AuthenticatedLayout user={auth.user} header={"Laporan Pengajuan"}>
               <Head title={"Laporan Pengajuan"} />
               {/* for alert success */}
               {/* {isSuccess && (
                    <ToastMessage
                         message={isSuccess}
                         isShow={true}
                         type={"success"}
                    />
               )} */}
               {/* Section Penutupan */}
               {/* for section laporan pengajuan */}

               {loaderFetch && <Loader />}

               <section>
                    <div
                         className={`grid xs:grid-cols-1 xs:gap-0 lg:grid-cols-5 lg:gap-4`}
                    >
                         <div className="col bg-white p-2 rounded-md shadow-md xs:mb-2 lg:mb-0">
                              <div>
                                   <InputLabel
                                        value="Start Date"
                                        required={true}
                                   />
                                   <DatePickerFlowBite
                                        value={
                                             dataFiltering.START_DATE
                                                  ? dateFormat(
                                                         dataFiltering.START_DATE,
                                                         "dd mmm yyyy"
                                                    )
                                                  : "Start Date"
                                        }
                                        onSelectedDateChanged={(date: Date) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  START_DATE:
                                                       date.toLocaleDateString(
                                                            "en-CA"
                                                       ),
                                             });
                                        }}
                                        className={
                                             "ring-1 rounded-md focus:!ring-primary-adele"
                                        }
                                   />
                              </div>
                              <div className="mt-2">
                                   <InputLabel
                                        value="End Date"
                                        required={true}
                                   />
                                   <DatePickerFlowBite
                                        value={
                                             dataFiltering.END_DATE
                                                  ? dateFormat(
                                                         dataFiltering.END_DATE,
                                                         "dd mmm yyyy"
                                                    )
                                                  : "End Date"
                                        }
                                        onSelectedDateChanged={(date: Date) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  END_DATE:
                                                       date.toLocaleDateString(
                                                            "en-CA"
                                                       ),
                                             });
                                        }}
                                        className={
                                             "ring-1 rounded-md focus:!ring-primary-adele"
                                        }
                                   />
                              </div>
                              <div className="mt-2">
                                   <InputLabel value="Asuransi" />
                                   <SelectTailwind
                                        classNames={{
                                             // Menggunakan truncate dan max-w-full pada menuButton untuk memastikan teks tidak keluar dari input
                                             menuButton: () =>
                                                  `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 text-wrap max-w-full truncate`, // Menambahkan truncate dan max-w-full

                                             // Menu dropdown tetap sama, jika ada masalah pada dropdown, kamu bisa sesuaikan lagi
                                             menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",

                                             // Menyesuaikan listItem seperti sebelumnya untuk opsi dropdown
                                             listItem: ({ isSelected }: any) =>
                                                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                       isSelected
                                                            ? `text-white bg-primary-adele`
                                                            : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                  }`,
                                        }}
                                        options={selectInsurance}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={"--Pilih--"}
                                        value={dataFiltering.JENIS_INSURANCE}
                                        onChange={(e: any) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  JENIS_INSURANCE: e,
                                             });
                                        }}
                                        primaryColor={"bg-primary-adele"}
                                   />
                              </div>
                              <div className="mt-2">
                                   <InputLabel value="Status Pengajuan" />
                                   <SelectTailwind
                                        classNames={{
                                             // Menggunakan truncate dan max-w-full pada menuButton untuk memastikan teks tidak keluar dari input
                                             menuButton: () =>
                                                  `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 text-wrap max-w-full truncate`, // Menambahkan truncate dan max-w-full

                                             // Menu dropdown tetap sama, jika ada masalah pada dropdown, kamu bisa sesuaikan lagi
                                             menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",

                                             // Menyesuaikan listItem seperti sebelumnya untuk opsi dropdown
                                             listItem: ({ isSelected }: any) =>
                                                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                       isSelected
                                                            ? `text-white bg-primary-adele`
                                                            : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                  }`,
                                        }}
                                        options={selectPengajuan}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={"--Pilih--"}
                                        value={dataFiltering.STATUS_PENGAJUAN}
                                        onChange={(e: any) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  STATUS_PENGAJUAN: e,
                                             });
                                        }}
                                        primaryColor={"bg-primary-adele"}
                                   />
                              </div>
                              <div className="mt-2">
                                   <InputLabel value="Status Proses" />
                                   <SelectTailwind
                                        classNames={{
                                             // Menggunakan truncate dan max-w-full pada menuButton untuk memastikan teks tidak keluar dari input
                                             menuButton: () =>
                                                  `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 text-wrap max-w-full truncate`, // Menambahkan truncate dan max-w-full

                                             // Menu dropdown tetap sama, jika ada masalah pada dropdown, kamu bisa sesuaikan lagi
                                             menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",

                                             // Menyesuaikan listItem seperti sebelumnya untuk opsi dropdown
                                             listItem: ({ isSelected }: any) =>
                                                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                       isSelected
                                                            ? `text-white bg-primary-adele`
                                                            : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                  }`,
                                        }}
                                        options={selectStatusProses}
                                        isSearchable={true}
                                        isClearable={true}
                                        placeholder={"--Pilih--"}
                                        value={dataFiltering.STATUS_PROSES}
                                        onChange={(e: any) => {
                                             setDataFiltering({
                                                  ...dataFiltering,
                                                  STATUS_PROSES: e,
                                             });
                                        }}
                                        primaryColor={"bg-primary-adele"}
                                   />
                              </div>
                              <div className="flex justify-end gap-1 mt-2">
                                   <div
                                        className="bg-primary-adele text-white p-2 rounded-md hover:bg-blue-500 hover:cursor-pointer"
                                        onClick={() => {
                                             setDataFiltering({
                                                  START_DATE: "",
                                                  END_DATE: "",
                                                  JENIS_INSURANCE: null,
                                                  STATUS_PENGAJUAN: null,
                                                  STATUS_PROSES: null,
                                             });
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   >
                                        <span>Clear Search</span>
                                   </div>
                                   <div
                                        className="bg-primary-adele text-white p-2 rounded-md hover:bg-blue-500 hover:cursor-pointer"
                                        onClick={() => {
                                             setRefreshTrigger("success");
                                             setTimeout(() => {
                                                  setRefreshTrigger("");
                                             }, 1000);
                                        }}
                                   >
                                        <span>Search</span>
                                   </div>
                              </div>
                         </div>
                         <div className="col col-span-4 bg-white shadow-md rounded-md p-2 ag-grid-layouts">
                              <div className="grid grid-cols-1 mb-2">
                                   <div className="flex justify-end gap-1">
                                        <div
                                             className="bg-green-800 text-white p-2 rounded-md shadow-md w-24 flex gap-2 items-center justify-center hover:cursor-pointer hover:bg-green-600"
                                             onClick={(e) => {
                                                  handleForGenerateExcel(e);
                                             }}
                                        >
                                             <div>
                                                  <FontAwesomeIcon
                                                       icon={faFileExcel}
                                                  />
                                             </div>
                                             <div>
                                                  <span>Export</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div>
                                   <DataTables
                                        columns={[
                                             {
                                                  name: "Kode Aplikasi",
                                                  selector: (row: any) => {
                                                       var display = "";
                                                       var bankInsuranceId =
                                                            row.BANK_INSURANCE_ID;
                                                       var usia =
                                                            row.OFFER_AGE_ON_DUE_DATE.trim();
                                                       var usiaAge =
                                                            row.THE_INSURED_AGE;
                                                       var loanType =
                                                            row.LOAN_TYPE_ID;

                                                       var tglLahir =
                                                            row.THE_INSURED_DATE_OF_BIRTH;
                                                       var tglAkhirKredit =
                                                            row.OFFER_DUE_DATE;

                                                       var convertTglLahir =
                                                            new Date(tglLahir);
                                                       var converTglAkhirKredit =
                                                            new Date(
                                                                 tglAkhirKredit
                                                            );

                                                       let age =
                                                            converTglAkhirKredit.getFullYear() -
                                                            convertTglLahir.getFullYear();
                                                       let month =
                                                            converTglAkhirKredit.getMonth() -
                                                            convertTglLahir.getMonth();
                                                       let day =
                                                            converTglAkhirKredit.getDate() -
                                                            convertTglLahir.getDate();

                                                       if (day < 0) {
                                                            month -= 1; // Pinjam satu month
                                                            let bulanSebelumnya =
                                                                 new Date(
                                                                      converTglAkhirKredit.getFullYear(),
                                                                      converTglAkhirKredit.getMonth(),
                                                                      0
                                                                 );
                                                            day +=
                                                                 bulanSebelumnya.getDate(); // Tambahkan jumlah hari month sebelumnya
                                                       }

                                                       if (month < 0) {
                                                            age -= 1; // Pinjam satu tahun
                                                            month += 12; // Tambahkan 12 bulan
                                                       }

                                                       if (
                                                            usia ==
                                                            "NaN Tahun NaN Bulan NaN Hari"
                                                       ) {
                                                            display += "-";
                                                       } else {
                                                            if (
                                                                 loanType >=
                                                                      "14" &&
                                                                 loanType <=
                                                                      "17" &&
                                                                 usiaAge >
                                                                      "55" &&
                                                                 bankInsuranceId ==
                                                                      null
                                                            ) {
                                                                 display += "-";
                                                            } else {
                                                                 if (
                                                                      age >=
                                                                           70 &&
                                                                      month >=
                                                                           0 &&
                                                                      day >= 0
                                                                 ) {
                                                                      if (
                                                                           age ==
                                                                                70 &&
                                                                           month ==
                                                                                0 &&
                                                                           day ==
                                                                                0
                                                                      ) {
                                                                           display +=
                                                                                row.OFFER_SUBMISSION_CODE;
                                                                      } else {
                                                                           // if (bankInsuranceId != null) {
                                                                           //     display += row.OFFER_SUBMISSION_CODE;
                                                                           // } else {
                                                                           display +=
                                                                                "-";
                                                                           // }
                                                                      }
                                                                 } else {
                                                                      display +=
                                                                           row.OFFER_SUBMISSION_CODE;
                                                                 }
                                                            }
                                                       }
                                                       return display;
                                                  },
                                                  // selector: (row: any) =>
                                                  //      row.BUSINESS_LIST_SUBMISSION_CODE,
                                                  sortable: true,
                                                  width: "210px",
                                             },
                                             {
                                                  name: "Status Proses",
                                                  selector: (row: any) =>
                                                       row.offer_status_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "164px",
                                             },
                                             {
                                                  name: "Status Pengajuan",
                                                  selector: (row: any) =>
                                                       row.staging_pengajuan_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "250px",
                                             },
                                             {
                                                  name: "Nama Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "240px",
                                             },
                                             {
                                                  name: "Tgl Lahir",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.THE_INSURED_DATE_OF_BIRTH,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Usia Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_AGE,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Usia Debitur Saat Jatuh Tempo",
                                                  selector: (row: any) =>
                                                       row.OFFER_AGE_ON_DUE_DATE,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "300px",
                                             },
                                             {
                                                  name: "NIK Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_ID_NUMBER,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "170px",
                                             },
                                             {
                                                  name: "Jenis Asuransi",
                                                  selector: (row: any) =>
                                                       row.JENIS_ASURANSI_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Sumber Pembayaran",
                                                  selector: (row: any) =>
                                                       row.TARIF_PAYROLL_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "220px",
                                             },
                                             {
                                                  name: "Tgl Awal Kredit",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.OFFER_INCEPTION_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Tgl Akhir Kredit",
                                                  selector: (row: any) =>
                                                       dateFormat(
                                                            row.OFFER_DUE_DATE,
                                                            "dd mmm yyyy"
                                                       ),
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Tenor",
                                                  selector: (row: any) =>
                                                       row.OFFER_TENOR,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Nilai Pertanggungan",
                                                  selector: (row: any) =>
                                                       row.OFFER_SUM_INSURED,
                                                  format: (row: any) => {
                                                       return new Intl.NumberFormat(
                                                            "en-US",
                                                            {
                                                                 style: "decimal",
                                                                 minimumFractionDigits: 2,
                                                                 maximumFractionDigits: 2,
                                                            }
                                                       ).format(
                                                            row.OFFER_SUM_INSURED
                                                       );
                                                  },
                                                  right: "true",
                                                  sortable: true,
                                                  width: "220px",
                                             },
                                             {
                                                  name: "Kode Cabang",
                                                  selector: (row: any) =>
                                                       row.OFFER_BANK_BRANCH_CODE,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Nama Cabang",
                                                  selector: (row: any) =>
                                                       row.OFFER_BANK_BRANCH_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Kode Office",
                                                  selector: (row: any) =>
                                                       row.OFFER_BANK_OFFICE_CODE,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Nama Office",
                                                  selector: (row: any) =>
                                                       row.OFFER_BANK_OFFICE_NAME,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "190px",
                                             },
                                             {
                                                  name: "Loan Type",
                                                  selector: (row: any) =>
                                                       row.loan_type_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Produk",
                                                  selector: (row: any) =>
                                                       row.product_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Sub Produk",
                                                  selector: (row: any) =>
                                                       row.scheme_name,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "CIF Debitur",
                                                  selector: (row: any) =>
                                                       row.THE_INSURED_CIF,
                                                  // right: "true",
                                                  sortable: true,
                                                  width: "140px",
                                             },
                                             {
                                                  name: "Created",
                                                  selector: (row: any) =>
                                                       row.user_login +
                                                       ", " +
                                                       dateFormat(
                                                            row.OFFER_CREATED_DATE,
                                                            "dd mmm yyyy HH:MM:ss"
                                                       ),
                                                  sortable: true,
                                                  width: "240px",
                                             },
                                        ]}
                                        url={"/getDataLaporanPengajuan"}
                                        search={dataFiltering}
                                        refreshTrigger={refreshTrigger}
                                        handleDoubleClick={undefined}
                                   />
                              </div>
                         </div>
                    </div>
               </section>
               {/* end for section laporan pengajuan */}

               {/* End Section Penutupan */}
          </AuthenticatedLayout>
     );
}
