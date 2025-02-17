import { CrudObject, Id } from '@common/defs/types';
import { User } from '@modules/users/defs/types';

export interface Notification extends CrudObject {
  id: Id;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  sender?: Pick<User, 'name'>; // Only include `name` from User
}
