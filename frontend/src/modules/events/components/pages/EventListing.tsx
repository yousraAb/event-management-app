import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Button, CircularProgress, CardMedia, Pagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi';
import ApiRoutes from '@common/defs/api-routes';
import Routes from '@common/defs/routes';
import dayjs from 'dayjs';

interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    max_participants: number;
    participants_count: number;
    description: string;
    image: string;
    host: { name: string };
}

const EventListing = () => {
    const { t } = useTranslation(['event', 'common']);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const eventsPerPage = 3;
    const fetchApi = useApi();
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetchApi<{ success: boolean; events: Event[] }>(ApiRoutes.Events.ReadAll);
                if (response.success && response.events) {
                    setEvents(response.events);
                } else {
                    setError(t('event:fetchError'));
                }
            } catch (error) {
                setError(t('event:fetchError'));
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [fetchApi, t]);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />;
    if (error) return <Typography variant="body1" color="error" sx={{ textAlign: 'center', marginTop: 5 }}>{error}</Typography>;

    // Calculate pagination
    const indexOfLastEvent = page * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    return (
        <>
            <Typography variant="h2" sx={{ marginTop: 2, marginBottom: 1, textAlign: 'center', fontWeight: 'bold' }}>
                Discover Exciting Events
                {t('event:title')}

            </Typography>

            <Typography variant="subtitle1" sx={{ marginBottom: 3, textAlign: 'center', color: 'gray' }}>
                {/* {t('event:sub_title')} */}
                Join engaging workshops, meetups, and activities happening near you!
            </Typography>

            <Grid container spacing={4} sx={{ padding: 5 }}>
                {currentEvents.map((event) => (
                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                        <Card sx={{ padding: 3 }}>
                            {event.image && (
                                <CardMedia component="img" height="200" image={event.image} alt={event.title} />
                            )}

                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'gray', fontSize: '0.9rem', marginBottom: 1 }}
                            >
                                {dayjs(event.date).format('MMMM D, YYYY')}
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}

                                // onClick={() => router.push(ApiRoutes.Events.ReadOne.replace('{id}', event.id.toString()))}
                                // onClick={() => {
                                //     const eventUrl = ApiRoutes.Events.ReadOne.replace('{id}', event.id.toString());
                                //     router.push(eventUrl);
                                // }}
                                onClick={() => {
                                    router.push(`/events/${event.id}`);
                                }}
                            >

                                {t('event:event_explore')}
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    variant="outlined"
                    shape="rounded"
                    sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
                />
            )}
        </>
    );
};

export default EventListing;
