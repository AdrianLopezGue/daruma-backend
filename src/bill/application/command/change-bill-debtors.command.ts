import { ICommand } from '@nestjs/cqrs';
import { ParticipantDto } from '../../infrastructure/dto/bill.dto';

export class ChangeBillDebtorsCommand implements ICommand {
  constructor(
    public readonly billId: string,
    public readonly debtors: ParticipantDto[],
  ) {}
}
