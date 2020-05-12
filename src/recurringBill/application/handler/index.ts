import { CreateRecurringBillHandler } from './create-recurring-bill.handler';
import { RemoveRecurringBillHandler } from './remove-recurring-bill.handler';
import { ChangeRecurringBillPeriodHandler } from './change-recurring-bill-period.handler';


export const CommandHandlers = [
  CreateRecurringBillHandler,
  RemoveRecurringBillHandler,
  ChangeRecurringBillPeriodHandler
];
