import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageCard from '@/Components/PageCard';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdateAvatarForm from './Partials/UpdateAvatarForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
    profile = {},
    localities = [],
    allSkills = [],
    canTagSkills = false,
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-foreground">
                    Profil
                </h2>
            }
        >
            <Head title="Profil" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <PageCard contentClassName="pt-0 sm:p-8">
                        <UpdateAvatarForm className="max-w-xl" />
                    </PageCard>

                    <PageCard contentClassName="pt-0 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            profile={profile}
                            localities={localities}
                            allSkills={allSkills}
                            canTagSkills={canTagSkills}
                            className="max-w-xl"
                        />
                    </PageCard>

                    <PageCard contentClassName="pt-0 sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </PageCard>

                    <PageCard contentClassName="pt-0 sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </PageCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
