import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { BillWasRemoved } from '../../../bill/domain/event/bill-was-removed.event';
import { RemoveRecurringBillByBillIdCommand } from '../../application/command/remove-recurring-bill-by-bill-id.command';

@Injectable()
export class RecurringBillSagas {

  @Saga()
  billWasRemovedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(BillWasRemoved),
      map(event => new RemoveRecurringBillByBillIdCommand(event.id)),
    );
  }
}