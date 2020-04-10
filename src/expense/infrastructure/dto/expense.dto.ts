import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';

export class ExpenseDto {
  @IsString()
  @ApiProperty()
  readonly expenseId!: string;
  @IsString()
  @ApiProperty()
  readonly groupId!: string;
  @IsString()
  @ApiProperty()
  readonly name!: string;
  @IsString()
  @ApiProperty()
  readonly money!: bigint;
  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;
  @ApiProperty({type: [String]})
  readonly payers!: string[];
  @ApiProperty({type: [String]})
  readonly debtors!: string[];
  @IsDate()
  @ApiProperty()
  readonly date!: Date;
  @IsString()
  @ApiProperty()
  readonly periodicity!: string;
  @IsDate()
  @ApiProperty()
  readonly endPeriodicity!: Date;
  @IsString()
  @ApiProperty()
  readonly creatorId!: string;
}