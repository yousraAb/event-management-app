import { CrudAppRoutes } from '@common/defs/types';


const prefix = '/events';

const Routes: CrudAppRoutes = {
  ReadAll: '/events',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default Routes;
