"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const redis_service_1 = require("../../common/redis.service");
let RepaymentService = class RepaymentService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getPlan(userId) {
        const cacheKey = redis_service_1.RedisService.planKey(userId);
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return cached;
        const plan = await this.prisma.repaymentOrder.findMany({
            where: { userId },
            orderBy: { period: 'asc' },
            select: {
                period: true,
                dueDate: true,
                principal: true,
                interest: true,
                total: true,
                status: true,
            },
        });
        await this.redis.set(cacheKey, plan, 300);
        return plan;
    }
    async repay(userId, period) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.repaymentOrder.findUnique({
                where: { userId_period: { userId, period } },
            });
            if (!order) {
                throw new common_1.NotFoundException('还款期数不存在');
            }
            if (order.status === 'PAID') {
                throw new common_1.ConflictException('该期已还款');
            }
            const updated = await tx.repaymentOrder.updateMany({
                where: {
                    userId,
                    period,
                    version: order.version,
                },
                data: {
                    status: 'PAID',
                    paidAmount: order.total,
                    paidAt: new Date(),
                    version: { increment: 1 },
                },
            });
            if (updated.count === 0) {
                throw new common_1.ConflictException('还款状态已变更，请刷新后重试');
            }
            await this.redis.del(redis_service_1.RedisService.planKey(userId));
            return {
                success: true,
                transactionId: `TXN_${Date.now()}`,
            };
        });
    }
    async getSummary(userId) {
        const orders = await this.prisma.repaymentOrder.findMany({
            where: { userId },
            orderBy: { period: 'asc' },
        });
        const paid = orders.filter((o) => o.status === 'PAID');
        const unpaid = orders.filter((o) => o.status !== 'PAID');
        const totalRemaining = unpaid.reduce((sum, o) => sum + o.total, 0);
        const nextDue = unpaid[0];
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        return {
            name: user?.name,
            loanNo: user?.loanNo,
            totalRemaining: Math.round(totalRemaining * 100) / 100,
            paidCount: paid.length,
            remainingCount: unpaid.length,
            nextDueDate: nextDue?.dueDate
                ? new Date(nextDue.dueDate).toISOString().split('T')[0]
                : null,
        };
    }
};
exports.RepaymentService = RepaymentService;
exports.RepaymentService = RepaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], RepaymentService);
//# sourceMappingURL=repayment.service.js.map