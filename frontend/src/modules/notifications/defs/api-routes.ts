import { CrudApiRoutes } from '@common/defs/types';

const prefix = '/notifications';

const ApiRoutes: CrudApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix,
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
