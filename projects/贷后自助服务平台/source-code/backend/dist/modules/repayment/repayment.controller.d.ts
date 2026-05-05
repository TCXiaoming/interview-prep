import { RepaymentService } from './repayment.service';
import { RepayDto } from './repayment.dto';
export declare class RepaymentController {
    private readonly repaymentService;
    constructor(repaymentService: RepaymentService);
    getPlan(user: {
        id: string;
    }): Promise<unknown>;
    repay(user: {
        id: string;
    }, dto: RepayDto): Promise<{
        success: boolean;
        transactionId: string;
    }>;
    getSummary(user: {
        id: string;
    }): Promise<{
        name: string;
        loanNo: string;
        totalRemaining: number;
        paidCount: number;
        remainingCount: number;
        nextDueDate: string;
    }>;
}
