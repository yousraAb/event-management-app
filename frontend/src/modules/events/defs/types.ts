import { CrudObject, Id } from '@common/defs/types';
import { User } from '@modules/users/defs/types';

export interface Event extends CrudObject {
  id: Id;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  participants_count: number;
  description?: string; 
  image?: string; 
  host?: Pick<User, 'name'>; // Only include `name` from User
}
