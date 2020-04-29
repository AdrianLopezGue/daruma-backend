import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { UserNameWasChanged } from '../../../user/domain/event/user-name-was-changed.event';
import { MemberService } from '../service/member.service';
import { ChangeMembersNameCommand } from '../../application/command/change-members-name.command';
import { GroupWasRemoved } from '../../../group/domain/event/group-was-removed.event';
import { RemoveMembersCommand } from '../../application/command/remove-members.command';

@Injectable()
export class MemberSagas {
  
  @Saga()
  userNameWasChangedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserNameWasChanged),
      map(event => new ChangeMembersNameCommand(event.id, event.username)),
    );
  }

  @Saga()
  groupWasRemoved = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(GroupWasRemoved),
      map(event => new RemoveMembersCommand(event.id)),
    );
  };
}
