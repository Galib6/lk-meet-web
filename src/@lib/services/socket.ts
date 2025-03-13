import { ENV } from '.environments';
import { io, Socket } from 'socket.io-client';

class SocketService {
  private sockets: Map<string, Socket> = new Map();
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(userId: string): Socket {
    if (!this.sockets.has(userId)) {
      const socket = io(`${ENV.apiBaseUrl}/meeting-session?userId=${userId}`, {
        reconnection: true,
        transports: ['websocket'],
      });

      this.sockets.set(userId, socket);
    }

    return this.sockets.get(userId)!;
  }

  public disconnect(userId?: string): void {
    if (userId) {
      // Disconnect specific user
      const socket = this.sockets.get(userId);
      if (socket) {
        socket.disconnect();
        this.sockets.delete(userId);
      }
    } else {
      // Disconnect all sockets
      this.sockets.forEach((socket, _id) => {
        socket.disconnect();
      });
      this.sockets.clear();
    }
  }

  public on(event: string, callback: (...args: any[]) => void, userId?: string): void {
    if (userId) {
      const socket = this.sockets.get(userId);
      if (socket) {
        socket.on(event, callback);
      }
    } else {
      // Add event listener to all sockets
      this.sockets.forEach((socket) => {
        socket.on(event, callback);
      });
    }
  }

  public off(event: string, callback?: (...args: any[]) => void, userId?: string): void {
    if (userId) {
      const socket = this.sockets.get(userId);
      if (socket) {
        socket.off(event, callback);
      }
    } else {
      // Remove event listener from all sockets
      this.sockets.forEach((socket) => {
        socket.off(event, callback);
      });
    }
  }

  public emit(event: string, data?: any, userId?: string): void {
    if (userId) {
      const socket = this.sockets.get(userId);
      if (socket) {
        socket.emit(event, data);
      }
    } else {
      // Emit to all sockets
      this.sockets.forEach((socket) => {
        socket.emit(event, data);
      });
    }
  }

  public getSocket(userId: string): Socket | null {
    return this.sockets.get(userId) || null;
  }

  public getAllSockets(): Map<string, Socket> {
    return this.sockets;
  }
}

export const socketService = SocketService.getInstance();
