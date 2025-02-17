
import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardMedia, Grid, Button, Snackbar, Alert, Box } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
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
  const [participantsCount, setParticipantsCount] = useState<number>(item?.participants_count || 0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  const router = useRouter();
  const fetchApi = useApi();
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      // Check if user is already a participant
      setIsJoined(item?.participants_count > 0);
      console.log(item.max_participants); // Log the value to check if it exists

    }
  }, [user, item]);
  
  // useEffect(() => {
  //   if (user) {
  //     setIsAuthenticated(true);
  //   }
  // }, [user]);

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      router.push(Routes.Auth.Login);
      return;
    }

    if (isJoined) {
      setSnackbarMessage("You've already joined this event!");
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
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

        setIsJoined(true);
        setParticipantsCount((prev) => prev + 1);
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error joining the event. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setLoading(false);
    console.log("Is joined before leaving:", isJoined);

    console.log(localStorage.getItem('token'));

  };

  const handleLeaveEvent = async () => {
    if (!isAuthenticated) {
      router.push(Routes.Auth.Login);
      return;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push(Routes.Auth.Login);
      return;
    }
  
    console.log("Auth Token:", token);
  
    setLoading(true);
    try {
      const response = await fetchApi<{ message: string }>(
        `/events/${item?.id}/leave`,
        { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.message === 'Left the event') {
        setSnackbarMessage("You have left the event.");
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        setIsJoined(false);
        setParticipantsCount((prev) => Math.max(prev - 1, 0));
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error leaving the event. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setLoading(false);
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
        <Grid item xs={12} md={7}>
          <Card sx={{ padding: 3 }}>
            {item.image && <CardMedia component="img" height="300" image={item.image} alt={item.title} />}
            <Typography variant="h3" sx={{ marginTop: 2 }}>{item.title}</Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>{item.description || 'No description available.'}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Event Details</Typography>
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
                Seats available: {item.maxParticipants - participantsCount} / {item.maxParticipants}

              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleJoinEvent}
              disabled={participantsCount >= item.maxParticipants || isJoined || loading}
            >
              {loading ? 'Joining...' : isJoined ? 'You have joined' : 'Join this Event'}
            </Button>
            {isJoined && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleLeaveEvent}
                sx={{ marginTop: 2 }}
                disabled={loading}
              >
                {loading ? 'Leaving...' : 'Leave Event'}
              </Button>
            )}
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventDetails;
