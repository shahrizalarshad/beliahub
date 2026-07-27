import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    profile = {},
    localities = [],
    allSkills = [],
    canTagSkills = false,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: profile.phone ?? '',
            locality: profile.locality ?? '',
            bio: profile.bio ?? '',
            skills: profile.skill_ids ?? [],
        });

    const toggleSkill = (skillId) => {
        setData(
            'skills',
            data.skills.includes(skillId)
                ? data.skills.filter((id) => id !== skillId)
                : [...data.skills, skillId],
        );
    };

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Maklumat Profil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Kemas kini maklumat profil dan alamat e-mel akaun anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mel" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="phone" value="No. Telefon" />

                        <TextInput
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            autoComplete="tel"
                        />

                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="locality" value="Lokaliti" />

                        <SelectInput
                            id="locality"
                            value={data.locality}
                            onChange={(value) => setData('locality', value)}
                            placeholder="Pilih lokaliti..."
                            options={localities.map((locality) => ({
                                value: locality,
                                label: locality,
                            }))}
                            allowClear
                            clearLabel="Tiada lokaliti"
                            className="mt-1 w-full"
                        />

                        <InputError
                            className="mt-2"
                            message={errors.locality}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Bio Ringkas" />

                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={3}
                        maxLength={1000}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="Ceritakan sedikit tentang diri anda..."
                    />

                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {canTagSkills && allSkills.length > 0 && (
                    <div>
                        <InputLabel value="Skill" />
                        <p className="mt-1 text-sm text-gray-500">
                            Tandakan skill anda — pentadbir menggunakannya
                            untuk memadankan tugasan tempahan.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {allSkills.map((skill) => {
                                const selected = data.skills.includes(skill.id);

                                return (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.id)}
                                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                                            selected
                                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                                : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-700'
                                        }`}
                                    >
                                        {skill.name}
                                    </button>
                                );
                            })}
                        </div>

                        <InputError className="mt-2" message={errors.skills} />
                    </div>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Alamat e-mel anda belum disahkan.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                Klik di sini untuk hantar semula e-mel
                                pengesahan.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Pautan pengesahan baharu telah dihantar ke
                                alamat e-mel anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>

                    {recentlySuccessful && (
                        <p className="animate-in fade-in text-sm text-gray-600">
                            Disimpan.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
