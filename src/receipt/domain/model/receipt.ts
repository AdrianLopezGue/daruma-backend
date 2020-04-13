import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { ReceiptId } from './receipt-id';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { ExpenseDate } from '../../../expense/domain/model/expense-date';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { PayerId } from '../../../payer/domain/model/payer-id';
import { DebtorId } from '../../../debtor/domain/model/debtor-id';
import { ReceiptWasCreated } from '../event/receipt-was-created';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';

export class Receipt extends AggregateRoot {
  private _receiptId: ReceiptId;
  private _expenseId: ExpenseId;
  private _date: ExpenseDate;
  private _payers: PayerId[];
  private _debtors: DebtorId[];
  private _amount: ExpenseAmount;

  private constructor() {
    super();
  }

  public static add(
    receiptId: ReceiptId,
    expenseId: ExpenseId,
    date: ExpenseDate,
    payers: PayerId[],
    debtors: DebtorId[],
    amount: ExpenseAmount,
  ): Receipt {
    const receipt = new Receipt();

    receipt.apply(
      new ReceiptWasCreated(
        receiptId.value,
        expenseId.value,
        date.value,
        payers.map((payer) => payer.value),
        debtors.map((debtor) => debtor.value),
        amount.money.value,
        amount.currencyCode.value,
      ),
    );

    return receipt;
  }

  public aggregateId(): string {
    return this._receiptId.value;
  }

  get id(): ReceiptId {
    return this._receiptId;
  }

  get expenseId(): ExpenseId {
    return this._expenseId;
  }

  get date(): ExpenseDate {
    return this._date;
  }

  get amount(): ExpenseAmount {
    return this._amount;
  }

  get payers(): PayerId[] {
    return this._payers;
  }

  get debtors(): DebtorId[] {
    return this._debtors;
  }

  private onReceiptWasCreated(event: ReceiptWasCreated) {
    this._receiptId = ReceiptId.fromString(event.id);
    this._expenseId = ExpenseId.fromString(event.id);
    this._date = ExpenseDate.fromDate(event.date);
    this._payers = event.payers.map(payer => PayerId.fromString(payer));
    this._debtors = event.debtors.map(debtor => DebtorId.fromString(debtor));
    this._amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
    }
}
