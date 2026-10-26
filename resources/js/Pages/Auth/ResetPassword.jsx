import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => () => reset('password', 'password_confirmation'), []);

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    const field = 'mt-1.5 block w-full rounded-lg border-slate-300 text-slate-900 shadow-sm transition focus:border-[#E11D23] focus:ring-[#E11D23]';

    return (
        <GuestLayout>
            <Head title="Set a new password" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Set a new password</h1>
                <p className="mt-1 text-sm text-slate-500">Choose a password you have not used before.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                    <input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={field} />
                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">New password</label>
                    <input id="password" type="password" value={data.password} autoFocus autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} className={field} />
                    {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700">Confirm new password</label>
                    <input id="password_confirmation" type="password" value={data.password_confirmation} autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} className={field} />
                    {errors.password_confirmation && <p className="mt-1.5 text-sm text-red-600">{errors.password_confirmation}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E11D23] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4161b] disabled:opacity-60"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Save new password
                </button>
            </form>
        </GuestLayout>
    );
}
