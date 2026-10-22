import { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, User as UserIcon, LogOut } from 'lucide-react';

export default function UserMenu({ user, collapsed = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const initials = (user?.name || '?')
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors hover:bg-slate-100"
            >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                    {initials}
                </span>

                {!collapsed && (
                    <>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {user?.role?.name || 'User'}
                            </span>
                            <span className="block truncate text-sm font-medium text-slate-800">{user?.name}</span>
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {open && (
                <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        Profile
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <LogOut className="h-4 w-4 text-slate-400" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
