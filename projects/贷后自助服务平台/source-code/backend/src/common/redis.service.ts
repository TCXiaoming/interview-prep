import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      // 连接失败时降级，不阻塞主流程
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) return null // 重试 3 次后放弃
        return Math.min(times * 200, 2000)
      },
    })
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key)
      return data ? JSON.parse(data) : null
    } catch {
      return null // Redis 不可用时降级返回 null
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await this.client.setex(key, ttl, serialized)
      } else {
        await this.client.set(key, serialized)
      }
    } catch {
      // 写入失败不影响主流程
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch {
      // 忽略
    }
  }

  // 还款计划缓存 key
  static planKey(userId: string) {
    return `repayment:plan:${userId}`
  }

  onModuleDestroy() {
    this.client.disconnect()
  }
}
