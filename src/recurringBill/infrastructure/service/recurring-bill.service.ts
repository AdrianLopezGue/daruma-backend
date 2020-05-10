import { Injectable, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import { CreateRecurringBillCommand } from '../../application/command/create-recurring-bill.command';
import { RemoveRecurringBillCommand } from '../../application/command/remove-recurring-bill.command';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { Group } from '../../../group/domain/model/group';
import { GROUPS, Groups } from '../../../group/domain/repository/index';
import { GroupId } from '../../../group/domain/model/group-id';
import { RECURRING_BILL_MODEL, RecurringBillView } from '../read-model/schema/recurring-bill.schema';

@Injectable()
export class RecurringBillService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(RECURRING_BILL_MODEL) private readonly recurringBillModel: Model<RecurringBillView>,
    @Inject(GROUPS) private readonly groups: Groups
  ) {}

  async createRecurringBill(
    recurringBillId: string,
    billId: string,
    groupId: string,
    date: Date,
    period: number,
  ) {
    return this.commandBus.execute(
      new CreateRecurringBillCommand(recurringBillId, billId, groupId, date, period),
    );
  }

  async removeRecurringBill(id: string) {
    return this.commandBus.execute(new RemoveRecurringBillCommand(id));
  }

  async getRecurringBills(groupId: string): Promise<RecurringBillView[]> {
    const result = await this.recurringBillModel.find({ groupId: groupId }).exec();
    const group = await this.groups.find(GroupId.fromString(groupId));

    if (!(group instanceof Group) || group.isRemoved) {
      throw GroupIdNotFoundError.withString(groupId);
    }

    return result;
  }
}
