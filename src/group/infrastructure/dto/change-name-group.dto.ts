import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeNameGroupDto {
  @IsString()
  @ApiProperty()
  readonly name!: string;
}
