import React from 'react';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import CreateEventForm from '@modules/events/components/pages/CreateEventForm';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import { Add } from '@mui/icons-material';
import PageHeader from '@common/components/lib/partials/PageHeader';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth'; // withAuth HOC for authentication

const CreateEventPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation(['event']);

  return (
    <>
      <PageHeader
        title={t(`event:${Labels.Events.NewOne}`)} // Title for the page
        action={{
          label: t(`event:${Labels.Events.NewOne}`),
          startIcon: <Add />, // Add icon for creating event
          onClick: () => router.push(Routes.Events.CreateOne), // Redirect to Create Event page
          permission: {
            entity: Namespaces.Events, // Permissions check for creating an event
            action: CRUD_ACTION.CREATE,
          },
        }}
      />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home }, // Home breadcrumb
          { name: t(`event:${Labels.Events.Items}`) }, // Events breadcrumb
        ]}
      />
      <CreateEventForm /> {/* Event listing component */}
    </>
  );
};

// Adding server-side translation support for internationalization (i18n)
export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
  },
});

// Wrapping the CreateEventPage with withAuth HOC to check for authentication
export default withAuth(CreateEventPage, {
  mode: AUTH_MODE.LOGGED_IN, // Ensures the user is logged in
  redirectUrl: Routes.Auth.Login, // Redirect URL for non-authenticated users
});
