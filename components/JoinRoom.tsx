import { useState } from 'react';
import { useRouter } from 'next/router';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const joinRoom = () => {
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
