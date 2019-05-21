import Redis from "ioredis";

export const redis = new Redis();

interface RedisConnectionOptions {
  host: string;
  port: number;
  retry_strategy: any;
}

export function createRedisConnection(options: RedisConnectionOptions) {
  return new Redis(options);
}
