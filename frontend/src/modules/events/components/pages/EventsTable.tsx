import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import { Event } from '@modules/events/defs/types'; 
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';

import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface Row extends CrudRow {
  title: string;
  date: string;
  location: string;
  max_participants: number;
  participants_count: number;
}

const EventsTable = () => {
  const { t, i18n } = useTranslation(['event']);

  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'title',
      headerName: t('event:list.title'),
      flex: 1,
    },
    {
      field: 'date',
      headerName: t('event:list.date'),
      flex: 1,
      renderCell: (params) => dayjs(params.row.date).format('DD/MM/YYYY HH:mm'),
    },
    {
      field: 'location',
      headerName: t('event:list.location'),
      flex: 1,
    },
    {
      field: 'max_participants',
      headerName: t('event:list.max_participants'),
      width: 150,
    },
    {
      field: 'participants_count',
      headerName: t('event:list.participants_count'),
      width: 150,
    },
    {
      field: 'actions',
      headerName: t('event:list.actions'),
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title={t('event:list.approve')}>
            <IconButton color="success">
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('event:list.reject')}>
            <IconButton color="error">
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const [translatedColumns, setTranslatedColumns] = useState<GridColumns<Row>>(columns);

  useEffect(() => {
    setTranslatedColumns(columns);
  }, [i18n.language]);

  const itemToRow = (item: Event): Row => ({
    id: item.id,
    title: item.title,
    date: item.date,
    location: item.location,
    max_participants: item.max_participants,
    participants_count: item.participants_count,
  });

  return (
    <ItemsTable<Event, CreateOneInput, UpdateOneInput, Row>
      namespace={Namespaces.Events}
      routes={Routes.Events}
      useItems={useEvents}
      columns={translatedColumns}
      itemToRow={itemToRow}
      showEdit={() => true}
      showDelete={() => true}
      showLock
      exportable
    />
  );
};

export default EventsTable;
