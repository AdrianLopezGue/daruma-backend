import { AggregateRoot } from '../../../core/domain/models/aggregate-root';

import { ReceiptId } from './receipt-id';
import { ExpenseId } from '../../../expense/domain/model/expense-id';
import { ExpenseDate } from '../../../expense/domain/model/expense-date';
import { ExpenseAmount } from '../../../expense/domain/model/expense-amount';
import { ReceiptWasCreated } from '../event/receipt-was-created';
import { ExpenseCurrencyUnit } from '../../../expense/domain/model/expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { Payer } from '../../../payer/domain/model/payer';
import { Debtor } from '../../../debtor/domain/model/debtor';

export class Receipt extends AggregateRoot {
  private _receiptId: ReceiptId;
  private _expenseId: ExpenseId;
  private _date: ExpenseDate;
  private _payers: Payer[];
  private _debtors: Debtor[];
  private _amount: ExpenseAmount;

  private constructor() {
    super();
  }

  public static add(
    receiptId: ReceiptId,
    expenseId: ExpenseId,
    date: ExpenseDate,
    payers: Payer[],
    debtors: Debtor[],
    amount: ExpenseAmount,
  ): Receipt {
    const receipt = new Receipt();

    receipt.apply(
      new ReceiptWasCreated(
        receiptId.value,
        expenseId.value,
        date.value,
        payers,
        debtors,
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

  get payers(): Payer[] {
    return this._payers;
  }

  get debtors(): Debtor[] {
    return this._debtors;
  }

  private onReceiptWasCreated(event: ReceiptWasCreated) {
    this._receiptId = ReceiptId.fromString(event.id);
    this._expenseId = ExpenseId.fromString(event.id);
    this._date = ExpenseDate.fromDate(event.date);
    this._payers = event.payers;
    this._debtors = event.debtors;
    this._amount = ExpenseAmount.withMoneyAndCurrencyCode(
      ExpenseCurrencyUnit.fromBigInt(BigInt(event.money)),
      GroupCurrencyCode.fromString(event.currencyCode),
    );
    }
}
