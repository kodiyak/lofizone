import { roomSchema, type RoomSchema } from '../../domain/room';
import { PrismaRepository } from '@/shared/infra/prisma.repository';
import { db } from '@/shared/clients/db';

export class RoomsRepository extends PrismaRepository<RoomSchema> {
  private static instance: RoomsRepository;

  constructor() {
    super(db, 'room', roomSchema);
  }

  public static getInstance(): RoomsRepository {
    if (!RoomsRepository.instance) {
      RoomsRepository.instance = new RoomsRepository();
    }
    return RoomsRepository.instance;
  }
}
