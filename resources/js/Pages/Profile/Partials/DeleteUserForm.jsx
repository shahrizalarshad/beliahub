import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Padam Akaun
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Setelah akaun anda dipadam, semua sumber dan data akan
                    dipadam secara kekal. Sebelum memadam akaun, sila muat
                    turun sebarang data atau maklumat yang anda ingin simpan.
                </p>
            </header>

            <DangerButton onClick={() => setConfirmingUserDeletion(true)}>
                Padam Akaun
            </DangerButton>

            <Dialog
                open={confirmingUserDeletion}
                onOpenChange={(open) => !open && closeModal()}
            >
                <DialogContent>
                    <form onSubmit={deleteUser}>
                        <DialogHeader>
                            <DialogTitle>
                                Adakah anda pasti mahu memadam akaun anda?
                            </DialogTitle>
                            <DialogDescription>
                                Setelah akaun anda dipadam, semua sumber dan
                                data akan dipadam secara kekal. Sila masukkan
                                kata laluan anda untuk mengesahkan pemadaman
                                kekal akaun anda.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <InputLabel
                                htmlFor="password"
                                value="Kata Laluan"
                                className="sr-only"
                            />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Kata Laluan"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <DialogFooter className="mt-6">
                            <SecondaryButton onClick={closeModal}>
                                Batal
                            </SecondaryButton>

                            <DangerButton disabled={processing}>
                                Padam Akaun
                            </DangerButton>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
