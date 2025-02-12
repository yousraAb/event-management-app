import ApiRoutes from '@common/defs/api-routes';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import { User } from '@modules/users/defs/types';
import { Events } from '@modules/events/defs/types';

export interface CreateOneInput {
  title: string;
  date: string;
  location: string;
  max_participants: number;
  host_id: number;
}

export interface UpdateOneInput {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  max_participants?: number;
  host_id?: number;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;



const useEvents: UseItems<Events, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Events;
  const useItemsHook = useItems<Events, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useEvents;

