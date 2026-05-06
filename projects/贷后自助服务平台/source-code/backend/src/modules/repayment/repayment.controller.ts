import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { RepaymentService } from './repayment.service'
import { CurrentUser } from '../auth/current-user.decorator'
import { RepayDto } from './repayment.dto'

@ApiTags('repayment')
@Controller('api/repayment')
export class RepaymentController {
  constructor(private readonly repaymentService: RepaymentService) {}

  @Get('plan')
  @ApiOperation({ summary: '获取还款计划' })
  @ApiResponse({ status: 200, description: '还款计划列表' })
  async getPlan(@CurrentUser() user: { id: string }) {
    return this.repaymentService.getPlan(user.id)
  }

  @Post('repay')
  @ApiOperation({ summary: '还款' })
  @ApiResponse({ status: 200, description: '还款成功' })
  @ApiResponse({ status: 409, description: '版本冲突（并发修改）' })
  async repay(
    @CurrentUser() user: { id: string },
    @Body() dto: RepayDto,
  ) {
    return this.repaymentService.repay(user.id, dto.period)
  }

  @Get('summary')
  @ApiOperation({ summary: '用户摘要信息' })
  async getSummary(@CurrentUser() user: { id: string }) {
    return this.repaymentService.getSummary(user.id)
  }
}
