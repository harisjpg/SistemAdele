import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PropsWithChildren } from "react";
import PrimaryButton from "../Button/PrimaryButton";
import axios from "axios";
import Alert from "../Alert";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function ModalToDocument({
    show = false,
    closeable = true,
    onClose = () => {},
    title,
    body,
    url,
    data,
    method,
    onSuccess,
    headers,
    submitButtonName,
    classPanel,
}: PropsWithChildren<{
    show: boolean;
    closeable?: boolean;
    onClose: CallableFunction;
    title: string;
    body: any;
    url: string;
    data: any | null;
    method: string;
    onSuccess: any | null | undefined;
    headers: any | null | undefined;
    classPanel: any;
    submitButtonName: string | null;
}>) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isError, setIsError] = useState<string>("");
    const modalRef = useRef(null);

    const close = () => {
        if (closeable) {
            onClose();
            setIsError("");
        }
    };

    const callAxios = axios.create({
        headers,
    });

    const action = async (e: any) => {
        e.preventDefault();

        setIsProcessing(true);
        // onSuccess("");

        await callAxios({ url, data, method })
            .then((res) => {
                setIsProcessing(false);
                setIsError("");
                if (
                    onSuccess !== null ||
                    onSuccess !== "" ||
                    onSuccess !== undefined
                ) {
                    onSuccess(res.data);
                }
                close();
            })
            .catch((err) => {
                setIsProcessing(false);
                // setIsError(err.response.data);
                console.log(err);
            });
    };

    return (
        <>
            <Transition.Root show={show} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-9999"
                    onClose={close}
                    initialFocus={modalRef}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full justify-center p-4 text-center items-center lg:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className={classPanel}>
                                    <form onSubmit={action}>
                                        <div className="bg-gray-100 px-4 pb-4 pt-3 sm:pb-4">
                                            <div className="flex justify-between">
                                                <div className="px-1">
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-xl font-semibold leading-6 text-gray-900"
                                                    >
                                                        {title}
                                                    </Dialog.Title>
                                                </div>
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={close}
                                                >
                                                    <span>
                                                        <XMarkIcon className="w-7" />
                                                    </span>
                                                </div>
                                            </div>
                                            <hr className="my-3" />
                                            {isError && (
                                                <Alert body={isError} />
                                            )}
                                            {/* <div className="max-h-full"> */}
                                            <div
                                                className="modal-action h-full overflow-y-auto custom-scrollbar px-2"
                                                ref={modalRef}
                                            >
                                                {body}
                                            </div>
                                            {/* </div> */}
                                        </div>
                                        <div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            {submitButtonName && (
                                                <PrimaryButton
                                                    className="inline-flex w-full sm:ml-3 sm:w-auto"
                                                    disabled={isProcessing}
                                                >
                                                    {submitButtonName}
                                                </PrimaryButton>
                                            )}
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={close}
                                            >
                                                {data ? "Cancel" : "Close"}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
