/**
 * Brand primary button. Breeze ships this in near-black, which clashes with the
 * red used everywhere else. Overriding it here recolours every Breeze form
 * (profile, password update, confirm password) in one go.
 */
export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg bg-[#E11D23] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[#c4161b] focus:bg-[#c4161b] focus:outline-none focus:ring-2 focus:ring-[#E11D23] focus:ring-offset-2 active:bg-[#a81317] ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
