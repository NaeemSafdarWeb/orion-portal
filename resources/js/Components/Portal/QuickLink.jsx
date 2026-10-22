import { ArrowUpRight } from 'lucide-react';

/**
 * External shortcuts: MCS-150, MCS-90, SAFER, Texas UCR, Clearing House.
 * Richard confirmed these are links out, not data we pull in.
 * rel="noreferrer" because these are third party government sites.
 */
export default function QuickLink({ href, label, collapsed = false }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? label : undefined}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
            {!collapsed && <span className="truncate">{label}</span>}
        </a>
    );
}
