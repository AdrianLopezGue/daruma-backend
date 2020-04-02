import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupDto {
  @IsString()
  @ApiProperty()
  readonly groupId!: string;
  @IsString()
  @ApiProperty()
  readonly name!: string;
  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;
  @IsString()
  @ApiProperty()
  readonly idOwner!: string;
}
