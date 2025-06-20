// redis.ts
import Redis from 'ioredis';
import { env } from '../../env';

export const redis = new Redis(env.redis);

redis.on('connect', () => console.log('Redis Successfully Connected'));
redis.on('error', (err) => console.error('Redis Error', err));
redis.on('end', () => console.log('Redis Connection Closed'));
