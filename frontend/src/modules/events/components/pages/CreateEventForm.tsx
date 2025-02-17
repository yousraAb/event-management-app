import { RHFTextField } from '@common/components/lib/react-hook-form';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import { ItemResponse } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import useAuth from '@modules/auth/hooks/api/useAuth';
import * as Yup from 'yup';
import useUploads from '@modules/uploads/hooks/api/useUploads';
import { Upload } from '@modules/uploads/defs/types';

const EventForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { createOne: uploadFile } = useUploads();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255, 'Le titre est trop long.').required('Le titre est obligatoire'),
    date: Yup.string().required('La date est obligatoire'),
    location: Yup.string()
      .max(255, 'L\'emplacement est trop long.')
      .required('L\'emplacement est obligatoire'),
    max_participants: Yup.number()
      .min(1, 'Doit être au moins 1')
      .required('Le nombre maximal de participants est obligatoire'),
    description: Yup.string().max(500, 'La description est trop longue.').required('La description est obligatoire'),
    image: Yup.mixed()
      .nullable()
      .test('fileSize', 'L\'image est trop volumineuse (max 5MB)', (value) => {
        return !value || (value && value.size <= 5 * 1024 * 1024);
      }),
    host_id: Yup.number().required('L\'ID de l\'hôte est obligatoire'),
  });

  const defaultValues: CreateOneInput = {
    title: '',
    date: '',
    location: '',
    max_participants: 10,
    description: '',
    image: null,
    host_id: user?.id || 0,
  };

  const onPostSubmit = async (
    _data: CreateOneInput,
    response: ItemResponse<Event>,
    _methods: UseFormReturn<CreateOneInput>
  ) => {
    if (response.success) {
      router.push(Routes.Events.ReadAll);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const uploadResponse = await uploadFile({ file });
      if (uploadResponse.success) {
        // Handle successful upload, such as storing the file ID or URL in the form data
        console.log('Uploaded file:', uploadResponse.data?.item);
      }
    }
  };

  return (
    <>
      <CreateCrudItemForm<Event, CreateOneInput>
        routes={Routes.Events}
        useItems={useEvents}
        schema={EventSchema}
        defaultValues={defaultValues}
        onPostSubmit={onPostSubmit}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="title" label="Titre de l'événement" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="date" label="Date" type="datetime-local" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="location" label="Emplacement" />
          </Grid>
          <Grid item xs={6}>
            <RHFTextField name="max_participants" label="Nombre max de participants" type="number" />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField name="description" label="Description" multiline rows={4} />
          </Grid>
          <Grid item xs={12}>
            <input 
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Grid>
        </Grid>
      </CreateCrudItemForm>
    </>
  );
};

export default EventForm;
