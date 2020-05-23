import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuid } from 'uuid';

import { CreateBillCommand } from '../command/create-bill.command';
import { BILLS } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { Bill } from '../../domain/model/bill';
import { BillName } from '../../domain/model/bill-name';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillDate } from '../../domain/model/bill-date';
import { Bills } from '../../domain/repository/bills';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { BillPayer } from '../../domain/model/bill-payer';
import { BillDebtor } from '../../domain/model/bill-debtor';
import { MemberId } from '../../../member/domain/model/member-id';
import { CreatorIdNotFoundInGroup } from '../../domain/exception/creator-id-not-found-in-group.error';
import { DepositTransaction } from '../../../transaction/domain/model/deposit-transaction';
import { TransactionId } from '../../../transaction/domain/model/transaction-id';
import { TRANSACTIONS } from '../../../transaction/domain/repository/index';
import { Transactions } from '../../../transaction/domain/repository/transactions';
import { DebtTransaction } from '../../../transaction/domain/model/debt-transaction';
import {
  CHECK_USER_IN_GROUP,
  CheckUserInGroup,
} from '../../../member/domain/services/check-user-in-group.service';
import { GroupId } from '../../../group/domain/model/group-id';
import { UserId } from '../../../user/domain/model/user-id';

@CommandHandler(CreateBillCommand)
export class CreateBillHandler implements ICommandHandler<CreateBillCommand> {
  constructor(
    @Inject(BILLS) private readonly bills: Bills,
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
    @Inject(CHECK_USER_IN_GROUP)
    private readonly checkUserInGroup: CheckUserInGroup,
  ) {}

  async execute(command: CreateBillCommand) {
    if (
      (await this.checkUserInGroup.with(
        UserId.fromString(command.creatorId),
        GroupId.fromString(command.groupId),
      )) === null
    ) {
      throw new CreatorIdNotFoundInGroup(command.creatorId);
    }

    const billId = BillId.fromString(command.billId);
    const groupId = GroupId.fromString(command.groupId);
    const name = BillName.fromString(command.name);
    const amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(command.money),
      GroupCurrencyCode.fromString(command.currencyCode),
    );
    const payers = command.payers.map(payer =>
      BillPayer.withMemberIdAndAmount(
        MemberId.fromString(payer._id),
        BillCurrencyUnit.fromNumber(payer.money),
      ),
    );

    const debtors = command.debtors.map(debtor =>
      BillDebtor.withMemberIdAndAmount(
        MemberId.fromString(debtor._id),
        BillCurrencyUnit.fromNumber(debtor.money),
      ),
    );

    const creatorId = MemberId.fromString(command.creatorId);

    const date = BillDate.fromDate(command.date);

    const bill = Bill.add(
      billId,
      groupId,
      name,
      amount,
      date,
      payers,
      debtors,
      creatorId,
    );

    this.bills.save(bill);

    const depositTransactionsAdded: DepositTransaction[] = [];

    payers.forEach(payer => {
      depositTransactionsAdded.push(
        bill.addDepositTransaction(
          TransactionId.fromString(uuid()),
          payer.memberId,
          BillAmount.withMoneyAndCurrencyCode(
            payer.amount,
            GroupCurrencyCode.fromString(command.currencyCode),
          ),
        ),
      );
    });

    depositTransactionsAdded.map(transaction =>
      this.transactions.saveDepositTransaction(transaction),
    );

    const debtTransactionsAdded: DebtTransaction[] = [];

    debtors.forEach(debtor => {
      debtTransactionsAdded.push(
        bill.addDebtTransaction(
          TransactionId.fromString(uuid()),
          debtor.memberId,
          BillAmount.withMoneyAndCurrencyCode(
            debtor.amount,
            GroupCurrencyCode.fromString(command.currencyCode),
          ),
        ),
      );
    });

    debtTransactionsAdded.map(transaction =>
      this.transactions.saveDebtTransaction(transaction),
    );
  }
}
