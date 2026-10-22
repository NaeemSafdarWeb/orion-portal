import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import Sidebar from '@/Components/Portal/Sidebar';

/**
 * The shell every portal screen sits in: sidebar, page title, content area.
 *
 * The collapsed state is remembered in localStorage so it survives page
 * changes, which matters on a system people keep open all day.
 */
export default function PortalLayout({ title, actions, counts, children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setCollapsed(localStorage.getItem('orion.sidebar.collapsed') === '1');
    }, []);

    const toggleCollapse = () => {
        setCollapsed((prev) => {
            localStorage.setItem('orion.sidebar.collapsed', prev ? '0' : '1');
            return !prev;
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title={title} />

            <Sidebar
                collapsed={collapsed}
                onToggleCollapse={toggleCollapse}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                counts={counts}
            />

            <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Mobile bar */}
                <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="rounded p-1 text-slate-600 hover:bg-slate-100"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="text-base font-bold uppercase tracking-tight text-slate-900">{title}</span>
                </div>

                <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
                        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">
                            {title}
                        </h1>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>

                    {actions && <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">{actions}</div>}

                    {children}
                </main>
            </div>
        </div>
    );
}
