import { db } from '@/shared/clients/db';
import { PrismaRepository } from '@/shared/infra/prisma.repository';
import { playlistSchema, type PlaylistSchema } from '../../domain';

export class PlaylistsRepository extends PrismaRepository<PlaylistSchema> {
  private static instance: PlaylistsRepository;

  private constructor() {
    super(db, 'playlist', playlistSchema);
  }

  static getInstance(): PlaylistsRepository {
    if (!PlaylistsRepository.instance) {
      PlaylistsRepository.instance = new PlaylistsRepository();
    }
    return PlaylistsRepository.instance;
  }
}
