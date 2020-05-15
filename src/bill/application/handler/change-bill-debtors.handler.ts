import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuid} from 'uuid';

import { BILLS } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { Bills } from '../../domain/repository/bills';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { MemberId } from '../../../member/domain/model/member-id';
import { TransactionId } from '../../../transaction/domain/model/transaction-id';
import { TRANSACTIONS } from '../../../transaction/domain/repository/index';
import { Transactions } from '../../../transaction/domain/repository/transactions';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';
import { Bill } from '../../domain/model/bill';
import { ChangeBillDebtorsCommand } from '../command/change-bill-debtors.command';
import { DebtTransaction } from '../../../transaction/domain/model/debt-transaction';
import { BillDebtor } from '../../domain/model/bill-debtor';

@CommandHandler(ChangeBillDebtorsCommand)
export class ChangeBillDebtorsHandler
  implements ICommandHandler<ChangeBillDebtorsCommand> {
  constructor(
    @Inject(BILLS) private readonly bills: Bills,
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
  ) {}

  async execute(command: ChangeBillDebtorsCommand) {
    const billId = BillId.fromString(command.billId);
    const bill = await this.bills.find(billId);

    if (!(bill instanceof Bill)) {
      throw BillIdNotFoundError.withString(command.billId);
    }

    const currentDebtors = bill.debtors;

    currentDebtors.map(debtor => {
      bill.removeDebtor(MemberId.fromString(debtor.props.memberId.props.value));
      this.bills.save(bill);
    });

    const newDebtors = command.debtors.map(debtor =>
      BillDebtor.withMemberIdAndAmount(
        MemberId.fromString(debtor._id),
        BillCurrencyUnit.fromNumber(debtor.money),
      ),
    );

    newDebtors.map(newDebtor => {
      bill.addDebtor(newDebtor);
      this.bills.save(bill);
    });

    const debtTransactionsAdded: DebtTransaction[] = [];

    newDebtors.forEach(debtor => {
      debtTransactionsAdded.push(
        bill.addDebtTransaction(
          TransactionId.fromString(uuid()),
          debtor.memberId,
          BillAmount.withMoneyAndCurrencyCode(
            debtor.amount,
            GroupCurrencyCode.fromString(bill.amount.currencyCode.value),
          ),
        ),
      );
    });

    debtTransactionsAdded.map(transaction =>
      this.transactions.saveDebtTransaction(transaction),
    );
  }
}
