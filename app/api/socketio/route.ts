import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponseServerIO } from '@/types/next';

type SocketServer = NetServer & {
  io?: Server;
};

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    const httpServer: SocketServer = res.socket.server as any;
    const io = new Server(httpServer);

    io.on('connection', socket => {
      socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
      });

      socket.on('new_question', (roomId: string, questionData: any) => {
        io.to(roomId).emit('receive_question', questionData);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
