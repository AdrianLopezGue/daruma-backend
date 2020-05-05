const transformOwner = owner => {
  return { _id: owner._id, name: owner.name };
};

const transformMembers = members => {
  if (Array.isArray(members)) {
    return members.map(member => ({ _id: member._id, name: member.name }));
  } else {
    return members;
  }
};

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { OwnerDto } from './owner.dto';

export class GroupDto {
  @IsString()
  @ApiProperty()
  readonly _id!: string;
  @IsString()
  @ApiProperty()
  readonly name!: string;
  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;
  @Transform(transformOwner, { toClassOnly: true })
  @ApiProperty()
  readonly owner!: OwnerDto;
  @Transform(transformMembers, { toClassOnly: true })
  @ApiProperty()
  readonly members!: MemberDto[];
}

// tslint:disable-next-line: max-classes-per-file
export class MemberDto {
  readonly _id: string;
  readonly name: string;
}
