import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import { BILL_MODEL, BillView } from '../read-model/schema/bill.schema';
import { CreateBillCommand } from '../../application/command/create-bill.command';
import { ParticipantDto } from '../dto/bill.dto';
@Injectable()
export class BillService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(BILL_MODEL) private readonly billModel: Model<BillView>,
  ) {}

  async createBill(
    billId: string,
    groupId: string,
    name: string,
    money: number,
    currencyCode: string,
    payers: ParticipantDto[],
    debtors: ParticipantDto[],
    date: Date,
    creatorId: string
  ) {
    return this.commandBus.execute(
      new CreateBillCommand(
        billId,
        groupId,
        name,
        date,
        money,
        currencyCode,
        payers,
        debtors,
        creatorId
      ),
    );
  }

  async getBills(groupId: string): Promise<BillView[]> {
    return this.billModel.find({ 'groupId': "" + groupId + "" }).exec();
  }
}
