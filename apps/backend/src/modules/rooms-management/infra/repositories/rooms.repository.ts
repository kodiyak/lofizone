import { MemoryRepository } from '@/shared/infra/memory.repository';
import { roomSchema, type RoomSchema } from '../../domain/room';

export class RoomsRepository extends MemoryRepository<RoomSchema> {
  create(payload: RoomSchema) {
    const room = roomSchema.parse(payload);
    this.items.push(room);
  }
}
