import { ShieldCheck } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import ComingSoon from '@/Components/Portal/ComingSoon';

export default function Roles() {
    return (
        <PortalLayout title="Roles & Permissions" subtitle="What each type of user is allowed to do">
            <ComingSoon
                icon={ShieldCheck}
                phase="Phase 2"
                description="Roles and their permissions are already in the database, with Administrator, Manager, Supervisor and Client set up. This screen is where you will change them yourself without needing me."
                features={[
                    'Create roles and rename existing ones',
                    'Turn individual permissions on or off per role',
                    'See which users hold each role',
                    'Client role prepared for the Phase 3 portal',
                ]}
            />
        </PortalLayout>
    );
}
