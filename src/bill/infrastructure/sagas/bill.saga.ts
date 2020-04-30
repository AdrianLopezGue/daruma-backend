import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { GroupWasRemoved } from '../../../group/domain/event/group-was-removed.event';
import { RemoveBillsCommand } from '../../application/command/remove-bills.command';

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
}