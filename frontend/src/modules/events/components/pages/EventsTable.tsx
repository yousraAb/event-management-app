import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import { Events } from '@modules/events/defs/types'; // Adjust import based on your Event type
import useEvents, { CreateOneInput, UpdateOneInput } from '@modules/events/hooks/api/useEvents'; // Adjust the hook
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';

import { CrudRow } from '@common/defs/types';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface Row extends CrudRow {
  name: string;
  date: string;
  
}

const EventsTable = () => {
  const { t, i18n } = useTranslation(['event']);
  
  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'name',
      headerName: t('event:list.name'), // Adjust based on translation
      flex: 1,
    },
    {
      field: 'date',
      headerName: t('event:list.date'), // Adjust based on translation
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.date).format('DD/MM/YYYY hh:mm'),
    },
    
  ];

  const [translatedColumns, setTranslatedColumns] = useState<GridColumns<Row>>(columns);

  useEffect(() => {
    setTranslatedColumns(columns);
  }, [t, i18n.language]);

  const itemToRow = (item: Events): Row => {
    return {
      id: item.id,
      name: item.name,
      date: item.date,
    };
  };

  return (
    <>
      <ItemsTable<Events, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Events}
        routes={Routes.Events}
        useItems={useEvents} // Ensure you have this hook defined
        columns={translatedColumns}
        itemToRow={itemToRow}
        showEdit={() => true}
        showDelete={() => true}
        showLock
        exportable
      />
    </>
  );
};

export default EventsTable;
