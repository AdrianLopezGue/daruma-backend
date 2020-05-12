import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MemberDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly _id!: string;
  @IsString()
  @ApiProperty({ type: String })
  readonly groupId!: string;
  @IsString()
  @ApiProperty({ type: String })
  readonly name!: string;
}
