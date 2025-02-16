import { CrudAppRoutes } from '@common/defs/types';


const prefix = '/uploads';

const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default Routes;
