import React from 'react';
import { socket } from '../socket';

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <p>Socket Id: {socket.id}</p>
      {/* <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button> */}
    </>
  );
}