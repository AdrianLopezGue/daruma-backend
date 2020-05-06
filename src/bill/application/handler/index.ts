import { CreateBillHandler } from './create-bill.handler';
import { RemoveBillsHandler } from './remove-bills.handler';
import { RemoveBillHandler } from './remove-bill.handler';
import { ChangeCurrencyCodeBillsHandler } from './change-currency-code-bills.handler';

export const CommandHandlers = [CreateBillHandler, RemoveBillsHandler, RemoveBillHandler, ChangeCurrencyCodeBillsHandler];
