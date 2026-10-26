import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout>
            <Head title="Reset password" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Reset your password</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Enter your email address and we will send you a link to set a new password.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border-slate-300 text-slate-900 shadow-sm transition focus:border-[#E11D23] focus:ring-[#E11D23]"
                    />
                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E11D23] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4161b] disabled:opacity-60"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Send reset link
                </button>

                <Link href="/login" className="block text-center text-sm text-slate-500 hover:text-slate-800">
                    Back to sign in
                </Link>
            </form>
        </GuestLayout>
    );
}
