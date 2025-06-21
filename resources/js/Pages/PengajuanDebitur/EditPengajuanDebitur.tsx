import Checkbox from "@/Components/Checkbox";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectTailwind from "react-tailwindcss-select";
import {
     FormEvent,
     PropsWithChildren,
     useEffect,
     useRef,
     useState,
} from "react";
import CurrencyInput from "react-currency-input-field";
import dateFormat from "dateformat";
import DatePickerFlowBite from "@/Components/DatePicker";
import axios from "axios";
import {
     ArrowDownTrayIcon,
     ArrowUpTrayIcon,
     PencilSquareIcon,
     XMarkIcon,
} from "@heroicons/react/20/solid";

export default function EditPengajuanDebitur({
     auth,
     dataEditPengajuan,
     setDataEditPengajuan,
     insuranceType,
     tarifPayroll,
     loanType,
     arrMaritalStatus,
}: PropsWithChildren<{
     auth: any;
     dataEditPengajuan: any;
     setDataEditPengajuan: any;
     insuranceType: any;
     tarifPayroll: any;
     loanType: any;
     arrMaritalStatus: any;
}>) {
     // for data jenis asuransi
     const selectInsurance = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });
     // end for data jenis asuransi

     const arrayGender = [
          {
               id: "1",
               name: "Female",
          },
          {
               id: "2",
               name: "Male",
          },
     ];

     const selectMarital = arrMaritalStatus?.map((query: any) => {
          return {
               value: query.MARITAL_STATUS_SELECT,
               label: query.MARITAL_STATUS_NAME,
          };
     });

     const selectGender = arrayGender?.map((query: any) => {
          return {
               value: query.id,
               label: query.name,
          };
     });

     const getInsuranceTypeValue = (value: any) => {
          if (value) {
               const selected = selectInsurance.filter(
                    (option: any) => option.value === value
               );
               return selected[0]?.label;
          }
     };

     const selectTarifPayroll = tarifPayroll?.map((query: any) => {
          return {
               value: query.TARIF_PAYROLL_ID,
               label: query.TARIF_PAYROLL_NAME,
          };
     });

     const getTerifPayroll = (value: any) => {
          if (value) {
               const selected = selectTarifPayroll.filter(
                    (option: any) => option.value === value
               );
               return selected[0]?.label;
          }
     };

     const selectLoanType = loanType?.map((query: any) => {
          return {
               value: query.loan_type_id,
               label: query.loan_type_name,
          };
     });

     const getLoanTypeValue = (value: any) => {
          if (value) {
               const selected = selectLoanType.filter(
                    (option: any) => option.value === value
               );
               return selected[0]?.label;
          }
     };

     const getGenderDebitur = (value: any) => {
          if (value) {
               const selected = selectGender.filter(
                    (option: any) =>
                         option.value.toString() === value.toString()
               );
               return selected[0]?.label;
          }
     };

     const getMaritalStatus = (value: any) => {
          const selected = selectMarital.filter(
               (option: any) => option.value.toString() === value.toString()
          );
          return selected[0]?.label;
     };

     const inputDataDebitur = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataEditPengajuan.data_debitur];
          changeVal[i][name] = value;
          setDataEditPengajuan({
               ...dataEditPengajuan,
               data_debitur: changeVal,
          });
     };

     const inputDataKredit = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataEditPengajuan.data_kredit];
          changeVal[i][name] = value;
          setDataEditPengajuan({
               ...dataEditPengajuan,
               data_kredit: changeVal,
          });
     };

     const handleTglLahir = (date: Date) => {
          inputDataDebitur("TGL_LAHIR", date.toLocaleDateString("en-CA"), 0);
     };

     const handleDateTglRencana = async (date: Date) => {
          inputDataKredit(
               "RENCANA_TANGGAL_PENCAIRAN",
               date.toLocaleDateString("en-CA"),
               0
          );

          // perhitungan usia ketika tanggal pencairan
          let tglLahir = dataEditPengajuan.data_debitur[0].TGL_LAHIR;
          let dob: any = new Date(tglLahir);
          let today: any = new Date(date.toLocaleDateString("en-CA"));

          // Menghitung usia berdasarkan tahun
          let age: any = today.getFullYear() - dob.getFullYear();

          // Mengecek apakah ulang tahun sudah lewat atau belum
          const currentMonth = today.getMonth();
          const currentDate = today.getDate();
          const birthMonth = dob.getMonth();
          const birthDay = dob.getDate();

          if (
               currentMonth < birthMonth ||
               (currentMonth === birthMonth && currentDate < birthDay)
          ) {
               age--;
          }
          inputDataDebitur("USIA_DEBITUR", age, 0);
          // end perhitungan usia ketika tanggal pencairan

          // perhitungan usia tempo dan tanggal akhir menggunakan tenor
          let cekTenor = dataEditPengajuan.data_kredit[0].TENOR;
          if (cekTenor !== "") {
               let convertTanggalAwal = new Date(today);
               let akhir = convertTanggalAwal.setMonth(
                    convertTanggalAwal.getMonth() + parseInt(cekTenor)
               );
               let akhirDate = new Date(akhir);

               inputDataKredit(
                    "TGL_AKHIR_KREDIT",
                    akhirDate.toLocaleDateString("en-CA"),
                    0
               );

               // get usia jatuh tempo

               // let tglLahir = dataEditPengajuan.data_debitur[0].TGL_LAHIR;
               // let dob: any = new Date(tglLahir);
               let tahun = akhirDate.getFullYear() - dob.getFullYear();
               let bulan = akhirDate.getMonth() - dob.getMonth();
               let hari = akhirDate.getDate() - dob.getDate();

               if (hari < 0) {
                    bulan -= 1; // Pinjam satu bulan
                    let bulanSebelumnya = new Date(
                         akhirDate.getFullYear(),
                         akhirDate.getMonth(),
                         0
                    );
                    hari += bulanSebelumnya.getDate(); // Tambahkan jumlah hari bulan sebelumnya
               }

               if (bulan < 0) {
                    tahun -= 1; // Pinjam satu tahun
                    bulan += 12; // Tambahkan 12 bulan
               }

               var resultUmurJatuhTempo =
                    tahun + " Tahun " + bulan + " Bulan " + hari + " Hari";
               inputDataKredit("USIA_JATUH_TEMPO", resultUmurJatuhTempo, 0);

               // end get usia jatuh tempo
          }
     };

     const getProdukSubProduk = async (idLoanType: any) => {
          await axios
               .post(`/getProdukSubProduk`, { idLoanType })
               .then((res) => {
                    inputDataKredit("PRODUK", res.data[0]["product_name"], 0);
                    inputDataKredit(
                         "SUB_PRODUK",
                         res.data[0]["scheme_name"],
                         0
                    );
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const getTglAkhirUsiaTempo = async (e: any) => {
          // get tanggal akhir
          let tanggalAwal =
               dataEditPengajuan.data_kredit[0].RENCANA_TANGGAL_PENCAIRAN;

          let convertTanggalAwal = new Date(tanggalAwal);
          let akhir = convertTanggalAwal.setMonth(
               convertTanggalAwal.getMonth() + parseInt(e)
          );
          let akhirDate = new Date(akhir);
          if (isNaN(akhirDate.getTime())) {
               inputDataKredit("TGL_AKHIR_KREDIT", "", 0);
               inputDataKredit("USIA_JATUH_TEMPO", "", 0);
          } else {
               inputDataKredit(
                    "TGL_AKHIR_KREDIT",
                    akhirDate.toLocaleDateString("en-CA"),
                    0
               );

               // get usia jatuh tempo

               let tglLahir = dataEditPengajuan.data_debitur[0].TGL_LAHIR;
               let dob: any = new Date(tglLahir);
               let tahun = akhirDate.getFullYear() - dob.getFullYear();
               let bulan = akhirDate.getMonth() - dob.getMonth();
               let hari = akhirDate.getDate() - dob.getDate();

               if (hari < 0) {
                    bulan -= 1; // Pinjam satu bulan
                    let bulanSebelumnya = new Date(
                         akhirDate.getFullYear(),
                         akhirDate.getMonth(),
                         0
                    );
                    hari += bulanSebelumnya.getDate(); // Tambahkan jumlah hari bulan sebelumnya
               }

               if (bulan < 0) {
                    tahun -= 1; // Pinjam satu tahun
                    bulan += 12; // Tambahkan 12 bulan
               }

               var resultUmurJatuhTempo =
                    tahun + " Tahun " + bulan + " Bulan " + hari + " Hari";
               inputDataKredit("USIA_JATUH_TEMPO", resultUmurJatuhTempo, 0);

               // end get usia jatuh tempo
          }
          // end get tanggal akhir
     };

     const inputDataDetailForInsurance = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataEditPengajuan.detail_insurance_life];
          changeVal[i][name] = value;
          setDataEditPengajuan({
               ...dataEditPengajuan,
               detail_insurance_life: changeVal,
          });
     };

     const selectedJenisInsurance = async (val: any) => {
          inputDataKredit("JENIS_ASURANSI", val.value, 0);
          inputDataDetailForInsurance("EMAIL_DEBITUR", "", 0);
          inputDataDetailForInsurance("GENDER_DEBITUR", "", 0);
          inputDataDetailForInsurance("HEIGHT_DEBITUR", "", 0);
          inputDataDetailForInsurance("KODE_AO", "", 0);
          inputDataDetailForInsurance("MARITAL_STATUS", "", 0);
          inputDataDetailForInsurance("WEIGHT_DEBITUR", "", 0);
     };

     console.log(dataEditPengajuan);

     return (
          <section>
               <div className="mt-2">
                    <fieldset className="pb-10 pt-0 rounded-lg border-2">
                         <legend className="ml-5 px-3 font-medium">
                              Data Debitur
                         </legend>
                         <div className="px-4 py-2">
                              <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4">
                                   <div>
                                        <InputLabel
                                             value="Nama Debitur"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1"
                                             placeholder="Nama Debitur"
                                             value={
                                                  dataEditPengajuan
                                                       .data_debitur[0]
                                                       .NAMA_DEBITUR
                                                       ? dataEditPengajuan
                                                              .data_debitur[0]
                                                              .NAMA_DEBITUR
                                                       : ""
                                             }
                                             required
                                             onChange={(e: any) => {
                                                  inputDataDebitur(
                                                       "NAMA_DEBITUR",
                                                       e.target.value,
                                                       0
                                                  );
                                             }}
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="NIK Debitur"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1"
                                             placeholder="NIK Debitur"
                                             value={
                                                  dataEditPengajuan
                                                       .data_debitur[0]
                                                       .NIK_DEBITUR
                                                       ? dataEditPengajuan
                                                              .data_debitur[0]
                                                              .NIK_DEBITUR
                                                       : ""
                                             }
                                             onChange={(e: any) => {
                                                  inputDataDebitur(
                                                       "NIK_DEBITUR",
                                                       e.target.value,
                                                       0
                                                  );
                                             }}
                                             onBlur={(e: any) => {
                                                  // cekJumlahNIK(e.target.value);
                                             }}
                                             required
                                        />
                                        {/* {cekNIK !== "" && (
                                             <span className="text-xs italic text-red-600">
                                                  {cekNIK}
                                             </span>
                                        )} */}
                                   </div>
                              </div>
                              <div className="grid lg:grid-cols-2 xs:grid-cols-1 mt-2 gap-4">
                                   <div>
                                        <InputLabel
                                             value="CIF Debitur"
                                             required={false}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1"
                                             placeholder="CIF Debitur"
                                             value={
                                                  dataEditPengajuan
                                                       .data_debitur[0]
                                                       .CIF_DEBITUR
                                                       ? dataEditPengajuan
                                                              .data_debitur[0]
                                                              .CIF_DEBITUR
                                                       : ""
                                             }
                                             required
                                             onChange={(e: any) => {
                                                  inputDataDebitur(
                                                       "CIF_DEBITUR",
                                                       e.target.value,
                                                       0
                                                  );
                                             }}
                                        />
                                   </div>
                              </div>
                         </div>
                    </fieldset>
               </div>
               <div className="mt-2">
                    <fieldset className="pb-10 pt-0 rounded-lg border-2">
                         <legend className="ml-5 px-3 font-medium">
                              Data Kredit
                         </legend>
                         <div className="px-4 py-2">
                              <div className="grid grid-cols-1 mt-2 gap-4">
                                   <div>
                                        <InputLabel
                                             value="Pilih Asuransi Yang Akan Dipilih"
                                             required={true}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm ring-1 text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                             isClearable={true}
                                             placeholder={"--Pilih--"}
                                             value={{
                                                  label: getInsuranceTypeValue(
                                                       dataEditPengajuan
                                                            ?.data_kredit[0]
                                                            ?.JENIS_ASURANSI
                                                  ),
                                                  value: dataEditPengajuan
                                                       ?.data_kredit[0]
                                                       ?.JENIS_ASURANSI,
                                             }}
                                             onChange={(val: any) => {
                                                  selectedJenisInsurance(val);
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                              </div>
                              <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
                                   <div>
                                        <InputLabel
                                             value="Nama Kantor"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Kode Kantor"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .NAMA_KANTOR
                                             }
                                             // onChange={(
                                             //      e: any
                                             // ) => {
                                             //      setdataEditPengajuan(
                                             //           "KODE_KANTOR",
                                             //           e.target
                                             //                .value
                                             //      );
                                             // }}
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Kode Kantor"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Kode Kantor"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .KODE_KANTOR
                                             }
                                             // onChange={(
                                             //      e: any
                                             // ) => {
                                             //      setdataEditPengajuan(
                                             //           "KODE_KANTOR",
                                             //           e.target
                                             //                .value
                                             //      );
                                             // }}
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Nama Cabang"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Nama Cabang"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .NAMA_CABANG
                                             }
                                             // onChange={(
                                             //      e: any
                                             // ) => {
                                             //      setdataEditPengajuan(
                                             //           "NAMA_CABANG",
                                             //           e.target
                                             //                .value
                                             //      );
                                             // }}
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Kode Cabang"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Kode Cabang"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .KODE_CABANG
                                             }
                                             // onChange={(
                                             //      e: any
                                             // ) => {
                                             //      setdataEditPengajuan(
                                             //           "KODE_CABANG",
                                             //           e.target
                                             //                .value
                                             //      );
                                             // }}
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Sumber Permbayaran"
                                             required={true}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm ring-1 text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                             options={selectTarifPayroll}
                                             isSearchable={true}
                                             isClearable={true}
                                             placeholder={"--Pilih--"}
                                             value={{
                                                  label: getTerifPayroll(
                                                       dataEditPengajuan
                                                            .data_kredit[0]
                                                            .TARIF_PAYROLL
                                                  ),
                                                  value: dataEditPengajuan
                                                       .data_kredit[0]
                                                       .TARIF_PAYROLL,
                                             }}
                                             onChange={(e: any) => {
                                                  inputDataKredit(
                                                       "TARIF_PAYROLL",
                                                       e.value,
                                                       0
                                                  );
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Loan Type"
                                             required={true}
                                        />
                                        <SelectTailwind
                                             classNames={{
                                                  menuButton: () =>
                                                       `flex text-sm ring-1 text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                             options={selectLoanType}
                                             isSearchable={true}
                                             isClearable={true}
                                             placeholder={"--Pilih--"}
                                             value={{
                                                  label: getLoanTypeValue(
                                                       dataEditPengajuan
                                                            .data_kredit[0]
                                                            .LOAN_TYPE
                                                  ),
                                                  value: dataEditPengajuan
                                                       .data_kredit[0]
                                                       .LOAN_TYPE,
                                             }}
                                             onChange={(e: any) => {
                                                  inputDataKredit(
                                                       "LOAN_TYPE",
                                                       e.value,
                                                       0
                                                  );
                                                  getProdukSubProduk(e.value);
                                             }}
                                             primaryColor={
                                                  "bg-[var(--dynamic-color)]"
                                             }
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Produk"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Produk"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0].PRODUK
                                             }
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Sub Produk"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Sub Produk"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .SUB_PRODUK
                                             }
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Nilai Pertanggungan"
                                             required={true}
                                        />
                                        <CurrencyInput
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .SUM_INSURED
                                             }
                                             decimalScale={2}
                                             decimalsLimit={2}
                                             onValueChange={(val: any) => {
                                                  inputDataKredit(
                                                       "SUM_INSURED",
                                                       val,
                                                       0
                                                  );
                                             }}
                                             className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-right"
                                             required
                                             placeholder="0.00"
                                             autoComplete="off"
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Tgl Lahir"
                                             required={true}
                                        />
                                        <DatePickerFlowBite
                                             value={
                                                  dataEditPengajuan
                                                       .data_debitur[0]
                                                       .TGL_LAHIR
                                                       ? dateFormat(
                                                              dataEditPengajuan
                                                                   .data_debitur[0]
                                                                   .TGL_LAHIR,
                                                              "dd-mm-yyyy"
                                                         )
                                                       : "dd-mm-yyyy"
                                             }
                                             onSelectedDateChanged={
                                                  handleTglLahir
                                             }
                                             className={
                                                  "ring-1 rounded-md focus:!ring-primary-adele"
                                             }
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Rencana Tgl Pencairan"
                                             required={true}
                                        />
                                        <DatePickerFlowBite
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .RENCANA_TANGGAL_PENCAIRAN
                                                       ? dateFormat(
                                                              dataEditPengajuan
                                                                   .data_kredit[0]
                                                                   .RENCANA_TANGGAL_PENCAIRAN,
                                                              "dd-mm-yyyy"
                                                         )
                                                       : "dd-mm-yyyy"
                                             }
                                             onSelectedDateChanged={
                                                  handleDateTglRencana
                                             }
                                             className={
                                                  "ring-1 rounded-md focus:!ring-primary-adele"
                                             }
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Usia"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Usia"
                                             value={
                                                  dataEditPengajuan
                                                       .data_debitur[0]
                                                       .USIA_DEBITUR
                                             }
                                             onChange={(e: any) => {
                                                  //  inputDataDebitur(
                                                  //       "USIA_DEBITUR",
                                                  //       e.target
                                                  //            .value,
                                                  //       0
                                                  //  );
                                             }}
                                             disabled
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Tenor (Bulan)"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1"
                                             placeholder="Tenor"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0].TENOR
                                             }
                                             required
                                             onChange={(e: any) => {
                                                  inputDataKredit(
                                                       "TENOR",
                                                       e.target.value,
                                                       0
                                                  );
                                                  getTglAkhirUsiaTempo(
                                                       e.target.value
                                                  );
                                             }}
                                        />
                                   </div>
                                   <div>
                                        <InputLabel
                                             value="Tgl Akhir Kredit"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Tgl Akhir Kredit"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .TGL_AKHIR_KREDIT
                                                       ? dateFormat(
                                                              dataEditPengajuan
                                                                   .data_kredit[0]
                                                                   .TGL_AKHIR_KREDIT,
                                                              "dd-mm-yyyy"
                                                         )
                                                       : "dd-mm-yyyy"
                                             }
                                             disabled
                                        />
                                   </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4 mt-2">
                                   <div>
                                        <InputLabel
                                             value="Usia Pada Saat Jatuh Tempo"
                                             required={true}
                                        />
                                        <TextInput
                                             type="text"
                                             className="ring-1 bg-gray-300"
                                             placeholder="Usia Pada Saat Jatuh Tempo"
                                             value={
                                                  dataEditPengajuan
                                                       .data_kredit[0]
                                                       .USIA_JATUH_TEMPO
                                             }
                                             disabled
                                        />
                                   </div>
                              </div>
                         </div>
                    </fieldset>
               </div>
               {dataEditPengajuan?.data_kredit[0]?.JENIS_ASURANSI === 1 && (
                    <div className="mt-2">
                         <fieldset className="pb-10 pt-0 rounded-lg border-2">
                              <legend className="ml-5 px-3 font-medium">
                                   Detail For Insurance Life
                              </legend>
                              <div className="px-4 py-2">
                                   <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4">
                                        <div>
                                             <InputLabel
                                                  value="Kode AO"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1"
                                                  placeholder="Kode AO"
                                                  value={
                                                       dataEditPengajuan
                                                            ?.detail_insurance_life[0]
                                                            ?.KODE_AO === null
                                                            ? ""
                                                            : dataEditPengajuan
                                                                   ?.detail_insurance_life[0]
                                                                   ?.KODE_AO
                                                  }
                                                  required
                                                  onChange={(e: any) => {
                                                       inputDataDetailForInsurance(
                                                            "KODE_AO",
                                                            e.target.value,
                                                            0
                                                       );
                                                  }}
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Email Debitur"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1"
                                                  placeholder="Email Debitur"
                                                  value={
                                                       dataEditPengajuan
                                                            ?.detail_insurance_life[0]
                                                            ?.EMAIL_DEBITUR
                                                  }
                                                  required
                                                  onChange={(e: any) => {
                                                       inputDataDetailForInsurance(
                                                            "EMAIL_DEBITUR",
                                                            e.target.value,
                                                            0
                                                       );
                                                  }}
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Gender Debitur"
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm ring-1 text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                                  options={selectGender}
                                                  isSearchable={true}
                                                  placeholder={"--Pilih--"}
                                                  // value={
                                                  //      dataEditPengajuan
                                                  //           ?.detail_insurance_life[0]
                                                  //           ?.GENDER_DEBITUR
                                                  // }
                                                  value={{
                                                       label: getGenderDebitur(
                                                            dataEditPengajuan
                                                                 .detail_insurance_life[0]
                                                                 .GENDER_DEBITUR
                                                       ),
                                                       value: dataEditPengajuan
                                                            .detail_insurance_life[0]
                                                            .GENDER_DEBITUR,
                                                  }}
                                                  onChange={(e: any) => {
                                                       inputDataDetailForInsurance(
                                                            "GENDER_DEBITUR",
                                                            e.value,
                                                            0
                                                       );
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
                                                  }
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Height Debitur (cm)"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1"
                                                  placeholder="Height Debitur"
                                                  value={
                                                       dataEditPengajuan
                                                            ?.detail_insurance_life[0]
                                                            ?.HEIGHT_DEBITUR
                                                  }
                                                  required
                                                  onChange={(e: any) => {
                                                       inputDataDetailForInsurance(
                                                            "HEIGHT_DEBITUR",
                                                            e.target.value,
                                                            0
                                                       );
                                                  }}
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Weight Debitur (kg)"
                                                  required={true}
                                             />
                                             <TextInput
                                                  type="text"
                                                  className="ring-1"
                                                  placeholder="Weight Debitur"
                                                  value={
                                                       dataEditPengajuan
                                                            ?.detail_insurance_life[0]
                                                            ?.WEIGHT_DEBITUR
                                                  }
                                                  required
                                                  onChange={(e: any) => {
                                                       inputDataDetailForInsurance(
                                                            "WEIGHT_DEBITUR",
                                                            e.target.value,
                                                            0
                                                       );
                                                  }}
                                             />
                                        </div>
                                        <div>
                                             <InputLabel
                                                  value="Martital Status"
                                                  required={true}
                                             />
                                             <SelectTailwind
                                                  classNames={{
                                                       menuButton: () =>
                                                            `flex text-sm ring-1 text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
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
                                                  options={selectMarital}
                                                  isSearchable={true}
                                                  placeholder={"--Pilih--"}
                                                  // value={
                                                  //      dataEditPengajuan
                                                  //           ?.detail_insurance_life[0]
                                                  //           ?.MARITAL_STATUS
                                                  // }
                                                  value={{
                                                       label: getMaritalStatus(
                                                            dataEditPengajuan
                                                                 .detail_insurance_life[0]
                                                                 .MARITAL_STATUS
                                                       ),
                                                       value: dataEditPengajuan
                                                            .detail_insurance_life[0]
                                                            .MARITAL_STATUS,
                                                  }}
                                                  onChange={(e: any) => {
                                                       inputDataDetailForInsurance(
                                                            "MARITAL_STATUS",
                                                            e.value,
                                                            0
                                                       );
                                                  }}
                                                  primaryColor={
                                                       "bg-[var(--dynamic-color)]"
                                                  }
                                             />
                                        </div>
                                   </div>
                              </div>
                         </fieldset>
                    </div>
               )}
          </section>
     );
}
