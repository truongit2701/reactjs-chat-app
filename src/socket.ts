import { io } from 'socket.io-client';

const URL = 'http://103.75.183.248:3000';

const token = localStorage.getItem('token');

export const socket = io(URL, {
   extraHeaders: {
      Authorization: `Bearer ${token}`
   }
});
