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

export default function EditExtraPremi({
     dataEditPremi,
     setDataEditPremi,
}: PropsWithChildren<{
     dataEditPremi: any;
     setDataEditPremi: any;
}>) {
     const totalPremi = () => {
          let totalPremi = 0;
          if (dataEditPremi.dataRateHistory[0] === null) {
               var amountCombination =
                    dataEditPremi.dataOfferDetail[0]
                         ?.OFFER_DETAIL_AMOUNT_COMBINATION === null
                         ? 0
                         : dataEditPremi.dataOfferDetail[0]
                                ?.OFFER_DETAIL_AMOUNT_COMBINATION;

               totalPremi =
                    parseInt(
                         dataEditPremi.dataOfferDetail[0]?.OFFER_DETAIL_AMOUNT
                    ) +
                    parseInt(amountCombination) +
                    parseInt(
                         dataEditPremi.dataOfferDetail[0]
                              ?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI
                    );
          } else {
               var extraPremi =
                    dataEditPremi.dataOfferDetail[0]
                         ?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI;

               var premiumCombination =
                    dataEditPremi.dataRateHistory[0]
                         ?.rate_history_premium_combination !== null
                         ? dataEditPremi.dataRateHistory[0]
                                ?.rate_history_premium_combination
                         : "0";

               totalPremi =
                    parseInt(
                         dataEditPremi.dataRateHistory[0]
                              ?.rate_history_premium_regular
                    ) +
                    parseInt(premiumCombination) +
                    parseInt(extraPremi);
          }

          return totalPremi;
     };

     const inputDataDebitur = (name: string, value: any, i: number) => {
          const number = value.replace(/\./g, "").replace(",", ".");
          const convertNumber = number.toLocaleString("en-US", {
               minimumFractionDigits: 2,
               maximumFractionDigits: 2,
          });

          const changeVal: any = [...dataEditPremi.dataOfferDetail];
          changeVal[i][name] = convertNumber;
          setDataEditPremi({
               ...dataEditPremi,
               dataOfferDetail: changeVal,
          });
     };

     const handleChangeExtraPremi = async (e: any) => {
          // const number = e.target.value.replace(/\./g, "").replace(",", ".");
          // const convertNumber = number.toLocaleString("en-US", {
          //      minimumFractionDigits: 2,
          //      maximumFractionDigits: 2,
          // });

          // var premiRegular =
          //      dataEditPremi.dataRateHistory[0] === null
          //           ? dataEditPremi.dataOfferDetail[0]?.OFFER_DETAIL_AMOUNT
          //           : dataEditPremi.dataRateHistory[0]
          //                  ?.rate_history_premium_regular;

          return totalPremi();
     };
     return (
          <section>
               <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="col-span-3">
                         <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1">
                                   <InputLabel
                                        value="Tenor Regular (Bulan)"
                                        required={true}
                                   />
                              </div>
                              <div className="col-span-2">
                                   <TextInput
                                        type="text"
                                        className="ring-1 text-right bg-gray-400"
                                        readOnly
                                        disabled
                                        placeholder="Tenor Regular"
                                        value={
                                             dataEditPremi.dataOfferDetail[0]
                                                  ?.OFFER_TENOR
                                        }
                                        required
                                        onChange={(e: any) => {}}
                                   />
                              </div>
                         </div>
                    </div>
                    <div className="col-span-2">
                         <TextInput
                              type="text"
                              className="ring-1 text-right bg-gray-400"
                              readOnly
                              disabled
                              placeholder="Tenor Regular"
                              value={
                                   dataEditPremi.dataOfferDetail[0]?.OFFER_TENOR
                              }
                              required
                              onChange={(e: any) => {}}
                         />
                    </div>
               </div>
               <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="col-span-3">
                         <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1">
                                   <InputLabel
                                        value="Rate Regular"
                                        required={true}
                                   />
                              </div>
                              <div className="col-span-2">
                                   <TextInput
                                        type="text"
                                        className="ring-1 text-right bg-gray-400"
                                        disabled
                                        placeholder="Rate Regular"
                                        value={
                                             dataEditPremi
                                                  .dataRateHistory[0] === null
                                                  ? new Intl.NumberFormat(
                                                         "en-US",
                                                         {
                                                              style: "decimal",
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                         }
                                                    ).format(
                                                         dataEditPremi
                                                              .dataOfferDetail[0]
                                                              ?.OFFER_DETAIL_RATE
                                                    )
                                                  : new Intl.NumberFormat(
                                                         "en-US",
                                                         {
                                                              style: "decimal",
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                         }
                                                    ).format(
                                                         dataEditPremi
                                                              .dataRateHistory[0]
                                                              ?.rate_history_rate_regular
                                                    )
                                        }
                                        required
                                        onChange={(e: any) => {}}
                                   />
                              </div>
                         </div>
                    </div>
                    <div className="col-span-2">
                         <TextInput
                              type="text"
                              className="ring-1 text-right"
                              placeholder="Rate Regular"
                              value={new Intl.NumberFormat("en-US", {
                                   style: "decimal",
                                   minimumFractionDigits: 2,
                                   maximumFractionDigits: 2,
                              }).format(
                                   dataEditPremi.dataOfferDetail[0]
                                        ?.OFFER_DETAIL_RATE
                              )}
                              required
                              onChange={(e: any) => {}}
                         />
                    </div>
               </div>
               <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="col-span-3">
                         <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1">
                                   <InputLabel
                                        value="Premi Regular"
                                        required={true}
                                   />
                              </div>
                              <div className="col-span-2">
                                   <TextInput
                                        type="text"
                                        className="ring-1 text-right bg-gray-400"
                                        placeholder="Premi Regular"
                                        value={
                                             dataEditPremi
                                                  .dataRateHistory[0] === null
                                                  ? new Intl.NumberFormat(
                                                         "en-US",
                                                         {
                                                              style: "decimal",
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                         }
                                                    ).format(
                                                         dataEditPremi
                                                              .dataOfferDetail[0]
                                                              ?.OFFER_DETAIL_AMOUNT
                                                    )
                                                  : new Intl.NumberFormat(
                                                         "en-US",
                                                         {
                                                              style: "decimal",
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                         }
                                                    ).format(
                                                         dataEditPremi
                                                              .dataRateHistory[0]
                                                              ?.rate_history_premium_regular
                                                    )
                                        }
                                        required
                                        onChange={(e: any) => {}}
                                   />
                              </div>
                         </div>
                    </div>
                    <div className="col-span-2">
                         <TextInput
                              type="text"
                              className="ring-1 text-right"
                              placeholder="Premi Regular"
                              value={new Intl.NumberFormat("en-US", {
                                   style: "decimal",
                                   minimumFractionDigits: 2,
                                   maximumFractionDigits: 2,
                              }).format(
                                   dataEditPremi.dataOfferDetail[0]
                                        ?.OFFER_DETAIL_AMOUNT
                              )}
                              required
                              onChange={(e: any) => {}}
                         />
                    </div>
               </div>
               <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="col-span-3">
                         <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1">
                                   <InputLabel
                                        value="Nominal Extra Premi"
                                        required={true}
                                   />
                              </div>
                              {/* <div className="col-span-2">
                                   <TextInput
                                        type="text"
                                        className="ring-1"
                                        placeholder="Premi Regular"
                                        value={""}
                                        required
                                        onChange={(e: any) => {}}
                                   />
                              </div> */}
                         </div>
                    </div>
                    <div className="col-span-2">
                         <CurrencyInput
                              value={
                                   dataEditPremi.dataOfferDetail[0]
                                        ?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI ===
                                   null
                                        ? "0"
                                        : dataEditPremi.dataOfferDetail[0]?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI.toLocaleString(
                                               "en-US",
                                               {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                               }
                                          )
                              }
                              decimalScale={2}
                              decimalsLimit={2}
                              onValueChange={(val: any) => {
                                   inputDataDebitur(
                                        "OFFER_DETAIL_AMOUNT_EXTRA_PREMI",
                                        val,
                                        0
                                   );
                              }}
                              onKeyUp={(e) => {
                                   handleChangeExtraPremi(e);
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 text-right"
                              required
                              placeholder="0.00"
                              autoComplete="off"
                         />
                         {/* <TextInput
                              type="text"
                              className="ring-1 text-right"
                              value={
                                   dataEditPremi.dataOfferDetail[0]
                                        ?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI ===
                                   null
                                        ? "0"
                                        : dataEditPremi.dataOfferDetail[0]?.OFFER_DETAIL_AMOUNT_EXTRA_PREMI.toLocaleString(
                                               "en-US",
                                               {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                               }
                                          )
                              }
                              required
                              onChange={(e: any) => {
                                   inputDataDebitur(
                                        "OFFER_DETAIL_AMOUNT_EXTRA_PREMI",
                                        e,
                                        0
                                   );
                              }}
                         /> */}
                    </div>
               </div>
               <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="col-span-3">
                         <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-1">
                                   <InputLabel
                                        value="Total Premi"
                                        required={true}
                                   />
                                   <span className="text-[9px] italic">
                                        (Premi Regular + Extra Premi)
                                   </span>
                              </div>
                              {/* <div className="col-span-2">
                                   <TextInput
                                        type="text"
                                        className="ring-1"
                                        placeholder="Premi Regular"
                                        value={""}
                                        required
                                        onChange={(e: any) => {}}
                                   />
                              </div> */}
                         </div>
                    </div>
                    <div className="col-span-2">
                         <TextInput
                              type="text"
                              className="ring-1 bg-gray-400 text-right font-semibold"
                              disabled
                              placeholder="Premi Regular"
                              value={new Intl.NumberFormat("en-US", {
                                   style: "decimal",
                                   minimumFractionDigits: 2,
                                   maximumFractionDigits: 2,
                              }).format(totalPremi())}
                              required
                              onChange={(e: any) => {}}
                         />
                    </div>
               </div>
          </section>
     );
}
