// src/services/socket.service.ts
import { Server, Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userSkills?: string[];
}

class SocketService {
  private io: Server | null = null;
  private userSockets = new Map<string, string>(); // userId -> socketId

  initialize(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log('New connection:', socket.id);

      // Subscribe user to notifications
      socket.on('subscribe', (data: { userId: string; skills: string[] }) => {
        console.log(`User ${data.userId} subscribed with skills:`, data.skills);
        
        socket.userId = data.userId;
        socket.userSkills = data.skills;
        
        // Store user's socket ID
        this.userSockets.set(data.userId, socket.id);
        
        // Join skill-based rooms
        data.skills.forEach(skill => {
          socket.join(`skill:${skill.toLowerCase()}`);
        });
        
        // Join user's personal room
        socket.join(`user:${data.userId}`);
        
        socket.emit('subscribed', { 
          message: 'Successfully subscribed to notifications',
          skills: data.skills 
        });
      });

      // Unsubscribe from notifications
      socket.on('unsubscribe', () => {
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
        socket.emit('unsubscribed', { message: 'Unsubscribed from notifications' });
      });

      socket.on('disconnect', () => {
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
          console.log(`User ${socket.userId} disconnected`);
        }
      });
    });
  }

  // Notify users when a new project matches their skills
  notifyMatchingUsers(project: any) {
    if (!this.io) return;

    const requiredSkills = project.requiredSkills || [];
    
    console.log(`Notifying users with skills: ${requiredSkills.join(', ')}`);

    requiredSkills.forEach((skill: string) => {
      this.io!.to(`skill:${skill.toLowerCase()}`).emit('new-project', {
        type: 'skill-match',
        message: `New project matching your skills: ${project.name}`,
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          requiredSkills: project.requiredSkills,
          budget: project.budget
        },
        timestamp: new Date().toISOString()
      });
    });
  }

  // Notify specific user
  notifyUser(userId: string, notification: any) {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast to all connected users
  broadcast(event: string, data: any) {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }
}

export default new SocketService();