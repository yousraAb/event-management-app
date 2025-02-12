import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi'; // Custom hook for handling API requests
import ApiRoutes from '@common/defs/api-routes'; // Correct import path for ApiRoutes
import { ItemResponse } from '@common/hooks/useItems'; // Assuming this is needed for type inference
import Routes from '@common/defs/routes';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  host: {
    name: string;
  };
}

const EventListing = () => {
  const { t } = useTranslation(['events', 'common']);
  const [events, setEvents] = useState<Event[]>([]);
  const fetchApi = useApi(); // Custom fetch API hook
  const router = useRouter(); // Ensure router is initialized inside the function

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Ensure correct API route usage
        const response = await fetchApi<{ events: Event[] }>(ApiRoutes.Events.ReadAll);
        if (response.success && response.data) {
          setEvents(response.data.events);
        } else {
          console.error('Failed to fetch events', response.errors);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [fetchApi]);

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
              <Typography variant="body2">{t('events:date')}: {event.date}</Typography>
              <Typography variant="body2">{t('events:location')}: {event.location}</Typography>
              <Typography variant="body2">{t('events:max_participants')}: {event.max_participants}</Typography>
              <Typography variant="body2">{t('events:host')}: {event.host.name}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => router.push(Routes.Events.Details.replace(':id', event.id.toString()))}
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
