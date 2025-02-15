import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, Grid, TextField, Button, Box, InputLabel, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import useApi from '@common/hooks/useApi';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import { RHFTextField, RHFSelect } from '@common/components/lib/react-hook-form';
import { Event } from '@modules/events/defs/types';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';

const schema = Yup.object().shape({
  title: Yup.string().required('Le titre est obligatoire'),
  date: Yup.date().required('La date est obligatoire'),
  location: Yup.string().required('Le lieu est obligatoire'),
  maxParticipants: Yup.number().min(1, 'Au moins un participant est requis').required('Ce champ est obligatoire'),
  description: Yup.string().required('La description est obligatoire'),
  image: Yup.mixed().nullable(),
});

const CreateEvent: React.FC = () => {
  const router = useRouter();
  const fetchApi = useApi();
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (user) setIsAuthenticated(true);
  }, [user]);

  const defaultValues = {
    title: '',
    date: '',
    location: '',
    maxParticipants: 10,
    description: '',
    image: null,
  };

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onPostSubmit = async (data: any) => {
    if (!isAuthenticated) {
      router.push(Routes.Auth.Login);
      return;
    }
    
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = await fetchApi<{ success: boolean; message: string }>('/api/events', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        router.push(Routes.Events.ReadAll);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  return (
    <>
    <CreateCrudItemForm<Event, CreateOneInput>
     routes={Routes.Events} 
     useItems={useEvents}

     schema={schema} 
     defaultValues={defaultValues} 
     onPostSubmit={onPostSubmit}
     >
      <Container sx={{ marginTop: 5 }}>
        <Typography variant="h3" sx={{ marginBottom: 3 }}>
          Create New Event
        </Typography>
        <Card sx={{ padding: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="title" label="Event Title" control={control} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="date" label="Event Date" type="date" control={control} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="location" label="Location" control={control} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="maxParticipants" label="Max Participants" type="number" control={control} />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="description" label="Description" control={control} multiline rows={4} />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Event Image</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setValue('image', e.target.files[0])}
              />
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3 }}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit(onPostSubmit)}>
              Create Event
            </Button>
          </Box>
        </Card>
      </Container>
    </CreateCrudItemForm>
    </>

  );
};

export default CreateEvent;
