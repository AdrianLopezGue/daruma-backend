import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { GroupWasRemoved } from '../../../group/domain/event/group-was-removed.event';
import { BillWasRemoved } from '../../../bill/domain/event/bill-was-removed.event';
import { RemoveDebtAndDepositTransactionsCommand } from '../../application/command/remove-debt-and-deposit-transactions.command';
import { RemoveTransferTransactionsCommand } from '../../application/command/remove-transfer-transactions.command';

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
  }

  @Saga()
  groupWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GroupWasRemoved),
      map(event => new RemoveTransferTransactionsCommand(event.id)),
    );
  };
}