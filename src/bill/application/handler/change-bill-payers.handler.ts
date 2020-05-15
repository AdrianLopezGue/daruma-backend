import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuid } from 'uuid';

import { BILLS } from '../../domain/repository/index';
import { BillId } from '../../domain/model/bill-id';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { Bills } from '../../domain/repository/bills';
import { BillAmount } from '../../domain/model/bill-amount';
import { BillCurrencyUnit } from '../../domain/model/bill-currency-unit';
import { BillPayer } from '../../domain/model/bill-payer';
import { MemberId } from '../../../member/domain/model/member-id';
import { DepositTransaction } from '../../../transaction/domain/model/deposit-transaction';
import { TransactionId } from '../../../transaction/domain/model/transaction-id';
import { TRANSACTIONS } from '../../../transaction/domain/repository/index';
import { Transactions } from '../../../transaction/domain/repository/transactions';
import { ChangeBillPayersCommand } from '../command/change-bill-payers.command';
import { BillIdNotFoundError } from '../../domain/exception/bill-id-not-found.error';
import { Bill } from '../../domain/model/bill';

@CommandHandler(ChangeBillPayersCommand)
export class ChangeBillPayersHandler
  implements ICommandHandler<ChangeBillPayersCommand> {
  constructor(
    @Inject(BILLS) private readonly bills: Bills,
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
  ) {}

  async execute(command: ChangeBillPayersCommand) {
    const billId = BillId.fromString(command.billId);
    const bill = await this.bills.find(billId);

    if (!(bill instanceof Bill)) {
      throw BillIdNotFoundError.withString(command.billId);
    }

    const currentPayers = bill.payers;

    currentPayers.map(payer => {
      bill.removePayer(MemberId.fromString(payer.props.memberId.props.value));
      this.bills.save(bill);
    });

    const newPayers = command.payers.map(payer =>
      BillPayer.withMemberIdAndAmount(
        MemberId.fromString(payer._id),
        BillCurrencyUnit.fromNumber(payer.money),
      ),
    );

    newPayers.map(newPayer => {
      bill.addPayer(newPayer);
      this.bills.save(bill);
    });

    const depositTransactionsAdded: DepositTransaction[] = [];

    newPayers.forEach(payer => {
      depositTransactionsAdded.push(
        bill.addDepositTransaction(
          TransactionId.fromString(uuid()),
          payer.memberId,
          BillAmount.withMoneyAndCurrencyCode(
            payer.amount,
            GroupCurrencyCode.fromString(bill.amount.currencyCode.value),
          ),
        ),
      );
    });

    depositTransactionsAdded.map(transaction =>
      this.transactions.saveDepositTransaction(transaction),
    );
  }
}
