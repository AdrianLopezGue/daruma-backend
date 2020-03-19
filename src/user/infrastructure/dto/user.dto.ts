import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @ApiProperty(
      {type: String}
  )
  readonly id!: string;
  @IsString()
  @ApiProperty(
    {type: String}
  )
  readonly name!: string;
  @IsString()
  @ApiProperty(
    {type: String}
  )
  readonly email!: string;
}