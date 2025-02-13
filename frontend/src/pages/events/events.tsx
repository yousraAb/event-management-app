import { NextPage } from 'next';
import EventListing from '@modules/events/components/pages/EventListing';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EventsPage: NextPage = () => {
  return (
    <>
      <EventListing />
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['event', 'common'])),
  },
});

export default withAuth(EventsPage, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });
