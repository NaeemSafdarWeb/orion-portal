import { usePage } from '@inertiajs/react';
import { LayoutGrid, Users, MonitorCog, Bell, ChevronLeft, X } from 'lucide-react';
import NavLink from './NavLink';
import QuickLink from './QuickLink';
import UserMenu from './UserMenu';

const QUICK_LINKS = [
    { label: 'MCS - 150', href: 'https://www.fmcsa.dot.gov/registration/form-mcs-150-and-instructions-motor-carrier-identification-report' },
    { label: 'MCS - 90', href: 'https://www.fmcsa.dot.gov/registration/form-mcs-90-endorsement-motor-carrier-policies-insurance-public-liability' },
    { label: 'SAFER', href: 'https://safer.fmcsa.dot.gov/CompanySnapshot.aspx' },
    { label: 'Texas UCR', href: 'https://www.ucr.gov/' },
    { label: 'Clearing House', href: 'https://clearinghouse.fmcsa.dot.gov/' },
];

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile, counts = {} }) {
    const { auth, url } = usePage().props;
    const current = typeof window !== 'undefined' ? window.location.pathname : '';

    const isActive = (path) => current === path || current.startsWith(path + '/');

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200',
                    collapsed ? 'lg:w-20' : 'lg:w-64',
                    'w-64',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                ].join(' ')}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 pt-6 pb-5">
                    <div className={collapsed ? 'lg:hidden' : ''}>
                        <div className="text-xl font-extrabold tracking-tight leading-none">
                            <span className="text-slate-900">ORION</span>
                            <span className="text-[#E11D23]">DOT</span>
                        </div>
                        <div className="mt-1 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                            Transportation · Safety · Compliance
                        </div>
                    </div>

                    {collapsed && (
                        <div className="hidden w-full text-center text-xl font-extrabold lg:block">
                            <span className="text-[#E11D23]">D</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* User */}
                <div className="border-b border-slate-100 px-4 pb-4">
                    <UserMenu user={auth?.user} collapsed={collapsed} />
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    {!collapsed && (
                        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Main
                        </p>
                    )}

                    <div className="space-y-1">
                        <NavLink href="/overview" icon={LayoutGrid} label="Overview" active={isActive('/overview')} collapsed={collapsed} />
                        <NavLink href="/users" icon={Users} label="Users" active={isActive('/users')} collapsed={collapsed} />
                        <NavLink href="/roles" icon={MonitorCog} label="Roles & Permissions" active={isActive('/roles')} collapsed={collapsed} />
                        <NavLink
                            href="/notifications"
                            icon={Bell}
                            label="Notifications"
                            badge={counts.notifications ? `${counts.notifications} New` : null}
                            active={isActive('/notifications')}
                            collapsed={collapsed}
                        />
                    </div>

                    <div className="mt-7">
                        {!collapsed && (
                            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Quick Links
                            </p>
                        )}

                        <div className="space-y-0.5">
                            {QUICK_LINKS.map((link) => (
                                <QuickLink key={link.label} {...link} collapsed={collapsed} />
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Collapse toggle, the small circle on the sidebar edge in the wireframe */}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="absolute -right-3 top-28 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:text-slate-700 lg:flex"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </aside>
        </>
    );
}
