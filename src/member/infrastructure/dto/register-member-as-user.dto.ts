import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterMemberAsUserDto {
  @IsString()
  @ApiProperty()
  readonly idUser!: string;
}