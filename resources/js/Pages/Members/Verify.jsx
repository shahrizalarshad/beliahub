import ApplicationLogo from '@/Components/ApplicationLogo';
import Avatar from '@/Components/Avatar';
import { CheckIcon, XMarkIcon } from '@/Components/Icons';
import { Head, Link } from '@inertiajs/react';

function Detail({ label, value }) {
    return (
        <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="text-sm font-semibold text-slate-900">{value}</dd>
        </div>
    );
}

export default function Verify({ member = null }) {
    const isValid = member && member.is_active;

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 pt-16">
            <Head title="Semakan Keahlian" />

            <Link href="/" className="mb-8 flex items-center gap-2">
                <ApplicationLogo className="h-9 w-9 text-emerald-700" />
                <span className="text-lg font-bold tracking-tight text-slate-900">
                    Belia Hub
                </span>
            </Link>

            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div
                    className={`flex flex-col items-center gap-3 px-6 py-8 ${
                        isValid
                            ? 'bg-emerald-600'
                            : member
                              ? 'bg-amber-500'
                              : 'bg-red-600'
                    }`}
                >
                    {member?.avatar_url ? (
                        <span className="rounded-full bg-white p-1 shadow-lg">
                            <Avatar
                                name={member.name}
                                url={member.avatar_url}
                                className="h-20 w-20 text-2xl"
                            />
                        </span>
                    ) : (
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white">
                            {member ? (
                                <CheckIcon className="h-7 w-7" />
                            ) : (
                                <XMarkIcon className="h-7 w-7" />
                            )}
                        </span>
                    )}
                    <h1 className="text-lg font-bold text-white">
                        {isValid
                            ? 'Keahlian Sah'
                            : member
                              ? 'Keahlian Tidak Aktif'
                              : 'ID Ahli Tidak Dijumpai'}
                    </h1>
                </div>

                <div className="px-6 py-6">
                    {member ? (
                        <dl className="divide-y divide-slate-100">
                            <Detail label="Nama" value={member.name} />
                            <Detail
                                label="ID Ahli"
                                value={
                                    <span className="font-mono">
                                        {member.membership_id}
                                    </span>
                                }
                            />
                            <Detail label="Peranan" value={member.role_label} />
                            {member.locality && (
                                <Detail
                                    label="Lokaliti"
                                    value={member.locality}
                                />
                            )}
                            <Detail
                                label="Ahli Sejak"
                                value={member.member_since}
                            />
                        </dl>
                    ) : (
                        <p className="text-center text-sm text-slate-600">
                            ID ahli ini tidak wujud dalam rekod Belia Hub. Sila
                            pastikan kod QR diimbas daripada kad ahli yang sah.
                        </p>
                    )}
                </div>
            </div>

            <p className="mt-6 text-xs text-slate-400">
                Semakan rasmi keahlian organisasi Belia Hub
            </p>
        </div>
    );
}
