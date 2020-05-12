import { Inject, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { CheckMemberMadeAnyTransaction } from '../../domain/services/check-member-made-transaction.service';
import {
  DebtTransactionView,
  DEBT_TRANSACTION_MODEL,
} from '../read-model/schema/debt-transaction.schema';
import {
  DEPOSIT_TRANSACTION_MODEL,
  DepositTransactionView,
} from '../read-model/schema/deposit-transaction.schema';
import { MemberId } from '../../../member/domain/model/member-id';

@Injectable()
export class CheckMemberMadeAnyTransactionFromReadModel
  implements CheckMemberMadeAnyTransaction {
  constructor(
    @Inject(DEBT_TRANSACTION_MODEL)
    private readonly debtTransactionModel: Model<DebtTransactionView>,
    @Inject(DEPOSIT_TRANSACTION_MODEL)
    private readonly depositTransactionModel: Model<DepositTransactionView>,
  ) {}

  async with(idMember: MemberId): Promise<MemberId> {
    const debtTransactionView = await this.debtTransactionModel
      .findOne({ idMember: idMember.value })
      .exec();

    const depositTransactionView = await this.depositTransactionModel
      .findOne({ idMember: idMember.value })
      .exec();

    if (debtTransactionView === null && depositTransactionView === null) {
      return null;
    } else {
      if (debtTransactionView != null) {
        return MemberId.fromString(debtTransactionView.id);
      } else {
        return MemberId.fromString(depositTransactionView.id);
      }
    }
  }
}
