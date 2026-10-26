import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import Sidebar from '@/Components/Portal/Sidebar';

/**
 * The shell every portal screen sits in: sidebar, page header, content area.
 *
 * `title`    short page name, shown uppercase as in the wireframe
 * `subtitle` optional line of context underneath
 * `actions`  buttons on the right of the header
 */
export default function PortalLayout({ title, subtitle, actions, counts, children }) {
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
                    <span className="text-sm font-bold uppercase tracking-wide text-slate-900">{title}</span>
                </div>

                <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    {/* Page header */}
                    <div className="mb-6 hidden lg:block">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="h-5 w-1 rounded-full bg-[#E11D23]" aria-hidden="true" />
                                    <h1 className="text-xl font-bold uppercase tracking-[0.08em] text-slate-900">
                                        {title}
                                    </h1>
                                </div>
                                {subtitle && (
                                    <p className="mt-1.5 pl-4 text-sm text-slate-500">{subtitle}</p>
                                )}
                            </div>

                            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                        </div>

                        <div className="mt-5 border-b border-slate-200" />
                    </div>

                    {actions && <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">{actions}</div>}

                    {children}
                </main>
            </div>
        </div>
    );
}
