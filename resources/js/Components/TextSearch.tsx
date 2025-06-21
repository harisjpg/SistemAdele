import {
     MagnifyingGlassCircleIcon,
     MagnifyingGlassIcon,
     MagnifyingGlassPlusIcon,
     XMarkIcon,
} from "@heroicons/react/20/solid";
import {
     forwardRef,
     useEffect,
     useImperativeHandle,
     useRef,
     InputHTMLAttributes,
} from "react";
import { MagnifyingGlass } from "react-loader-spinner";

interface TextSearchProps
     extends Omit<
          InputHTMLAttributes<HTMLInputElement>,
          "action" | "setRefreshTrigger"
     > {
     isFocused?: boolean;
     setRefreshTrigger?: any;
     setSearch?: any;
     search?: any;
}

const TextSearch = forwardRef<HTMLInputElement, TextSearchProps>(
     function TextSearch(
          {
               type = "text",
               className = "",
               isFocused = false,
               setSearch,
               setRefreshTrigger,
               search,
               ...props
          },
          ref
     ) {
          const localRef = useRef<HTMLInputElement>(null);

          useImperativeHandle(ref, () => localRef.current!);

          useEffect(() => {
               if (isFocused) {
                    localRef.current?.focus();
               }
          }, [isFocused]);

          const handleClear = () => {
               if (localRef.current) {
                    setSearch("");

                    // Use the prop if provided
                    setRefreshTrigger("success");
                    setTimeout(() => {
                         setRefreshTrigger("");
                    }, 1000);
               }
          };

          return (
               <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                         {...props}
                         type={type}
                         className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white sm:text-sm sm:leading-6 ${className}`}
                         ref={localRef}
                    />
                    {search && (
                         <XMarkIcon
                              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600"
                              onClick={handleClear}
                         />
                    )}
               </div>
          );
     }
);

export default TextSearch;
