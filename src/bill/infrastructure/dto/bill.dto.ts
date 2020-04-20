const transformParticipants = participants => {
  if (Array.isArray(participants)) {
    return participants.map(participant => ({ id: participant.id, money: participant.money }));
  } else {
    return participants;
  }
};

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class BillDto {
  @IsString()
  @ApiProperty()
  readonly billId!: string;

  @IsString()
  @ApiProperty()
  readonly groupId!: string;

  @IsString()
  @ApiProperty()
  readonly name!: string;

  @IsDateString()
  @ApiProperty()
  readonly date!: Date;

  @IsNumber()
  @ApiProperty()
  readonly money!: number;

  @IsString()
  @ApiProperty()
  readonly currencyCode!: string;

  @Transform(transformParticipants, { toClassOnly: true })
  @ApiProperty()
  readonly payers!: ParticipantDto[];

  @Transform(transformParticipants, { toClassOnly: true })
  @ApiProperty()
  readonly debtors!: ParticipantDto[];

  @IsString()
  @ApiProperty()
  readonly creatorId!: string;
}

// tslint:disable-next-line: max-classes-per-file
export class ParticipantDto {
  readonly id: string;
  readonly money: number;

  constructor(id: string, money:  number){
    this.id = id;
    this.money = money;
  }
}