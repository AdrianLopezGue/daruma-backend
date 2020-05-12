import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateGroupDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string;
  @IsString()
  @ApiProperty({ type: String })
  readonly currencyCode!: string;
}
