import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenIdDto {
  @IsString()
  @ApiProperty()
  readonly idToken!: string;
}