import { MemoryRepository } from '@/shared/infra/memory.repository';
import { trackSchema, type TrackSchema } from '../../domain/track';

export class TracksRepository extends MemoryRepository<TrackSchema> {
  private static instance: TracksRepository;

  async create(payload: TrackSchema) {
    const room = trackSchema.parse(payload);
    this.items.push(room);
  }

  static getInstance(): TracksRepository {
    if (!TracksRepository.instance) {
      TracksRepository.instance = new TracksRepository();
    }
    return TracksRepository.instance;
  }
}
