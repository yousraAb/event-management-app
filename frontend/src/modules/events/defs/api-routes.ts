import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/events';

const ApiRoutes: CrudApiRoutes = {
  ReadAll: '/events',
  CreateOne: prefix + '/create',
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
