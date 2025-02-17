import Auth from '@modules/auth/defs/routes';
import Users from '@modules/users/defs/routes';
import Uploads from '@modules/uploads/defs/api-routes';
import Permissions from '@modules/permissions/defs/routes';
import Events from '@modules/events/defs/routes';

const Common = {
  Home: '/',
  NotFound: '/404',
};

const Routes = {
  Common,
  Auth,
  Permissions,
  Users,
  Events,
  Uploads
};

export default Routes;
