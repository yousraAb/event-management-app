// src/common/defs/pusher.js

import Pusher from 'pusher-js';

// const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
//   cluster: 'eu',
//   encrypted: true,
// });

const pusher = new Pusher('ab795fa8bedc2fe27f47', {
    cluster: 'eu'
  });

export default pusher;
