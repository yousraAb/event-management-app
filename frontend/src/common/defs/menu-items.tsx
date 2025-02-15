import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import Namespaces from '@common/defs/namespaces';
import { Group, Event } from '@mui/icons-material';

export const menuItems: NavGroup[] = [
  {
    text: 'Gestion',
    items: [
      {
        text: 'Dashboard',
        icon: <DashboardCustomizeRoundedIcon />,
        link: Routes.Common.Home,
      },
      {
        text: 'Users',
        icon: <Group />,
        link: Routes.Users.ReadAll,
        namespace: Namespaces.Users,
        permission: CRUD_ACTION.READ,
        routes: Routes.Users,
      },
      {
        text: 'Events',
        icon: <Event />,
        link: Routes.Events.ReadAll,
        namespace: Namespaces.Events,
        // permission: CRUD_ACTION.READ,
        routes: Routes.Events,
        children: [
          {
            text: 'Create Event',
            icon: <Event />,
            link: Routes.Events.CreateOne,
            permission: CRUD_ACTION.READ,
          },
          {
            text: 'Event Listing',
            icon: <Event />,
            link: Routes.Events.ReadAll,  // Ensure this route exists
          },
          // {
          //   text: 'Events Table',
          //   icon: <Event />,
          //   link: Routes.Events.ReadAll,  // Ensure this route exists
          //   permission: CRUD_ACTION.READ,
          // },
        ],
      },
    ],
  },
];

