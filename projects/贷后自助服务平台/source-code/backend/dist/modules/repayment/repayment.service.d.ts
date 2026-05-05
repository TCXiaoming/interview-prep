import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
export declare class RepaymentService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    getPlan(userId: string): Promise<unknown>;
    repay(userId: string, period: number): Promise<{
        success: boolean;
        transactionId: string;
    }>;
    getSummary(userId: string): Promise<{
        name: string;
        loanNo: string;
        totalRemaining: number;
        paidCount: number;
        remainingCount: number;
        nextDueDate: string;
    }>;
}
