import { ICommand } from '@nestjs/cqrs';
import { MemberDto } from '../../infrastructure/dto/group.dto';
import { OwnerDto } from '../../infrastructure/dto/owner.dto';

export class CreateGroupCommand implements ICommand {
  constructor(
    public readonly groupId: string,
    public readonly name: string,
    public readonly currencyCode: string,
    public readonly owner: OwnerDto,
    public readonly members: MemberDto[],
  ) {}
}
