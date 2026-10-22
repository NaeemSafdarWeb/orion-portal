import { Link } from '@inertiajs/react';

/**
 * Sidebar item. Active state is the solid red block from the wireframe.
 */
export default function NavLink({ href, icon: Icon, label, count, badge, active = false, collapsed = false }) {
    return (
        <Link
            href={href}
            title={collapsed ? label : undefined}
            className={[
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                    ? 'bg-[#E11D23] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100',
            ].join(' ')}
        >
            {Icon && (
                <Icon
                    className={['h-5 w-5 shrink-0', active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'].join(' ')}
                    strokeWidth={1.8}
                />
            )}

            {!collapsed && (
                <>
                    <span className="flex-1 truncate">
                        {label}
                        {count !== undefined && (
                            <span className={['block text-xs font-normal', active ? 'text-white/80' : 'text-slate-400'].join(' ')}>
                                {count} items
                            </span>
                        )}
                    </span>

                    {badge && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {badge}
                        </span>
                    )}
                </>
            )}
        </Link>
    );
}
