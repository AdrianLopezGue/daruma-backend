import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { GroupWasRemoved } from '../../../group/domain/event/group-was-removed.event';
import { GroupCurrencyCodeWasChanged } from '../../../group/domain/event/group-currency-code-was-changed.event';
import { RemoveBillsCommand } from '../../application/command/remove-bills.command';
import { ChangeCurrencyCodeBillsCommand } from '../../application/command/change-currency-code-bills.command';

@Injectable()
export class BillSagas {

  @Saga()
  groupWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GroupWasRemoved),
      map(event => new RemoveBillsCommand(event.id)),
    );
  }

  @Saga()
  groupCurrencyCodeWasChangedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GroupCurrencyCodeWasChanged),
      map(event => new ChangeCurrencyCodeBillsCommand(event.id, event.currencyCode)),
    );
  }
}