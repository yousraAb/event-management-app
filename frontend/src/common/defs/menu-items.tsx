import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import Namespaces from '@common/defs/namespaces';
import { Group, Event, Edit, List } from '@mui/icons-material';

export const menuItems: NavGroup[] = [
  {
    text: 'Gestion',
    items: [
      // {
      //   text: 'Dashboard',
      //   icon: <DashboardCustomizeRoundedIcon />,
      //   link: Routes.Common.Home,
      // },
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
        routes: Routes.Events,
        children: [
          {
            text: 'Create Event',
            icon: <Event />,
            link: Routes.Events.CreateOne,
            permission: CRUD_ACTION.CREATE,
            routes: Routes.Events,
            
          },
          {
            text: 'Event Listing',
            icon: <List />,
            link: Routes.Events.ReadAll,
          },
          {
            text: 'Event Management',
            icon: <Edit />,
            link: Routes.Events.UpdateOne,
            routes: Routes.Events,
            permission: CRUD_ACTION.UPDATE,
          },
        ],
      },
    ],
  },
];

