// defs/types.ts
import { CrudObject, Id } from '@common/defs/types';
import { User } from '@modules/users/defs/types';

export interface Events extends CrudObject {
  id: Id;
  title: string;
  date: string; // Assuming the date is a string, you may adjust it if you are using a Date object
  location: string;
  max_participants: number;
  host_id: Id; // The ID of the host user (if applicable)
  host?: User; // Optionally include host user information
}
