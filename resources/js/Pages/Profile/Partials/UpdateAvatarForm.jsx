import Avatar from '@/Components/Avatar';
import ConfirmDialog from '@/Components/ConfirmDialog';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function UpdateAvatarForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const fileInput = useRef(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        avatar: null,
    });

    const pickFile = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setData('avatar', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('avatar.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            },
        });
    };

    const remove = () =>
        router.delete(route('avatar.destroy'), { preserveScroll: true });

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Gambar Profil
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Gambar ini dipaparkan pada kad ahli digital dan profil
                    anda. Format JPG, PNG atau WebP, maksimum 2MB.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 flex flex-wrap items-center gap-5"
            >
                <Avatar
                    name={user.name}
                    url={preview ?? user.avatar_url}
                    className="h-20 w-20 text-2xl"
                />

                <div className="flex flex-wrap items-center gap-3">
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={pickFile}
                        className="hidden"
                        id="avatar-input"
                    />
                    <SecondaryButton
                        type="button"
                        onClick={() => fileInput.current?.click()}
                    >
                        Pilih Gambar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing || !data.avatar}>
                        Muat Naik
                    </PrimaryButton>
                    {user.avatar_url && (
                        <ConfirmDialog
                            trigger={
                                <button
                                    type="button"
                                    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                                >
                                    Buang
                                </button>
                            }
                            title="Buang gambar profil semasa?"
                            description="Kad ahli dan profil anda akan kembali memaparkan inisial nama."
                            confirmLabel="Buang"
                            destructive
                            onConfirm={remove}
                        />
                    )}
                </div>

                <InputError message={errors.avatar} className="w-full" />
            </form>
        </section>
    );
}
