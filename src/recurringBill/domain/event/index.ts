import { RecurringBillWasCreated } from './recurring-bill-was-created.event';


export const recurringBillEventHandlers = {
    RecurringBillWasCreated: (id: string, billId: string, date: Date, period: number) =>
    new RecurringBillWasCreated(id, billId, date, period),
};