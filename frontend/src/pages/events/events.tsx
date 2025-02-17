import { NextPage } from 'next';
import EventsTable  from '@modules/events/components/pages/EventsTable';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EventsPage: NextPage = () => {
  return (
    <>
      <EventsTable  />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['event', 'common'])),
  },
});

export default withAuth(EventsPage, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
