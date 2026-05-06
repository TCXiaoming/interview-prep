import { Module } from '@nestjs/common'
import { RepaymentController } from './repayment.controller'
import { RepaymentService } from './repayment.service'

@Module({
  controllers: [RepaymentController],
  providers: [RepaymentService],
  exports: [RepaymentService],
})
export class RepaymentModule {}
