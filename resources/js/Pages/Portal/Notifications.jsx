import { Bell } from 'lucide-react';
import PortalLayout from '@/Layouts/PortalLayout';
import ComingSoon from '@/Components/Portal/ComingSoon';

export default function Notifications() {
    return (
        <PortalLayout title="Notifications" subtitle="Expiries and alerts that need attention">
            <ComingSoon
                icon={Bell}
                phase="Phase 2"
                description="The notification centre is built in Phase 2. The scheduler that drives it is already running on this server, so the reminders have something to run on as soon as the screens are built."
                features={[
                    'Urgent and due soon feed, as in your wireframe',
                    'Automatic email reminders ahead of each expiry',
                    'Filter by unread, urgent and due soon',
                    'Mark all as read',
                ]}
            />
        </PortalLayout>
    );
}
