import { roomSchema, type RoomSchema } from '../../domain/room';
import { PrismaRepository } from '@/shared/infra/prisma.repository';
import { db } from '@/shared/clients/db';

export class RoomsRepository extends PrismaRepository<RoomSchema> {
  constructor() {
    super(db, 'room', roomSchema);
  }
}
