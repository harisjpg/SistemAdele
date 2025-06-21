import {
     forwardRef,
     useEffect,
     useImperativeHandle,
     useRef,
     InputHTMLAttributes,
} from "react";

export default forwardRef(function TextInput(
     {
          type = "text",
          className = "",
          isFocused = false,
          ...props
     }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
     ref
) {
     const localRef = useRef<HTMLInputElement>(null);

     useImperativeHandle(ref, () => ({
          focus: () => localRef.current?.focus(),
     }));

     useEffect(() => {
          if (isFocused) {
               localRef.current?.focus();
          }
     }, []);

     return (
          <input
               {...props}
               type={type}
               className={
                    `block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:bg-white sm:text-sm sm:leading-6 ` +
                    className
               }
               ref={localRef}
          />
     );
});
