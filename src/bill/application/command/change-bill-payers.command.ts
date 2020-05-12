import { ICommand } from '@nestjs/cqrs';
import { ParticipantDto } from '../../infrastructure/dto/bill.dto';

export class ChangeBillPayersCommand implements ICommand {
  constructor(
    public readonly billId: string,
    public readonly payers: ParticipantDto[],
  ) {}
}
