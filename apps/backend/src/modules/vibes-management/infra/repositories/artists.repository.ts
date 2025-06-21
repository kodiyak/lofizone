import { db } from '@/shared/clients/db';
import { PrismaRepository } from '@/shared/infra/prisma.repository';
import { artistSchema, type ArtistSchema } from '../../domain';

export class ArtistsRepository extends PrismaRepository<ArtistSchema> {
  private static instance: ArtistsRepository;

  private constructor() {
    super(db, 'artist', artistSchema);
  }

  static getInstance(): ArtistsRepository {
    if (!ArtistsRepository.instance) {
      ArtistsRepository.instance = new ArtistsRepository();
    }
    return ArtistsRepository.instance;
  }
}
