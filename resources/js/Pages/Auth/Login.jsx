import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post(route ? route('login') : '/login');
    };

    return (
        <GuestLayout>
            <Head title="Sign in" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Enter your details to access the compliance portal.
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
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border-slate-300 text-slate-900 shadow-sm transition focus:border-[#E11D23] focus:ring-[#E11D23]"
                    />
                    {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-[#E11D23] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <div className="relative mt-1.5">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-lg border-slate-300 pr-10 text-slate-900 shadow-sm transition focus:border-[#E11D23] focus:ring-[#E11D23]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
                </div>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-slate-300 text-[#E11D23] shadow-sm focus:ring-[#E11D23]"
                    />
                    <span className="text-sm text-slate-600">Keep me signed in</span>
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E11D23] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4161b] focus:outline-none focus:ring-2 focus:ring-[#E11D23] focus:ring-offset-2 disabled:opacity-60"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Sign in
                </button>
            </form>
        </GuestLayout>
    );
}
