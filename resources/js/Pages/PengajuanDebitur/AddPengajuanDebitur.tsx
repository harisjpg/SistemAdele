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

export default function AddPengajuanDebitur({
     setDataPengajuanDebitur,
     dataPengajuanDebitur,
     dataTheInsured,
     insuranceType,
     dataComboBankBranch,
     tarifPayroll,
     loanType,
     auth,
     arrMaritalStatus,
}: PropsWithChildren<{
     setDataPengajuanDebitur: any;
     dataPengajuanDebitur: any;
     dataTheInsured: any;
     insuranceType: any;
     dataComboBankBranch: any;
     tarifPayroll: any;
     loanType: any;
     auth: any;
     arrMaritalStatus: any;
}>) {
     const [dataCabangKantor, setDataCabangKantor] = useState<boolean>(false);
     console.log(dataCabangKantor);

     useEffect(() => {
          if (auth.user.BANK_BRANCH_ID !== null) {
               const selectDataBranchByAuthBank = dataComboBankBranch?.filter(
                    (filter: any) =>
                         auth.user.BANK_BRANCH_ID === filter.BANK_BRANCH_ID
               );

               const changeVal: any = [...dataPengajuanDebitur.data_kredit];
               changeVal[0]["NAMA_KANTOR"] = {
                    label: selectDataBranchByAuthBank[0]["text_combo"],
                    value: selectDataBranchByAuthBank[0]["BANK_BRANCH_ID"],
               };

               setDataPengajuanDebitur({
                    ...dataPengajuanDebitur,
                    data_kredit: changeVal,
               });

               const changeVal2: any = [...dataPengajuanDebitur.data_kredit];
               changeVal[0]["KODE_KANTOR"] =
                    selectDataBranchByAuthBank[0]["BANK_BRANCH_CODE"];
               setDataPengajuanDebitur({
                    ...dataPengajuanDebitur,
                    data_kredit: changeVal2,
               });
               // setDataPengajuanDebitur({
               //      ...dataPengajuanDebitur,
               //      data_kredit: {
               //           NAMA_KANTOR: {
               //                label: selectDataBranchByAuthBank[0][
               //                     "text_combo"
               //                ],
               //                value: selectDataBranchByAuthBank[0][
               //                     "BANK_BRANCH_ID"
               //                ],
               //           },
               //           KODE_KANTOR:
               //                selectDataBranchByAuthBank[0]["BANK_BRANCH_CODE"],
               //      },
               // });
          }
     }, []);

     useEffect(() => {
          if (dataCabangKantor === true) {
               console.log("masukkk");

               const selectDataBranchByAuthBank = dataComboBankBranch?.filter(
                    (filter: any) =>
                         auth.user.BANK_BRANCH_ID === filter.BANK_BRANCH_ID
               );

               const changeVal: any = [...dataPengajuanDebitur.data_kredit];
               changeVal[0]["NAMA_KANTOR"] = {
                    label: selectDataBranchByAuthBank[0]["text_combo"],
                    value: selectDataBranchByAuthBank[0]["BANK_BRANCH_ID"],
               };

               setDataPengajuanDebitur({
                    ...dataPengajuanDebitur,
                    data_kredit: changeVal,
               });

               const changeVal2: any = [...dataPengajuanDebitur.data_kredit];
               changeVal[0]["KODE_KANTOR"] =
                    selectDataBranchByAuthBank[0]["BANK_BRANCH_CODE"];
               setDataPengajuanDebitur({
                    ...dataPengajuanDebitur,
                    data_kredit: changeVal2,
               });
          } else {
               console.log("masukkk");

               const selectDataBranchByAuthBank = dataComboBankBranch?.filter(
                    (filter: any) =>
                         auth.user.BANK_BRANCH_ID === filter.BANK_BRANCH_ID
               );

               const changeVal: any = [...dataPengajuanDebitur.data_kredit];
               changeVal[0]["NAMA_KANTOR"] = {
                    label: selectDataBranchByAuthBank[0]["text_combo"],
                    value: selectDataBranchByAuthBank[0]["BANK_BRANCH_ID"],
               };

               setDataPengajuanDebitur({
                    ...dataPengajuanDebitur,
                    data_kredit: changeVal,
               });

               const changeVal2: any = [...dataPengajuanDebitur.data_kredit];
               changeVal[0]["KODE_KANTOR"] =
                    selectDataBranchByAuthBank[0]["BANK_BRANCH_CODE"];
               setDataPengajuanDebitur({
                    ...dataPengajuanDebitur,
                    data_kredit: changeVal2,
               });
          }
     }, [dataCabangKantor]);

     const arrayChoose = [
          {
               id: "1",
               name: "Buat Debitur Baru",
          },
          {
               id: "2",
               name: "Cari Debitur Existing",
          },
     ];

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

     const select = arrayChoose?.map((query: any) => {
          return {
               value: query.id,
               label: query.name,
          };
     });

     const selectTarifPayroll = tarifPayroll?.map((query: any) => {
          return {
               value: query.TARIF_PAYROLL_ID,
               label: query.TARIF_PAYROLL_NAME,
          };
     });

     const selectLoanType = loanType?.map((query: any) => {
          return {
               value: query.loan_type_id,
               label: query.loan_type_name,
          };
     });

     const selectInsurance = insuranceType?.map((query: any) => {
          return {
               value: query.JENIS_ASURANSI_ID,
               label: query.JENIS_ASURANSI_NAME,
          };
     });

     const selectTheInsured = dataTheInsured?.map((query: any) => {
          return {
               value: query.THE_INSURED_ID,
               label:
                    query.THE_INSURED_NAME +
                    " - " +
                    query.THE_INSURED_DATE_OF_BIRTH,
          };
     });

     // for data bank branch
     const selectComboBranch = dataComboBankBranch
          ?.filter(
               (filter: any) =>
                    auth.user.BANK_BRANCH_ID === filter.BANK_BRANCH_ID
          )
          ?.map((query: any) => {
               return {
                    value: query.BANK_BRANCH_ID,
                    label: query.text_combo,
               };
          });

     const handleDateOfLossChange = (date: Date) => {
          setDataPengajuanDebitur({
               ...dataPengajuanDebitur,
               TGL_LAHIR: date.toLocaleDateString("en-CA"),
          });
     };

     const handleTglLahir = (date: Date) => {
          inputDataDebitur("TGL_LAHIR", date.toLocaleDateString("en-CA"), 0);
     };

     const inputDataDebitur = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataPengajuanDebitur.data_debitur];
          changeVal[i][name] = value;
          setDataPengajuanDebitur({
               ...dataPengajuanDebitur,
               data_debitur: changeVal,
          });
     };

     const inputDataDetailForInsurance = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [
               ...dataPengajuanDebitur.detail_insurance_life,
          ];
          changeVal[i][name] = value;
          setDataPengajuanDebitur({
               ...dataPengajuanDebitur,
               detail_insurance_life: changeVal,
          });
     };

     const handleDateTglRencana = async (date: Date) => {
          inputDataKredit(
               "RENCANA_TANGGAL_PENCAIRAN",
               date.toLocaleDateString("en-CA"),
               0
          );

          // perhitungan usia ketika tanggal pencairan
          let tglLahir = dataPengajuanDebitur.data_debitur[0].TGL_LAHIR;
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
          let cekTenor = dataPengajuanDebitur.data_kredit[0].TENOR;
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

               // let tglLahir = dataPengajuanDebitur.data_debitur[0].TGL_LAHIR;
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

     const getTglAkhirUsiaTempo = async (e: any) => {
          // get tanggal akhir
          let tanggalAwal =
               dataPengajuanDebitur.data_kredit[0].RENCANA_TANGGAL_PENCAIRAN;

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

               let tglLahir = dataPengajuanDebitur.data_debitur[0].TGL_LAHIR;
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

     // const inputDataDocument = (
     //      name: string,
     //      value: string | undefined,
     //      i: number
     // ) => {
     //      const changeVal: any = [...dataPengajuanDebitur.document];
     //      changeVal[i][name] = value;
     //      setDataPengajuanDebitur({
     //           ...dataPengajuanDebitur,
     //           document: changeVal,
     //      });
     // };

     const inputDataKredit = (
          name: string,
          value: string | undefined,
          i: number
     ) => {
          const changeVal: any = [...dataPengajuanDebitur.data_kredit];
          changeVal[i][name] = value;
          setDataPengajuanDebitur({
               ...dataPengajuanDebitur,
               data_kredit: changeVal,
          });
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

     console.log(dataPengajuanDebitur);

     const getBranchCodeName = async (idCabang: any) => {
          await axios
               .post(`/getBranchCodeName`, { idCabang })
               .then((res) => {
                    inputDataKredit(
                         "KODE_KANTOR",
                         res.data["data1"][0]["BANK_BRANCH_CODE"],
                         0
                    );
                    inputDataKredit(
                         "NAMA_CABANG",
                         res.data["data2"][0]["BANK_BRANCH_NAME"],
                         0
                    );
                    inputDataKredit(
                         "KODE_CABANG",
                         res.data["data2"][0]["BANK_BRANCH_CODE"],
                         0
                    );
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const [documentKTP, setDocumentKTP] = useState<any>("");
     const getDetailDebitur = async (idTheInsured: any) => {
          const dataFilterInsured = dataTheInsured?.filter(
               (data: any) =>
                    data.THE_INSURED_ID.toString() === idTheInsured.toString()
          );

          if (dataFilterInsured[0]["DOCUMENT_KTP_ID"] !== null) {
               setDocumentKTP(dataFilterInsured[0]["DOCUMENT_KTP_ID"]);
          } else {
               setDocumentKTP("");
          }

          inputDataDebitur(
               "TGL_LAHIR",
               dataFilterInsured[0]["THE_INSURED_DATE_OF_BIRTH"],
               0
          );
          inputDataDebitur(
               "USIA_DEBITUR",
               dataFilterInsured[0]["THE_INSURED_AGE"],
               0
          );
          inputDataDebitur(
               "NIK_DEBITUR",
               dataFilterInsured[0]["THE_INSURED_ID_NUMBER"],
               0
          );
          inputDataDebitur(
               "CIF_DEBITUR",
               dataFilterInsured[0]["THE_INSURED_CIF"],
               0
          );
     };

     const clearDataDebitur = async () => {
          setDocumentKTP("");
          setDataPengajuanDebitur({
               DEBITUR_BARU: dataPengajuanDebitur.DEBITUR_BARU,
               data_debitur: [
                    {
                         NAMA_DEBITUR: null,
                         NIK_DEBITUR: "",
                         CIF_DEBITUR: "",
                         TGL_LAHIR: "",
                         USIA_DEBITUR: "",
                    },
               ],
               data_kredit: [
                    {
                         JENIS_ASURANSI: null,
                         TARIF_PAYROLL: null,
                         LOAN_TYPE: null,
                         PRODUK: "",
                         SUB_PRODUK: "",
                         SUM_INSURED: "",
                         RENCANA_TANGGAL_PENCAIRAN: "",
                         TENOR: "",
                         TGL_AKHIR_KREDIT: "",
                         USIA_JATUH_TEMPO: "",
                    },
               ],
               detail_insurance_life: [
                    {
                         KODE_AO: "",
                         EMAIL_DEBITUR: "",
                         GENDER_DEBITUR: null,
                         HEIGHT_DEBITUR: "",
                         WEIGHT_DEBITUR: "",
                         MARITAL_STATUS: null,
                    },
               ],
               document: [
                    {
                         UPLOAD_KTP: "",
                         UPLOAD_SPAJK: "",
                         UPLOAD_MCU: "",
                    },
               ],
          });
     };

     const clearBranchNameCode = async () => {
          // inputDataKredit("KODE_KANTOR", "", 0);
          // inputDataKredit("NAMA_CABANG", "", 0);
          // inputDataKredit("KODE_CABANG", "", 0);
     };

     const clearAllDataDebitur = async (e: any) => {
          setDataPengajuanDebitur({
               DEBITUR_BARU: e,
               data_debitur: [
                    {
                         NAMA_DEBITUR: null,
                         NIK_DEBITUR: "",
                         CIF_DEBITUR: "",
                         TGL_LAHIR: "",
                         USIA_DEBITUR: "",
                    },
               ],
               data_kredit: [
                    {
                         JENIS_ASURANSI: null,
                         TARIF_PAYROLL: null,
                         LOAN_TYPE: null,
                         KODE_KANTOR: null,
                         NAMA_CABANG: "",
                         PRODUK: "",
                         SUB_PRODUK: "",
                         SUM_INSURED: "",
                         RENCANA_TANGGAL_PENCAIRAN: "",
                         TENOR: "",
                         TGL_AKHIR_KREDIT: "",
                         USIA_JATUH_TEMPO: "",
                    },
               ],
               detail_insurance_life: [
                    {
                         KODE_AO: "",
                         EMAIL_DEBITUR: "",
                         GENDER_DEBITUR: null,
                         HEIGHT_DEBITUR: "",
                         WEIGHT_DEBITUR: "",
                         MARITAL_STATUS: null,
                    },
               ],
               document: [
                    {
                         UPLOAD_KTP: "",
                         UPLOAD_SPAJK: "",
                         UPLOAD_MCU: "",
                    },
               ],
          });
          setDocumentKTP("");
          setDataCabangKantor(true);
          setTimeout(() => {
               setDataCabangKantor(false);
          }, 100);
     };

     const [cekNIK, setCekNIK] = useState<any>("");
     const cekJumlahNIK = async (e: any) => {
          console.log(e.length);

          if (e.length > 16) {
               setCekNIK("NIK lebih dari 16, silahkan cek kembali!");
          }
          if (e.length === 16) {
               setCekNIK("");
          }
          if (e.length > 0 && e.length < 16) {
               setCekNIK("NIK kurang dari 16, silahkan cek kembali!");
          }
     };

     const handleFileDownloadKTP = async (idDocument: any) => {
          await axios({
               url: `/downloadRate/${idDocument}`,
               method: "GET",
               responseType: "blob",
          })
               .then((response) => {
                    const url = window.URL.createObjectURL(
                         new Blob([response.data])
                    );
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", response.headers.filename);
                    document.body.appendChild(link);
                    link.click();
               })
               .catch((err) => {
                    console.log(err);
                    if (err.response.status === 404) {
                         alert("File not Found");
                    }
               });
     };

     const handleFileViewKTP = async (idDocument: any) => {
          await axios({
               url: `/downloadRate/${idDocument}`,
               method: "GET",
               responseType: "blob",
          })
               .then((response) => {
                    const url = window.URL.createObjectURL(
                         new Blob([response.data])
                    );
                    window.open(url, "_blank");
               })
               .catch((err) => {
                    console.log(err);
                    if (err.response.status === 404) {
                         alert("File not Found");
                    }
               });
     };

     const [editUploadKTP, setEditUploadKTP] = useState<any>(false);
     const handleClickEditKTP = async () => {
          if (editUploadKTP === false) {
               setEditUploadKTP(true);
          } else {
               setEditUploadKTP(false);
          }
     };

     const selectedJenisAsuransi = async (val: any) => {
          inputDataKredit("JENIS_ASURANSI", val, 0);
          if (val.value === 2) {
               inputDataDetailForInsurance("EMAIL_DEBITUR", "", 0);
               inputDataDetailForInsurance("GENDER_DEBITUR", "", 0);
               inputDataDetailForInsurance("HEIGHT_DEBITUR", "", 0);
               inputDataDetailForInsurance("KODE_AO", "", 0);
               inputDataDetailForInsurance("MARITAL_STATUS", "", 0);
               inputDataDetailForInsurance("WEIGHT_DEBITUR", "", 0);
          }
     };

     return (
          <>
               <div className="grid grid-cols-1">
                    <div className="mt-2">
                         <SelectTailwind
                              classNames={{
                                   menuButton: () =>
                                        `flex text-sm text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                   menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                   listItem: ({ isSelected }: any) =>
                                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                             isSelected
                                                  ? `text-white bg-primary-adele`
                                                  : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                        }`,
                              }}
                              options={select}
                              isSearchable={true}
                              placeholder={"--Pilih--"}
                              value={dataPengajuanDebitur.DEBITUR_BARU}
                              onChange={(e) => {
                                   setDataPengajuanDebitur({
                                        ...dataPengajuanDebitur,
                                        DEBITUR_BARU: e,
                                   });
                                   clearAllDataDebitur(e);
                              }}
                              primaryColor={"bg-primary-adele"}
                         />
                    </div>
                    {dataPengajuanDebitur.DEBITUR_BARU !== "" ? (
                         <>
                              <div className="mt-2">
                                   <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                        <legend className="ml-5 px-3 font-medium">
                                             Data Nasabah
                                        </legend>
                                        <div className="px-4 py-2">
                                             <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4">
                                                  <div>
                                                       {dataPengajuanDebitur
                                                            .DEBITUR_BARU[
                                                            "value"
                                                       ] === "2" ? (
                                                            <>
                                                                 <InputLabel value="Cari Debitur Existing" />
                                                                 <SelectTailwind
                                                                      classNames={{
                                                                           menuButton:
                                                                                () =>
                                                                                     `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 text-wrap`,
                                                                           menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                           listItem:
                                                                                ({
                                                                                     isSelected,
                                                                                }: any) =>
                                                                                     `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                          isSelected
                                                                                               ? `text-white bg-primary-adele`
                                                                                               : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                                                     }`,
                                                                      }}
                                                                      options={
                                                                           selectTheInsured
                                                                      }
                                                                      isSearchable={
                                                                           true
                                                                      }
                                                                      isClearable={
                                                                           true
                                                                      }
                                                                      placeholder={
                                                                           "--Pilih--"
                                                                      }
                                                                      value={
                                                                           dataPengajuanDebitur
                                                                                .data_debitur[0]
                                                                                .NAMA_DEBITUR
                                                                      }
                                                                      onChange={(
                                                                           e: any
                                                                      ) => {
                                                                           inputDataDebitur(
                                                                                "NAMA_DEBITUR",
                                                                                e,
                                                                                0
                                                                           );
                                                                           if (
                                                                                e !==
                                                                                null
                                                                           ) {
                                                                                getDetailDebitur(
                                                                                     e.value
                                                                                );
                                                                           } else {
                                                                                clearDataDebitur();
                                                                           }
                                                                      }}
                                                                      primaryColor={
                                                                           "bg-primary-adele"
                                                                      }
                                                                 />
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <InputLabel
                                                                      value="Nama Debitur"
                                                                      required={
                                                                           true
                                                                      }
                                                                 />
                                                                 <TextInput
                                                                      type="text"
                                                                      className="ring-1"
                                                                      placeholder="Nama Debitur"
                                                                      value={
                                                                           dataPengajuanDebitur
                                                                                .data_debitur[0]
                                                                                .NAMA_DEBITUR
                                                                                ? dataPengajuanDebitur
                                                                                       .data_debitur[0]
                                                                                       .NAMA_DEBITUR
                                                                                : ""
                                                                      }
                                                                      required
                                                                      onChange={(
                                                                           e: any
                                                                      ) => {
                                                                           inputDataDebitur(
                                                                                "NAMA_DEBITUR",
                                                                                e
                                                                                     .target
                                                                                     .value,
                                                                                0
                                                                           );
                                                                      }}
                                                                 />
                                                            </>
                                                       )}
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
                                                                 dataPengajuanDebitur
                                                                      .data_debitur[0]
                                                                      .NIK_DEBITUR
                                                                      ? dataPengajuanDebitur
                                                                             .data_debitur[0]
                                                                             .NIK_DEBITUR
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataDebitur(
                                                                      "NIK_DEBITUR",
                                                                      e.target
                                                                           .value,
                                                                      0
                                                                 );
                                                            }}
                                                            onBlur={(
                                                                 e: any
                                                            ) => {
                                                                 cekJumlahNIK(
                                                                      e.target
                                                                           .value
                                                                 );
                                                            }}
                                                            required
                                                       />
                                                       {cekNIK !== "" && (
                                                            <span className="text-xs italic text-red-600">
                                                                 {cekNIK}
                                                            </span>
                                                       )}
                                                  </div>
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
                                                                 dataPengajuanDebitur
                                                                      .data_debitur[0]
                                                                      .CIF_DEBITUR
                                                                      ? dataPengajuanDebitur
                                                                             .data_debitur[0]
                                                                             .CIF_DEBITUR
                                                                      : ""
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataDebitur(
                                                                      "CIF_DEBITUR",
                                                                      e.target
                                                                           .value,
                                                                      0
                                                                 );
                                                            }}
                                                       />
                                                  </div>
                                                  <div>
                                                       <InputLabel
                                                            value="Tgl Lahir"
                                                            required={true}
                                                       />
                                                       <DatePickerFlowBite
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_debitur[0]
                                                                      .TGL_LAHIR
                                                                      ? dateFormat(
                                                                             dataPengajuanDebitur
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
                                             </div>
                                        </div>
                                   </fieldset>
                              </div>
                              <div className="mt-2">
                                   <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                        <legend className="ml-5 px-3 font-medium">
                                             Data Nama Kantor Cabang Bank
                                        </legend>
                                        <div className="px-4 py-2">
                                             <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
                                                  <div>
                                                       <InputLabel
                                                            value="Nama"
                                                            required={true}
                                                       />
                                                       <SelectTailwind
                                                            classNames={{
                                                                 menuButton:
                                                                      () =>
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
                                                            options={
                                                                 selectComboBranch
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            placeholder={
                                                                 "--Pilih--"
                                                            }
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .NAMA_KANTOR
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataKredit(
                                                                      "NAMA_KANTOR",
                                                                      e,
                                                                      0
                                                                 );
                                                                 if (
                                                                      e !== null
                                                                 ) {
                                                                      getBranchCodeName(
                                                                           e.value
                                                                      );
                                                                 } else {
                                                                      clearBranchNameCode();
                                                                 }
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
                                                            }
                                                       />
                                                  </div>
                                                  <div>
                                                       <InputLabel
                                                            value="Kode"
                                                            required={true}
                                                       />
                                                       <TextInput
                                                            type="text"
                                                            className="ring-1 bg-gray-300"
                                                            placeholder="Kode Kantor"
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .KODE_KANTOR
                                                            }
                                                            // onChange={(
                                                            //      e: any
                                                            // ) => {
                                                            //      setDataPengajuanDebitur(
                                                            //           "KODE_KANTOR",
                                                            //           e.target
                                                            //                .value
                                                            //      );
                                                            // }}
                                                            disabled
                                                       />
                                                  </div>
                                             </div>
                                             {/* <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .NAMA_CABANG
                                                            }
                                                            // onChange={(
                                                            //      e: any
                                                            // ) => {
                                                            //      setDataPengajuanDebitur(
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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .KODE_CABANG
                                                            }
                                                            // onChange={(
                                                            //      e: any
                                                            // ) => {
                                                            //      setDataPengajuanDebitur(
                                                            //           "KODE_CABANG",
                                                            //           e.target
                                                            //                .value
                                                            //      );
                                                            // }}
                                                            disabled
                                                       />
                                                  </div>
                                             </div> */}
                                        </div>
                                   </fieldset>
                              </div>
                              <div className="mt-2">
                                   <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                        <legend className="ml-5 px-3 font-medium">
                                             Data Pengajuan Pinjaman
                                        </legend>
                                        <div className="px-4 py-2">
                                             <div className="grid grid-cols-1 mt-2 gap-4">
                                                  <div className="hidden">
                                                       <InputLabel
                                                            value="Pilih Jenis Asuransi"
                                                            required={true}
                                                       />
                                                       <SelectTailwind
                                                            classNames={{
                                                                 menuButton:
                                                                      () =>
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
                                                            options={
                                                                 selectInsurance
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            placeholder={
                                                                 "--Pilih--"
                                                            }
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .JENIS_ASURANSI
                                                            }
                                                            onChange={(
                                                                 val: any
                                                            ) => {
                                                                 selectedJenisAsuransi(
                                                                      val
                                                                 );
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
                                                            }
                                                       />
                                                  </div>
                                             </div>
                                             <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
                                                  <div>
                                                       <InputLabel
                                                            value="Sumber Permbayaran"
                                                            required={true}
                                                       />
                                                       <SelectTailwind
                                                            classNames={{
                                                                 menuButton:
                                                                      () =>
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
                                                            options={
                                                                 selectTarifPayroll
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            placeholder={
                                                                 "--Pilih--"
                                                            }
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .TARIF_PAYROLL
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataKredit(
                                                                      "TARIF_PAYROLL",
                                                                      e,
                                                                      0
                                                                 );
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
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
                                                                 menuButton:
                                                                      () =>
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
                                                            options={
                                                                 selectLoanType
                                                            }
                                                            isSearchable={true}
                                                            isClearable={true}
                                                            placeholder={
                                                                 "--Pilih--"
                                                            }
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .LOAN_TYPE
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataKredit(
                                                                      "LOAN_TYPE",
                                                                      e,
                                                                      0
                                                                 );
                                                                 getProdukSubProduk(
                                                                      e.value
                                                                 );
                                                            }}
                                                            primaryColor={
                                                                 "bg-primary-adele"
                                                            }
                                                       />
                                                  </div>
                                             </div>
                                             <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .PRODUK
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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .SUB_PRODUK
                                                            }
                                                            disabled
                                                       />
                                                  </div>
                                                  <div>
                                                       <InputLabel
                                                            value="Nilai Pinjaman"
                                                            required={true}
                                                       />
                                                       <CurrencyInput
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .SUM_INSURED
                                                            }
                                                            decimalScale={2}
                                                            decimalsLimit={2}
                                                            onValueChange={(
                                                                 val: any
                                                            ) => {
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
                                                            value="Rencana Tgl Pencairan"
                                                            required={true}
                                                       />
                                                       <DatePickerFlowBite
                                                            value={
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .RENCANA_TANGGAL_PENCAIRAN
                                                                      ? dateFormat(
                                                                             dataPengajuanDebitur
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
                                                                 dataPengajuanDebitur
                                                                      .data_debitur[0]
                                                                      .USIA_DEBITUR
                                                            }
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataDebitur(
                                                                      "USIA_DEBITUR",
                                                                      e.target
                                                                           .value,
                                                                      0
                                                                 );
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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .TENOR
                                                            }
                                                            required
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 inputDataKredit(
                                                                      "TENOR",
                                                                      e.target
                                                                           .value,
                                                                      0
                                                                 );
                                                                 getTglAkhirUsiaTempo(
                                                                      e.target
                                                                           .value
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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .TGL_AKHIR_KREDIT
                                                                      ? dateFormat(
                                                                             dataPengajuanDebitur
                                                                                  .data_kredit[0]
                                                                                  .TGL_AKHIR_KREDIT,
                                                                             "dd-mm-yyyy"
                                                                        )
                                                                      : "dd-mm-yyyy"
                                                            }
                                                            disabled
                                                       />
                                                  </div>

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
                                                                 dataPengajuanDebitur
                                                                      .data_kredit[0]
                                                                      .USIA_JATUH_TEMPO
                                                            }
                                                            disabled
                                                       />
                                                  </div>
                                             </div>
                                             <div className="grid grid-cols-1 gap-4 mt-2"></div>
                                        </div>
                                   </fieldset>
                              </div>
                              {dataPengajuanDebitur?.data_kredit[0]
                                   .JENIS_ASURANSI !== null
                                   ? dataPengajuanDebitur?.data_kredit[0]
                                          .JENIS_ASURANSI["value"] === 1 && (
                                          <div className="mt-2">
                                               <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                                    <legend className="ml-5 px-3 font-medium">
                                                         Detail For Insurance
                                                         Life
                                                    </legend>
                                                    <div className="px-4 py-2">
                                                         <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4">
                                                              <div>
                                                                   <InputLabel
                                                                        value="Kode AO"
                                                                        required={
                                                                             true
                                                                        }
                                                                   />
                                                                   <TextInput
                                                                        type="text"
                                                                        className="ring-1"
                                                                        placeholder="Kode AO"
                                                                        value={
                                                                             dataPengajuanDebitur
                                                                                  ?.detail_insurance_life[0]
                                                                                  ?.KODE_AO
                                                                        }
                                                                        required
                                                                        onChange={(
                                                                             e: any
                                                                        ) => {
                                                                             inputDataDetailForInsurance(
                                                                                  "KODE_AO",
                                                                                  e
                                                                                       .target
                                                                                       .value,
                                                                                  0
                                                                             );
                                                                        }}
                                                                   />
                                                              </div>
                                                              <div>
                                                                   <InputLabel
                                                                        value="Email Debitur"
                                                                        required={
                                                                             true
                                                                        }
                                                                   />
                                                                   <TextInput
                                                                        type="text"
                                                                        className="ring-1"
                                                                        placeholder="Email Debitur"
                                                                        value={
                                                                             dataPengajuanDebitur
                                                                                  ?.detail_insurance_life[0]
                                                                                  ?.EMAIL_DEBITUR
                                                                        }
                                                                        required
                                                                        onChange={(
                                                                             e: any
                                                                        ) => {
                                                                             inputDataDetailForInsurance(
                                                                                  "EMAIL_DEBITUR",
                                                                                  e
                                                                                       .target
                                                                                       .value,
                                                                                  0
                                                                             );
                                                                        }}
                                                                   />
                                                              </div>
                                                              <div>
                                                                   <InputLabel
                                                                        value="Gender Debitur"
                                                                        required={
                                                                             true
                                                                        }
                                                                   />
                                                                   <SelectTailwind
                                                                        classNames={{
                                                                             menuButton:
                                                                                  () =>
                                                                                       `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                             menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                             listItem:
                                                                                  ({
                                                                                       isSelected,
                                                                                  }: any) =>
                                                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                            isSelected
                                                                                                 ? `text-white bg-primary-adele`
                                                                                                 : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                                                       }`,
                                                                        }}
                                                                        options={
                                                                             selectGender
                                                                        }
                                                                        isSearchable={
                                                                             true
                                                                        }
                                                                        placeholder={
                                                                             "--Pilih--"
                                                                        }
                                                                        value={
                                                                             dataPengajuanDebitur
                                                                                  ?.detail_insurance_life[0]
                                                                                  ?.GENDER_DEBITUR
                                                                        }
                                                                        onChange={(
                                                                             e: any
                                                                        ) => {
                                                                             inputDataDetailForInsurance(
                                                                                  "GENDER_DEBITUR",
                                                                                  e,
                                                                                  0
                                                                             );
                                                                        }}
                                                                        primaryColor={
                                                                             "bg-primary-adele"
                                                                        }
                                                                   />
                                                              </div>
                                                              <div>
                                                                   <InputLabel
                                                                        value="Height Debitur (cm)"
                                                                        required={
                                                                             true
                                                                        }
                                                                   />
                                                                   <TextInput
                                                                        type="text"
                                                                        className="ring-1"
                                                                        placeholder="Height Debitur"
                                                                        value={
                                                                             dataPengajuanDebitur
                                                                                  ?.detail_insurance_life[0]
                                                                                  ?.HEIGHT_DEBITUR
                                                                        }
                                                                        required
                                                                        onChange={(
                                                                             e: any
                                                                        ) => {
                                                                             inputDataDetailForInsurance(
                                                                                  "HEIGHT_DEBITUR",
                                                                                  e
                                                                                       .target
                                                                                       .value,
                                                                                  0
                                                                             );
                                                                        }}
                                                                   />
                                                              </div>
                                                              <div>
                                                                   <InputLabel
                                                                        value="Weight Debitur (kg)"
                                                                        required={
                                                                             true
                                                                        }
                                                                   />
                                                                   <TextInput
                                                                        type="text"
                                                                        className="ring-1"
                                                                        placeholder="Weight Debitur"
                                                                        value={
                                                                             dataPengajuanDebitur
                                                                                  ?.detail_insurance_life[0]
                                                                                  ?.WEIGHT_DEBITUR
                                                                        }
                                                                        required
                                                                        onChange={(
                                                                             e: any
                                                                        ) => {
                                                                             inputDataDetailForInsurance(
                                                                                  "WEIGHT_DEBITUR",
                                                                                  e
                                                                                       .target
                                                                                       .value,
                                                                                  0
                                                                             );
                                                                        }}
                                                                   />
                                                              </div>
                                                              <div>
                                                                   <InputLabel
                                                                        value="Martital Status"
                                                                        required={
                                                                             true
                                                                        }
                                                                   />
                                                                   <SelectTailwind
                                                                        classNames={{
                                                                             menuButton:
                                                                                  () =>
                                                                                       `flex text-sm ring-1 ring-primary-adele text-gray-500 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                                                                             menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                                                                             listItem:
                                                                                  ({
                                                                                       isSelected,
                                                                                  }: any) =>
                                                                                       `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                                                                            isSelected
                                                                                                 ? `text-white bg-primary-adele`
                                                                                                 : `text-gray-500 hover:bg-primary-adele hover:text-white`
                                                                                       }`,
                                                                        }}
                                                                        options={
                                                                             selectMarital
                                                                        }
                                                                        isSearchable={
                                                                             true
                                                                        }
                                                                        placeholder={
                                                                             "--Pilih--"
                                                                        }
                                                                        value={
                                                                             dataPengajuanDebitur
                                                                                  ?.detail_insurance_life[0]
                                                                                  ?.MARITAL_STATUS
                                                                        }
                                                                        onChange={(
                                                                             e: any
                                                                        ) => {
                                                                             inputDataDetailForInsurance(
                                                                                  "MARITAL_STATUS",
                                                                                  e,
                                                                                  0
                                                                             );
                                                                        }}
                                                                        primaryColor={
                                                                             "bg-primary-adele"
                                                                        }
                                                                   />
                                                              </div>
                                                         </div>
                                                    </div>
                                               </fieldset>
                                          </div>
                                     )
                                   : null}
                              <div className="mt-2">
                                   <fieldset className="pb-10 pt-0 rounded-lg border-2">
                                        <legend className="ml-5 px-3 font-medium">
                                             Document
                                        </legend>
                                        <div className="px-4 py-2">
                                             <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
                                                  <div>
                                                       {documentKTP !== "" ? (
                                                            editUploadKTP ===
                                                            true ? (
                                                                 <>
                                                                      <InputLabel
                                                                           value="Upload KTP"
                                                                           required={
                                                                                true
                                                                           }
                                                                      />
                                                                      <div className="flex gap-2 justify-between items-center">
                                                                           <div className="w-full">
                                                                                <input
                                                                                     className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                                                     id="file_input"
                                                                                     type="file"
                                                                                     required
                                                                                     onChange={(
                                                                                          e: any
                                                                                     ) => {
                                                                                          setDataPengajuanDebitur(
                                                                                               {
                                                                                                    ...dataPengajuanDebitur,
                                                                                                    UPLOAD_KTP:
                                                                                                         e
                                                                                                              .target
                                                                                                              .files,
                                                                                               }
                                                                                          );
                                                                                     }}
                                                                                ></input>
                                                                           </div>
                                                                           <div
                                                                                className="text-red-700 hover:cursor-pointer"
                                                                                onClick={() => {
                                                                                     handleClickEditKTP();
                                                                                }}
                                                                           >
                                                                                <XMarkIcon className="w-8" />
                                                                           </div>
                                                                      </div>
                                                                 </>
                                                            ) : (
                                                                 <>
                                                                      <InputLabel
                                                                           value="KTP"
                                                                           required={
                                                                                false
                                                                           }
                                                                      />
                                                                      <div className="flex justify-start items-center gap-3">
                                                                           <div
                                                                                className="text-sm underline hover:cursor-pointer hover:text-blue-400"
                                                                                onClick={() => {
                                                                                     handleFileViewKTP(
                                                                                          documentKTP
                                                                                     );
                                                                                }}
                                                                           >
                                                                                <span>
                                                                                     File
                                                                                     KTP
                                                                                </span>
                                                                           </div>
                                                                           <div
                                                                                onClick={() => {
                                                                                     handleClickEditKTP();
                                                                                }}
                                                                           >
                                                                                <PencilSquareIcon
                                                                                     title="Edit"
                                                                                     className="w-5 hover:cursor-pointer hover:text-blue-400"
                                                                                />
                                                                           </div>
                                                                           <div
                                                                                onClick={() => {
                                                                                     handleFileDownloadKTP(
                                                                                          documentKTP
                                                                                     );
                                                                                }}
                                                                           >
                                                                                <ArrowDownTrayIcon
                                                                                     title="Download"
                                                                                     className="w-5 hover:cursor-pointer hover:text-blue-400"
                                                                                />
                                                                           </div>
                                                                      </div>
                                                                 </>
                                                            )
                                                       ) : (
                                                            <>
                                                                 <InputLabel
                                                                      value="Upload KTP"
                                                                      required={
                                                                           true
                                                                      }
                                                                 />
                                                                 <input
                                                                      className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                                      id="file_input"
                                                                      type="file"
                                                                      required
                                                                      onChange={(
                                                                           e: any
                                                                      ) => {
                                                                           setDataPengajuanDebitur(
                                                                                {
                                                                                     ...dataPengajuanDebitur,
                                                                                     UPLOAD_KTP:
                                                                                          e
                                                                                               .target
                                                                                               .files,
                                                                                }
                                                                           );
                                                                      }}
                                                                 ></input>
                                                            </>
                                                       )}
                                                  </div>
                                                  <div>
                                                       <InputLabel
                                                            value="Upload SPAJK"
                                                            required={true}
                                                       />
                                                       <input
                                                            className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                            id="file_input"
                                                            type="file"
                                                            required
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 setDataPengajuanDebitur(
                                                                      {
                                                                           ...dataPengajuanDebitur,
                                                                           UPLOAD_SPAJK:
                                                                                e
                                                                                     .target
                                                                                     .files,
                                                                      }
                                                                 );
                                                            }}
                                                       ></input>
                                                  </div>
                                             </div>
                                             <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-4 mt-2">
                                                  <div>
                                                       <InputLabel
                                                            value="Upload MCU"
                                                            required={false}
                                                       />
                                                       <input
                                                            className="block w-full text-sm text-gray-600 border rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400"
                                                            id="file_input"
                                                            type="file"
                                                            onChange={(
                                                                 e: any
                                                            ) => {
                                                                 setDataPengajuanDebitur(
                                                                      {
                                                                           ...dataPengajuanDebitur,
                                                                           UPLOAD_MCU:
                                                                                e
                                                                                     .target
                                                                                     .files,
                                                                      }
                                                                 );
                                                            }}
                                                       ></input>
                                                  </div>
                                             </div>
                                        </div>
                                   </fieldset>
                              </div>
                         </>
                    ) : null}
               </div>
          </>
     );
}
