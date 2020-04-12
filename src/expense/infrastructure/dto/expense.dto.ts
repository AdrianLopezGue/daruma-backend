const transformParticipants = participants => {
  if (Array.isArray(participants)) {
    return participants.map(participant => ({ id: participant.id, money: participant.money }));
  } else {
    return participants;
  }
};

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class ExpenseDto {
  @IsString()
  @ApiProperty()
  readonly expenseId!: string;

  @IsString()
  @ApiProperty()
  readonly groupId!: string;

  @IsString()
  @ApiProperty()
  readonly name!: string;

  @IsString()
  @ApiProperty()
  readonly money!: bigint;

  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;

  @Transform(transformParticipants, { toClassOnly: true })
  @ApiProperty()
  readonly payers!: ParticipantDto[];

  @Transform(transformParticipants, { toClassOnly: true })
  @ApiProperty()
  readonly debtors!: ParticipantDto[];

  @IsDate()
  @ApiProperty()
  readonly date!: Date;

  @IsString()
  @ApiProperty()
  readonly periodicity!: string;

  @IsDate()
  @ApiProperty()
  readonly endPeriodicity!: Date;

  @IsString()
  @ApiProperty()
  readonly creatorId!: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ParticipantDto {
  readonly id: string;
  readonly money: bigint;
}