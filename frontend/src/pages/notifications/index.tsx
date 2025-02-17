import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import { NotificationsNone } from '@mui/icons-material'; 
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import EventNotifications from '@modules/notifications/components/pages/Notification';  

const NotificationPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation(['notifications', 'common']);

  return (
    <>
      <PageHeader
        title={t('notifications:NewNotifications')} 
        action={{
          label: t('notifications:MarkAllAsRead'),
          startIcon: <NotificationsNone />,
          onClick: () => console.log('Mark all notifications as read'), 
        }}
      />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: t('notifications:Notifications') },
        ]}
      />
      <EventNotifications eventId={router.query.eventId as string} /> 
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'notifications', 'common'])),
  },
});

export default NotificationPage;
