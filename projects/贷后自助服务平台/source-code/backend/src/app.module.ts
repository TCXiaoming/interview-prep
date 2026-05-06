import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './common/prisma.module'
import { RedisModule } from './common/redis.module'
import { AuthModule } from './modules/auth/auth.module'
import { RepaymentModule } from './modules/repayment/repayment.module'

@Module({
  imports: [
    // 接口限流：每个 IP 每分钟最多 60 次请求
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    RedisModule,
    AuthModule,
    RepaymentModule,
  ],
})
export class AppModule {}
