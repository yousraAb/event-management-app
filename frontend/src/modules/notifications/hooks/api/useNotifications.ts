import { useEffect } from 'react';
import useItems, { UseItems, UseItemsOptions, defaultOptions } from '@common/hooks/useItems';
import ApiRoutes from '@common/defs/api-routes';
import Pusher from 'pusher-js';
import { Notification } from '@modules/notifications/defs/types';

const useNotification: UseItems<Notification, never, never> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Notifications;
  const useItemsHook = useItems<Notification, never, never>(apiRoutes, opts);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      encrypted: true,
    });

    const channel = pusher.subscribe('notifications-channel');
    channel.bind('notification.received', (newNotification: Notification) => {
      useItemsHook.mutate((current = []) => [newNotification, ...current], false);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [useItemsHook.mutate]);

  return useItemsHook;
};

export default useNotification;
