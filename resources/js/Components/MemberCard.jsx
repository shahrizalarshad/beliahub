import ApplicationLogo from '@/Components/ApplicationLogo';
import Avatar from '@/Components/Avatar';

function ChipIcon() {
    return (
        <svg
            viewBox="0 0 32 24"
            className="h-5 w-7 text-amber-200/90"
            fill="none"
        >
            <rect
                x="0.5"
                y="0.5"
                width="31"
                height="23"
                rx="4"
                fill="currentColor"
                fillOpacity="0.35"
                stroke="currentColor"
            />
            <line x1="0.5" y1="8" x2="31.5" y2="8" stroke="currentColor" />
            <line x1="0.5" y1="16" x2="31.5" y2="16" stroke="currentColor" />
            <line x1="11" y1="0.5" x2="11" y2="23.5" stroke="currentColor" />
            <line x1="21" y1="0.5" x2="21" y2="23.5" stroke="currentColor" />
        </svg>
    );
}

// Kad ahli digital bergaya kad fizikal / wallet pass (nisbah ~ID card).
export default function MemberCard({ member, qrSvg }) {
    return (
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-6 text-white shadow-2xl sm:p-8">
            {/* Corak latar */}
            <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -start-10 h-64 w-64 rounded-full bg-emerald-900/20" />

            <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <ApplicationLogo className="h-8 w-8 text-emerald-600" />
                    </span>
                    <div>
                        <p className="text-base font-bold leading-tight tracking-tight">
                            Belia Hub
                        </p>
                        <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-100">
                            Kad Ahli Digital
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ChipIcon />
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            member.is_active
                                ? 'bg-white/20 text-white'
                                : 'bg-red-500/80 text-white'
                        }`}
                    >
                        {member.is_active ? 'AKTIF' : 'TIDAK AKTIF'}
                    </span>
                </div>
            </div>

            <div className="relative mt-6 border-t border-dashed border-white/25" />

            <div className="relative mt-6 flex items-end justify-between gap-6">
                <div className="min-w-0">
                    <div className="flex items-center gap-4">
                        <span className="shrink-0 rounded-2xl bg-white/20 p-1 backdrop-blur">
                            <Avatar
                                name={member.name}
                                url={member.avatar_url}
                                className="h-16 w-16 !rounded-xl text-2xl !bg-emerald-800/60 sm:h-20 sm:w-20"
                            />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-100">
                                Nama Ahli
                            </p>
                            <p className="truncate text-xl font-bold sm:text-2xl">
                                {member.name}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-[11px] font-medium uppercase tracking-widest text-emerald-100">
                        ID Ahli
                    </p>
                    <p className="font-mono text-lg font-semibold tracking-wider sm:text-xl">
                        {member.membership_id}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-100">
                                Peranan
                            </p>
                            <p className="font-medium">{member.role_label}</p>
                        </div>
                        {member.locality && (
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-100">
                                    Lokaliti
                                </p>
                                <p className="font-medium">
                                    {member.locality}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-100">
                                Sejak
                            </p>
                            <p className="font-medium">
                                {member.member_since}
                            </p>
                        </div>
                    </div>
                </div>

                {qrSvg && (
                    <div className="shrink-0 rounded-2xl bg-white p-2.5 shadow-lg">
                        <div
                            className="h-24 w-24 sm:h-28 sm:w-28 [&_svg]:h-full [&_svg]:w-full"
                            dangerouslySetInnerHTML={{ __html: qrSvg }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
