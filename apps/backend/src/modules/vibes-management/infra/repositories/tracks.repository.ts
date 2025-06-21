import { MemoryRepository } from '@/shared/memory.repository';
import { trackSchema, type TrackSchema } from '../../domain/track';

export class TracksRepository extends MemoryRepository<TrackSchema> {
  create(payload: TrackSchema) {
    const room = trackSchema.parse(payload);
    this.items.push(room);
  }
}
