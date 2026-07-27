import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ localities = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        locality: '',
        password: '',
        password_confirmation: '',
        pdpa_consent: false,
        apply_membership: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nama" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Emel" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Telefon" />
                    <TextInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="locality" value="Lokaliti" />
                    <SelectInput
                        id="locality"
                        value={data.locality}
                        onChange={(value) => setData('locality', value)}
                        placeholder="Pilih lokaliti"
                        options={localities.map((loc) => ({
                            value: loc,
                            label: loc,
                        }))}
                        className="mt-1 w-full"
                    />
                    <InputError message={errors.locality} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Kata Laluan" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Sahkan Kata Laluan" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={data.apply_membership}
                            onChange={(e) => setData('apply_membership', e.target.checked)}
                            className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">Mohon jadi ahli organisasi</span>
                    </label>
                </div>

                <div className="mt-4">
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={data.pdpa_consent}
                            onChange={(e) => setData('pdpa_consent', e.target.checked)}
                            className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            required
                        />
                        <span className="text-sm text-gray-700">
                            Saya bersetuju dengan{' '}
                            <Link href={route('terms')} className="text-emerald-700 underline">
                                Terma & Syarat
                            </Link>{' '}
                            dan{' '}
                            <Link href={route('privacy')} className="text-emerald-700 underline">
                                Dasar Privasi
                            </Link>
                        </span>
                    </label>
                    <InputError message={errors.pdpa_consent} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        Sudah daftar?
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Daftar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
