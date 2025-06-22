import { PrismaClient } from '@workspace/db';
import type { z } from 'zod';
import { parseArrayToSchema } from './parse-array-to-schema';

export class PrismaRepository<T, K extends keyof PrismaClient> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: K,
    protected readonly schema: z.ZodSchema<T>,
  ) {}

  async create(data: z.infer<typeof this.schema>) {
    const parsedData = this.schema.safeParse(data);

    try {
      if (parsedData.success === false) {
        throw new Error(`Invalid Data`);
      }

      // @ts-expect-error: PrismaClient does not have a type for create
      const result = await this.prisma[this.modelName].create({ data: parsedData.data });

      return (await this.find({ id: result.id }))!;
    } catch (error: any) {
      throw new Error(
        `Failed to Create [${this.modelName.toString()}]\n${JSON.stringify(parsedData.data)}\n${error.message}\n`,
      );
    }
  }

  async find({ id }: { id: string }) {
    if (!id) {
      throw new Error(`[${this.modelName.toString()}] ID is required to find a Record.`);
    }

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
