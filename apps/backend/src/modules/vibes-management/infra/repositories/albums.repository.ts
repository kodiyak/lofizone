import { MemoryRepository } from '@/shared/memory.repository';
import { albumSchema, type AlbumSchema } from '../../domain/album';

export class AlbumsRepository extends MemoryRepository<AlbumSchema> {
  create(payload: AlbumSchema) {
    const room = albumSchema.parse(payload);
    this.items.push(room);
  }
}
