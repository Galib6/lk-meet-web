import { ENV } from '.environments';
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(userId: string): Socket {
    if (!this.socket) {
      this.socket = io(`${ENV.apiBaseUrl}/meeting-session?userId=${userId}`, {
        transports: ['websocket'],
      });
    }
    return this.socket;
  }

  public isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }

  public emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = SocketService.getInstance();
