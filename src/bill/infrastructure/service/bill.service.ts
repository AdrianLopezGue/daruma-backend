import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import { BILL_MODEL, BillView } from '../read-model/schema/bill.schema';
import { CreateBillCommand } from '../../application/command/create-bill.command';
import { ParticipantDto } from '../dto/bill.dto';
import { RemoveBillCommand } from '../../application/command/remove-bill.command';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { GROUPS, Groups } from '../../../group/domain/repository/index';
import { GroupId } from '../../../group/domain/model/group-id';
import { Group } from '../../../group/domain/model/group';
@Injectable()
export class BillService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(BILL_MODEL) private readonly billModel: Model<BillView>,
    @Inject(GROUPS) private readonly groups: Groups
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
    creatorId: string,
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
        creatorId,
      ),
    );
  }

  async removeBill(id: string) {
    return this.commandBus.execute(new RemoveBillCommand(id));
  }

  async getBills(groupId: string): Promise<BillView[]> {
    const result = await this.billModel.find({ groupId: groupId }).exec();
    const group = await this.groups.find(GroupId.fromString(groupId));

    if (!(group instanceof Group) || group.isRemoved) {
      throw GroupIdNotFoundError.withString(groupId);
    }

    return result;
  }

  async getBillsIdByGroupId(groupId: string): Promise<string[]> {
    return this.billModel.distinct('_id', { groupId: groupId }).exec();
  }
}
