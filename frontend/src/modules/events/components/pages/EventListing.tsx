import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi'; // Custom hook for handling API requests
import ApiRoutes from '@common/defs/api-routes'; // Correct import path for ApiRoutes
import Routes from '@common/defs/routes'; // Correct import path for Routes
import dayjs from 'dayjs'; // For formatting the date

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  participants_count: number; 
  host: {
    name: string;
  };
}

const EventListing = () => {
  const { t } = useTranslation(['events', 'common']);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchApi = useApi(); 
  const router = useRouter(); 

  useEffect(() => {
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
      
        try {
          console.log('Fetching events from:', ApiRoutes.Events.ReadAll);
          const response = await fetchApi<{ success: boolean; events: Event[] }>(ApiRoutes.Events.ReadAll);
          console.log('Full API Response:', response);
      
          if (response.success && response.events) {
            setEvents(response.events); // Use response.events directly
          } else {
            console.error('Failed to fetch events or unexpected response structure');
            setError(t('events:fetchError'));
          }
        } catch (error) {
          console.error('Network/API error fetching events:', error);
          setError(t('events:fetchError'));
        } finally {
          setLoading(false);
        }
      };
      
  
    fetchEvents();
  }, [fetchApi, t]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />;
  }

  if (error) {
    return <Typography variant="body1" color="error" sx={{ textAlign: 'center', marginTop: 5 }}>{error}</Typography>;
  }

  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {t('events:title')}
      </Typography>
      <Grid container spacing={4} sx={{ padding: 5 }}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card sx={{ padding: 3 }}>
              <Typography variant="h5">{event.title}</Typography>
              <Typography variant="body2">{t('events:date')}: {dayjs(event.date).format('MMMM D, YYYY')}</Typography>
              <Typography variant="body2">{t('events:location')}: {event.location}</Typography>
              <Typography variant="body2">{t('events:max_participants')}: {event.max_participants}</Typography>
              <Typography variant="body2">{t('events:participants_count')}: {event.participants_count}</Typography>
              <Typography variant="body2">{t('events:host')}: {event.host.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => router.push(Routes.Events.Details.replace(':id', event.id.toString()))}
                disabled={event.participants_count >= event.max_participants} 
              >
                {t('events:join')}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default EventListing;
