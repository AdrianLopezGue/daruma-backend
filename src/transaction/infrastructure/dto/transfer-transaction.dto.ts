import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class TransferTransactionDto {
  @IsString()
  @ApiProperty()
  readonly _id!: string;

  @IsString()
  @ApiProperty()
  readonly senderId!: string;

  @IsString()
  @ApiProperty()
  readonly beneficiaryId!: string;

  @IsNumber()
  @ApiProperty()
  readonly money!: number;

  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;

  @IsString()
  @ApiProperty()
  readonly groupId!: string;
}
