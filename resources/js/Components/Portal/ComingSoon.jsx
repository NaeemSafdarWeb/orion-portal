import { Lock } from 'lucide-react';

/**
 * Honest placeholder for screens that belong to a later phase.
 *
 * Better than an empty page or fake data: the client can see the screen exists,
 * what it will do, and when it is due.
 */
export default function ComingSoon({ icon: Icon = Lock, phase, description, features = [] }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 sm:px-10">
            <div className="mx-auto max-w-lg text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Icon className="h-6 w-6 text-slate-400" strokeWidth={1.6} />
                </div>

                {phase && (
                    <span className="mt-5 inline-block rounded-full bg-[#E11D23]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#E11D23]">
                        {phase}
                    </span>
                )}

                <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>

                {features.length > 0 && (
                    <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
                        {features.map((feature) => (
                            <li key={feature} className="flex gap-2.5 text-sm text-slate-500">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
