import { PrismaClient } from '@workspace/db';
import type { z } from 'zod';
import { parseArrayToSchema } from './parse-array-to-schema';

export class PrismaRepository<T> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: keyof PrismaClient,
    protected readonly schema: z.ZodSchema<T>,
  ) {}

  async create(data: z.infer<typeof this.schema>) {
    const parsedData = this.schema.parse(data);
    // @ts-expect-error: PrismaClient does not have a type for create
    const result = this.prisma[this.modelName].create({ data: parsedData });

    console.log('Creating new record in', this.modelName, 'with data:', parsedData);

    return (await this.find({ id: result.id }))!;
  }

  async find({ id }: { id: string }) {
    // @ts-expect-error: PrismaClient does not have a type for findUnique
    const result = await this.prisma[this.modelName].findUnique({
      where: { id },
    });

    return result ? this.schema.parse(result) : null;
  }

  async loadMany() {
    // @ts-expect-error: PrismaClient does not have a type for findMany
    const results = await this.prisma[this.modelName].findMany();
    return parseArrayToSchema(results, this.schema);
  }
}
