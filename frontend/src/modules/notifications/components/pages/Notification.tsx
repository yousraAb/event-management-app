import React, { useEffect, useState } from 'react';
import pusher from '@common/defs/pusher';
import { useRouter } from 'next/router';
import { List, ListItem, ListItemButton } from '@mui/material'; 

const EventNotifications = ({ eventId }: { eventId: string }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Subscribe to the event-specific channel
    const channel = pusher.subscribe(`event.${eventId}`);

    // Listen for the 'event.joined' event
    channel.bind('event.joined', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: data.message,
          event_title: data.event_title,
          participants_count: data.participants_count,
        },
      ]);
    });

    return () => {
      pusher.unsubscribe(`event.${eventId}`);
    };
  }, [eventId]);

  const handleNotificationClick = (eventTitle: string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <div>
      {notifications.length > 0 ? (
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index}>
              <ListItemButton onClick={() => handleNotificationClick(notification.event_title)} sx={{ color: 'primary.main' }}>
                {notification.message}: {notification.event_title} now has {notification.participants_count} participants.
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>No notifications yet.</p>
      )}
    </div>
  );
};

export default EventNotifications;
