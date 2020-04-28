import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string;
  @IsString()
  @ApiProperty({ type: String })
  readonly paypal!: string;
}
