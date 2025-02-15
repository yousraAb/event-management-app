import { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';

import { useEffect, useState } from 'react';
import useEvents from '@modules/events/hooks/api/useEvents';
import { Event } from '@modules/events/defs/types';
import useProgressBar from '@common/hooks/useProgressBar';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Routes from '@common/defs/routes';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import EventDetails from '@modules/events/components/pages/EventDetails';
import { CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { string } from 'yup';

const EventIdPage: NextPage = () => {
    const router = useRouter();
    const { start, stop } = useProgressBar();
    const { readOne } = useEvents();
    
    const [item, setItem] = useState<null | Event>(null);
    const [loading, setLoading] = useState(true);
    const id: Id = Number(router.query.id);

    // const id = router.query.id ? Number(router.query.id) : null;
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation(['event', 'common']);

    useEffect(() => {
        loading ? start() : stop();
    }, [loading]);

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const fetchEvent = async () => {
        if (id) {
            setLoading(true);
            try {
                const  data  = await readOne(id);
                console.log('API Response:', data);
                console.log('Query Params:', router);
                console.log("Type of id:", typeof id);
                if (data?.event) {
                  setItem(data.event);
              } else {
                  setError('Event not found');
              }
              
            } catch (error) {
                setError('Failed to fetch event details');
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        }
    };
    
    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />;
    if (error) return <Typography variant="body1" color="error" sx={{ textAlign: 'center', marginTop: 5 }}>{error}</Typography>;

    return (
        <>
            <PageHeader title={t('event:details')} />
            <CustomBreadcrumbs
                links={[
                    { name: t('common:dashboard'), href: Routes.Common.Home },
                    { name: t('event:events'), href: Routes.Events.ReadAll },
                    {
                        name: item ? item.title : t('common:loading'),
                        href: id ? `/events/${id}` : '#' // Ensure `id` is present
                    },
                ]}
            />

{item ? <EventDetails item={item} /> : <Typography>Loading event details...</Typography>}

        </>
    );
};

export const getStaticPaths = () => {
    return { paths: [], fallback: 'blocking' };
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'event', 'common'])),
    },
});

export default EventIdPage;

// export default withAuth(
//   withPermissions(EventIdPage, {
//     requiredPermissions: {
//       entity: Namespaces.Events,
//       action: CRUD_ACTION.UPDATE,
//     },
//     redirectUrl: Routes.Permissions.Forbidden,
//   }),
//   {
//     mode: AUTH_MODE.LOGGED_IN,
//     redirectUrl: Routes.Auth.Login,
//   }
// );
