import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { GroupWasRemoved } from '../../../group/domain/event/group-was-removed.event';
import { BillWasRemoved } from '../../../bill/domain/event/bill-was-removed.event';
import { RemoveDebtAndDepositTransactionsCommand } from '../../application/command/remove-debt-and-deposit-transactions.command';
import { RemoveTransferTransactionsCommand } from '../../application/command/remove-transfer-transactions.command';
import { BillPayerWasRemoved } from '../../../bill/domain/event/bill-payer-was-removed.event';
import { RemoveDepositTransactionCommand } from '../../application/command/remove-deposit-transaction.command';
import { RemoveDebtTransactionCommand } from '../../application/command/remove-debt-transaction.command';
import { BillDebtorWasRemoved } from '../../../bill/domain/event/bill-debtor-was-removed.event';

@Injectable()
export class TransactionSagas {
  @Saga()
  billWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(BillWasRemoved),
      map(event => new RemoveDebtAndDepositTransactionsCommand(event.id)),
    );
  };

  @Saga()
  groupWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GroupWasRemoved),
      map(event => new RemoveTransferTransactionsCommand(event.id)),
    );
  };

  @Saga()
  billPayerWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(BillPayerWasRemoved),
      map(
        event => new RemoveDepositTransactionCommand(event.id, event.payerId),
      ),
    );
  };

  @Saga()
  billDebtorWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(BillDebtorWasRemoved),
      map(event => new RemoveDebtTransactionCommand(event.id, event.debtorId)),
    );
  };
}
