
import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardMedia, Grid, Button, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi'; // assuming this is your custom hook to handle API calls
// import { useAuth } from '@common/hooks/'; // custom hook to check if user is authenticated
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  participants_count: number;
  description?: string;
  image?: string;
  host?: { name: string };
}

interface EventDetailsProps {
  item?: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ item }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const fetchApi = useApi();
  const { user } = useAuth(); // assuming `useAuth` gives you user info if authenticated

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      router.push(Routes.Auth.Login);
      return;
    }

    try {
      // Assuming you have an API route for joining the event
      const response = await fetchApi<{ success: boolean; message: string }>(`/api/events/${item?.id}/join`, {
        method: 'POST',
      });

      if (response.success) {
        // Do something on successful join (e.g., show a success message, update participants count)
        console.log('Successfully joined the event!');
      } else {
        // Handle error (e.g., not enough spots, user already joined)
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error joining the event', error);
    }
  };

  if (!item) {
    return <Typography variant="body1">Event data not found</Typography>;
  }

  return (
    <Container sx={{ marginTop: 5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card sx={{ padding: 3, flex: 1 }}>
            {item.image && (
              <CardMedia component="img" height="300" image={item.image} alt={item.title} />
            )}
            <Typography variant="h3" sx={{ marginTop: 2 }}>
              {item.title}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {item.description || 'No description available.'}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card sx={{ padding: 3, flex: 1 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Event Details
            </Typography>
            <Box sx={{ marginBottom: 1 }}>
              <Typography variant="body2">Date: {dayjs(item.date).format('MMMM D, YYYY')}</Typography>
            </Box>
            <Box sx={{ marginBottom: 1 }}>
              <Typography variant="body2">Location: {item.location}</Typography>
            </Box>
            <Box sx={{ marginBottom: 1 }}>
              <Typography variant="body2">Hosted by: {item.host?.name || 'Unknown'}</Typography>
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body2">
                Participants: {item.participants_count} / {item.max_participants}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleJoinEvent}
              disabled={item.participants_count >= item.max_participants} // Disable button if max participants reached
            >
              Join this Event
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails;
