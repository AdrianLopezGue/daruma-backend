import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeCurrencyCodeGroupDto {
  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;
}