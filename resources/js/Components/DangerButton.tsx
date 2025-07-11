import { ButtonHTMLAttributes } from "react";

export default function DangerButton({
     className = "",
     disabled,
     children,
     ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
     return (
          <button
               {...props}
               className={
                    `inline-flex items-center px-4 py-2 bg-primary-adele border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-adele active:bg-primary-adele focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                         disabled && "opacity-25"
                    } ` + className
               }
               disabled={disabled}
          >
               {children}
          </button>
     );
}
