import { useState } from 'react';
import { useRouter } from 'next/router';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    const newRoomId = Date.now().toString();
    setRoomId(newRoomId);
    router.push(`/room/${newRoomId}`);
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      {roomId && <p>Room ID: {roomId}</p>}
    </div>
  );
};

export default CreateRoom;
