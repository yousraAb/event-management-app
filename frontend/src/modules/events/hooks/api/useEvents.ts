// useEvent.ts
import ApiRoutes from '@common/defs/api-routes';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import { Event } from '@modules/events/defs/types';

export interface CreateOneInput {
  title: string;
  date: string;
  location: string;
  max_participants: number;
  host_id: number;
  description: string;
  image: File | null; 
}

export interface UpdateOneInput {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  max_participants?: number;
  host_id?: number;
  description?: string;
  image?: File | null; 
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useEvent: UseItems<Event, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Events;
  const useItemsHook = useItems<Event, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useEvent;
