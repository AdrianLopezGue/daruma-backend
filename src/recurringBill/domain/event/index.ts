import { RecurringBillWasCreated } from './recurring-bill-was-created.event';
import { RecurringBillWasRemoved } from './recurring-bill-was-removed.event';


export const recurringBillEventHandlers = {
    RecurringBillWasCreated: (id: string, billId: string, groupId: string, date: Date, period: number) =>
    new RecurringBillWasCreated(id, billId, groupId, date, period),
    RecurringBillWasRemoved: (id: string) =>
    new RecurringBillWasRemoved(id),
};