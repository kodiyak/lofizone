import { db } from '@/shared/clients/db';
import { albumSchema, type AlbumSchema } from '../../domain/album';
import { PrismaRepository } from '@/shared/infra/prisma.repository';

export class AlbumsRepository extends PrismaRepository<AlbumSchema> {
  private static instance: AlbumsRepository;

  private constructor() {
    super(db, 'album', albumSchema);
  }

  static getInstance(): AlbumsRepository {
    if (!AlbumsRepository.instance) {
      AlbumsRepository.instance = new AlbumsRepository();
    }
    return AlbumsRepository.instance;
  }
}
