import type { Room as DbRoom } from '../generated/prisma';

// טיפוס החדר – פשוט משתמש ב- Room שנוצר ע"י Prisma מ-schema.prisma
export type Room = DbRoom;
  
  export interface RoomSearchParams {
    name?: string;
    location?: string;
    capacity?: number;
    checkIn?: string;   // ISO date string
    checkOut?: string;  // ISO date string
    page?: number;
    pageSize?: number;
  }
  
  export interface PaginatedRoomsResult {
    items: Room[];
    page: number;
    pageSize: number;
    total: number;
  }
  