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
        text: 'Events',  // New Events Module
        icon: <Event />,  // Use an event-related icon
        link: Routes.Events.ReadAll,  // Ensure this route exists
        namespace: Namespaces.Events,
        permission: CRUD_ACTION.READ,
        routes: Routes.Events,
      },
    ],
  },
];
