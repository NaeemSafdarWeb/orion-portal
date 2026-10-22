import PortalLayout from '@/Layouts/PortalLayout';
import { Building2, TriangleAlert, UserRound, Truck, FileWarning } from 'lucide-react';

/**
 * Milestone 1 shell. The three column layout from the wireframe is here, but
 * the data arrives in Milestones 2 and 3.
 */
const GROUPS = [
    { key: 'companies', label: 'All Companies', icon: Building2, tone: 'red' },
    { key: 'alerts', label: 'All Alerts', icon: TriangleAlert, tone: 'slate' },
    { key: 'drivers', label: 'Driver Alerts', icon: UserRound, tone: 'slate' },
    { key: 'vehicles', label: 'Vehicle Alerts', icon: Truck, tone: 'slate' },
    { key: 'other', label: 'Other Alerts', icon: FileWarning, tone: 'slate' },
];

export default function Overview({ stats = {} }) {
    return (
        <PortalLayout title="Overview">
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                {/* Group selector */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="space-y-2">
                        {GROUPS.map(({ key, label, icon: Icon, tone }) => (
                            <button
                                key={key}
                                type="button"
                                className={[
                                    'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                                    tone === 'red'
                                        ? 'bg-[#E11D23] text-white'
                                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100',
                                ].join(' ')}
                            >
                                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                                <span className="flex-1">
                                    <span className="block text-sm font-semibold">{label}</span>
                                    <span className={`block text-xs ${tone === 'red' ? 'text-white/80' : 'text-slate-400'}`}>
                                        {stats[key] ?? 0} items
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail area */}
                <div className="rounded-xl border border-slate-200 bg-white p-8">
                    <div className="flex h-64 items-center justify-center text-center">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Company, driver and vehicle records arrive in Milestone 2.
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                Documents and alerts follow in Milestone 3.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
