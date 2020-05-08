import { CreateBillHandler } from './create-bill.handler';
import { RemoveBillsHandler } from './remove-bills.handler';
import { RemoveBillHandler } from './remove-bill.handler';
import { ChangeCurrencyCodeBillsHandler } from './change-currency-code-bills.handler';
import { ChangeBillNameHandler } from './change-bill-name.handler';
import { ChangeBillDateHandler } from './change-bill-date.handler';
import { ChangeBillPayersHandler } from './change-bill-payers.handler';
import { ChangeBillDebtorsHandler } from './change-bill-debtors.handler';
import { ChangeBillMoneyHandler } from './change-bill-money.handler';

export const CommandHandlers = [
  CreateBillHandler,
  RemoveBillsHandler,
  RemoveBillHandler,
  ChangeCurrencyCodeBillsHandler,
  ChangeBillMoneyHandler,
  ChangeBillNameHandler,
  ChangeBillDateHandler,
  ChangeBillPayersHandler,
  ChangeBillDebtorsHandler,
];
