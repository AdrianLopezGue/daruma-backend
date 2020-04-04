const transformMembers = members => {
  if (Array.isArray(members)) {
    return members.map(member => ({id: member.id, name: member.name, email: member.email}))
  } else {
    return members;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(transformMembers, {toClassOnly: true})
  @ApiProperty()
  readonly members!: MemberDto[];
}

// tslint:disable-next-line: max-classes-per-file
export class MemberDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}
