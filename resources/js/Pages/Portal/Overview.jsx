import { useState } from 'react';
import { Building2, TriangleAlert, UserRound, Truck, FileWarning } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';

const GROUPS = [
    {
        key: 'companies',
        label: 'All Companies',
        icon: Building2,
        detail: 'The company list and detail panel are built in Milestone 2. Each company will open to show its address, DOT and MC numbers, contacts, and the drivers and vehicles underneath it.',
    },
    {
        key: 'alerts',
        label: 'All Alerts',
        icon: TriangleAlert,
        detail: 'Every company with something expired or due soon, grouped by company. The drivers, vehicles and document tables from your wireframe are built in Milestone 3.',
    },
    {
        key: 'drivers',
        label: 'Driver Alerts',
        icon: UserRound,
        detail: 'Drivers with an expired or expiring licence or medical card. The driver detail view with document cards is built in Milestone 3.',
    },
    {
        key: 'vehicles',
        label: 'Vehicle Alerts',
        icon: Truck,
        detail: 'Vehicles with an expired or expiring registration or inspection. The vehicle detail view is built in Milestone 3.',
    },
    {
        key: 'other',
        label: 'Other Alerts',
        icon: FileWarning,
        detail: 'Company level documents such as IFTA and MCS-150. Built in Milestone 3.',
    },
];

export default function Overview({ stats = {} }) {
    const [selected, setSelected] = useState('companies');
    const active = GROUPS.find((g) => g.key === selected) ?? GROUPS[0];

    return (
        <PortalLayout title="Overview" subtitle="Compliance status across all companies">
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="space-y-2">
                        {GROUPS.map(({ key, label, icon: Icon }) => {
                            const isActive = key === selected;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelected(key)}
                                    aria-pressed={isActive}
                                    className={[
                                        'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                                        isActive
                                            ? 'bg-[#E11D23] text-white'
                                            : 'bg-slate-50 text-slate-800 hover:bg-slate-100',
                                    ].join(' ')}
                                >
                                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                                    <span className="flex-1">
                                        <span className="block text-sm font-semibold">{label}</span>
                                        <span className={`block text-xs ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                                            {stats[key] ?? 0} items
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 sm:px-10">
                    <div className="mx-auto max-w-md text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <active.icon className="h-6 w-6 text-slate-400" strokeWidth={1.6} />
                        </div>

                        <h2 className="mt-5 text-base font-semibold text-slate-900">{active.label}</h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                            {stats[active.key] ?? 0} {stats[active.key] === 1 ? 'item' : 'items'}
                        </p>

                        <p className="mt-5 text-sm leading-relaxed text-slate-600">{active.detail}</p>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
