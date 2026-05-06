import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class RepayDto {
  @ApiProperty({ description: '还款期数', example: 1 })
  @IsInt()
  @Min(1)
  period: number
}
