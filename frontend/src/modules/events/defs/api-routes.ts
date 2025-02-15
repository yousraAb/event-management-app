import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/events';

const ApiRoutes: CrudApiRoutes = {
  ReadAll: '/events',
  CreateOne: prefix ,
  ReadOne: '/events/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
