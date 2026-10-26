import { Link } from '@inertiajs/react';

/**
 * Shared shell for login, forgot password and reset password.
 * Restyling this one file brands every auth screen at once.
 */
export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-10">
            <div className="w-full max-w-md">
                {/* Wordmark */}
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block">
                        <div className="text-3xl font-extrabold tracking-tight leading-none">
                            <span className="text-slate-900">ORION</span>
                            <span className="text-[#E11D23]">DOT</span>
                        </div>
                        <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                            Transportation · Safety · Compliance
                        </div>
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-7 py-8 shadow-sm sm:px-9">
                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Authorised access only. Activity on this portal is recorded.
                </p>
            </div>
        </div>
    );
}
