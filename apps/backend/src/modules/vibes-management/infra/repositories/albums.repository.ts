import { MemoryRepository } from '@/shared/infra/memory.repository';
import { albumSchema, type AlbumSchema } from '../../domain/album';

export class AlbumsRepository extends MemoryRepository<AlbumSchema> {
  private static instance: AlbumsRepository;

  async create(payload: AlbumSchema) {
    const album = albumSchema.parse(payload);
    this.items.push(album);

    return album;
  }

  async findAll() {
    return this.items;
  }

  static getInstance(): AlbumsRepository {
    if (!AlbumsRepository.instance) {
      AlbumsRepository.instance = new AlbumsRepository();
    }
    return AlbumsRepository.instance;
  }
}
