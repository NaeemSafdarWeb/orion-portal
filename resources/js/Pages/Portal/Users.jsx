import { Users as UsersIcon } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import ComingSoon from '@/Components/Portal/ComingSoon';

export default function Users() {
    return (
        <PortalLayout title="Users" subtitle="People who can sign in to the portal">
            <ComingSoon
                icon={UsersIcon}
                phase="Phase 2"
                description="User management is built in Phase 2. The accounts and roles behind it already exist in the database, so this screen is the interface for what is there."
                features={[
                    'Add and remove users',
                    'Assign a role to each person',
                    'Set an account active or inactive, which takes effect immediately',
                    'Filter by role and search by name or email',
                ]}
            />
        </PortalLayout>
    );
}
