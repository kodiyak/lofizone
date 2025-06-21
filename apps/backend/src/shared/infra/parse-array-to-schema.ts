import { ZodSchema, type z } from 'zod';

export function parseArrayToSchema<S extends ZodSchema<any>>(
  array: unknown[],
  schema: S,
): z.infer<S>[] {
  return array.map((item) => {
    const parsedItem = schema.safeParse(item);
    if (!parsedItem.success) {
      throw new Error(
        `Invalid item: ${JSON.stringify(
          {
            errors: parsedItem.error.errors,
            item,
          },
          null,
          2,
        )}`,
      );
    }
    return parsedItem.data;
  });
}
