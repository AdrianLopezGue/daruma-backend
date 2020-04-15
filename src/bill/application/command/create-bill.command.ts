import { ICommand } from '@nestjs/cqrs';
import { ParticipantDto } from '../../infrastructure/dto/bill.dto';

export class CreateBillCommand implements ICommand {
  constructor(
    public readonly billId: string,
    public readonly groupId: string,
    public readonly name: string,
    public readonly date: Date,
    public readonly money: bigint,
    public readonly currencyCode: string,
    public readonly payers: ParticipantDto[],
    public readonly debtors: ParticipantDto[],
  ) {}
}
