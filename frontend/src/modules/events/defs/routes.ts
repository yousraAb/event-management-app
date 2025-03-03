import { CrudAppRoutes } from '@common/defs/types';


const prefix = '/events';

const Routes: CrudAppRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  CreateOne: prefix + '/create',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  Crud: prefix + '/event',  
};

export default Routes;
