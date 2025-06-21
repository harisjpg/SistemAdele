import { InputHTMLAttributes } from "react";

export default function Checkbox({
     className = "",
     ...props
}: InputHTMLAttributes<HTMLInputElement>) {
     return (
          <input
               {...props}
               type="checkbox"
               className={
                    "rounded border-gray-300 text-primary-adele shadow-sm focus:ring-primary-adele" +
                    className
               }
          />
     );
}
