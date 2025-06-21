import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard({ auth, language, colorSetting }: any) {
     // props language dikirim langsung dari middleware Language yang diinject langsung melalui Inertia. cek file Language.php di folder Middleware
     // kemudian ambil array pertama dari language
     // selanjutnya, tinggal panggil di tiap string yang mau diambil dari file language. contoh: lang.policy --ada di bawah contohnya--
     const lang: any = language[0];

     // use effect
     useEffect(() => {
          getAllTotal();
     }, []);
     // end use effect

     const [totalPengajuan, setTotalPengajuan] = useState<any>({
          Penutupan: "",
          Pengajuan: "",
          Proses: "",
          Setuju: "",
          Pending: "",
          Tolak: "",
          Batal: "",
     });
     const getAllTotal = async () => {
          await axios
               .post(`/getAllTotal`, {})
               .then((res) => {
                    setTotalPengajuan({
                         ...totalPengajuan,
                         Penutupan: res.data.arrDataPenutupan,
                         Pengajuan: res.data.arrDataPengajuan,
                         Proses: res.data.arrDataProses,
                         Setuju: res.data.arrDataSetuju,
                         Pending: res.data.arrDataPending,
                         Tolak: res.data.arrDataTolak,
                         Batal: res.data.arrDataBatal,
                    });
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     const stats = [
          { name: "Penutupan", stat: totalPengajuan.Penutupan, filter: "0" },
          { name: "Pengajuan", stat: totalPengajuan.Pengajuan, filter: "1" },
          { name: "Proses", stat: totalPengajuan.Proses, filter: "2" },
          { name: "Setuju", stat: totalPengajuan.Setuju, filter: "3" },
          { name: "Pending", stat: totalPengajuan.Pending, filter: "4" },
          { name: "Tolak", stat: totalPengajuan.Tolak, filter: "5" },
          { name: "Batal", stat: totalPengajuan.Batal, filter: "6" },
     ];

     const className = colorSetting?.SETTING_PAGE_COLOR;

     // // State untuk menyimpan warna
     // const [color, setColor] = useState<any>("");
     // useEffect(() => {
     //     const fetchedColor = colorSetting.SETTING_PAGE_COLOR;
     //     setColor(fetchedColor);
     // }, [colorSetting.SETTING_PAGE_COLOR]);
     // // End For Setting Color
     // console.log(color);

     return (
          <AuthenticatedLayout user={auth.user} header={lang.dashboard}>
               <Head title={lang.dashboard} />

               {/* <div className="hidden">
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                         {auth.user.user_type_id === 3 ||
                         auth.user.user_type_id === 4
                              ? stats
                                     ?.filter(
                                          (dataFilter: any) =>
                                               dataFilter.name !== "Pengajuan"
                                     )
                                     ?.map((item) => (
                                          <div
                                               key={item.name}
                                               className={
                                                    `overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6` +
                                                         className !==
                                                    ""
                                                         ? `overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 bg-white hover:cursor-pointer hover:shadow-lg`
                                                         : "overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6"
                                               }
                                               onClick={() => {
                                                    item.name === "Penutupan"
                                                         ? Inertia.visit(
                                                                "/penutupan"
                                                           )
                                                         : Inertia.visit(
                                                                "/pengajuanDebitur",
                                                                {
                                                                     data: {
                                                                          filter: item.filter,
                                                                     },
                                                                }
                                                           );
                                               }}
                                          >
                                               <dt className="truncate text-sm font-medium text-gray-500">
                                                    {item.name}
                                               </dt>
                                               <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                                    {item.stat}
                                               </dd>
                                          </div>
                                     ))
                              : stats.map((item) => (
                                     <div
                                          key={item.name}
                                          className={
                                               `overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6` +
                                                    className !==
                                               ""
                                                    ? `overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 bg-white hover:cursor-pointer hover:shadow-lg`
                                                    : "overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6"
                                          }
                                          onClick={() => {
                                               item.name === "Penutupan"
                                                    ? Inertia.visit(
                                                           "/penutupan"
                                                      )
                                                    : Inertia.visit(
                                                           "/pengajuanDebitur",
                                                           {
                                                                data: {
                                                                     filter: item.filter,
                                                                },
                                                           }
                                                      );
                                          }}
                                     >
                                          <dt className="truncate text-sm font-medium text-gray-500">
                                               {item.name}
                                          </dt>
                                          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                                               {item.stat}
                                          </dd>
                                     </div>
                                ))}
                    </dl>
               </div> */}
          </AuthenticatedLayout>
     );
}
