import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardMedia, Grid, Button,Snackbar,Alert, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);  // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');  // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');  // Snackbar severity
  const router = useRouter();
  const fetchApi = useApi();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      router.push(Routes.Auth.Login);
      return;
    }

    if (isJoined) {
      alert("You've already joined this event!");
      return;
    }

    setLoading(true); 
    try {
      const response = await fetchApi<{ success: boolean; message: string }>(`/events/${item?.id}/join`, {
        method: 'POST',
      });

      if (response.success) {
        setSnackbarMessage("You have successfully joined the event!");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        item.participants_count += 1;

        setIsJoined(true); 
        setLoading(false);  

   
        const notificationResponse = await fetchApi<{ success: boolean }>(`/events/${item?.id}/notify-host`, {
          method: 'POST',
        });

        if (notificationResponse.success) {
          console.log("Notification sent to host!");
        }
      } else {
 
        setSnackbarMessage(response.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false); 
      }
    } catch (error) {
      console.error('Error joining the event', error);
      setSnackbarMessage('There was an error joining the event. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false); 
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
              disabled={item.participants_count >= item.max_participants || isJoined || loading}  // Disable if max participants or already joined
            >
              {loading ? 'Joining...' : isJoined ? 'You have joined' : 'Join this Event'}
            </Button>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetails;
