import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { UserNameWasChanged } from '../../../user/domain/event/user-name-was-changed.event';
import { MemberService } from '../service/member.service';
import { ChangeMembersNameCommand } from '../../application/command/change-members-name.command';

@Injectable()
export class MemberSagas {
  constructor(private readonly memberService: MemberService) {}

  @Saga()
  userNameWasChangedPublished = (
    events$: Observable<any>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserNameWasChanged),
      map(event => new ChangeMembersNameCommand(event.id, event.username)),
      /*{
        const idMembers = this.memberService.getMembersIdByUserId(event.id);
        const arr = Object.keys(idMembers).map(function(id) {
          return idMembers[id];
        });

        arr.map(
          memberId => new ChangeMemberNameCommand(memberId, event.username),
        );

        return null;
      }*/
    );
  };
}
