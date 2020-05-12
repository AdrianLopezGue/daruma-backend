import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber } from 'class-validator';

export class RecurringBillDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly _id!: string;

  @IsString()
  @ApiProperty({ type: String })
  readonly billId!: string;

  @IsString()
  @ApiProperty({ type: String })
  readonly groupId!: string;

  @IsDateString()
  @ApiProperty()
  readonly date!: Date;

  @IsNumber()
  @ApiProperty()
  readonly period!: number;
}
