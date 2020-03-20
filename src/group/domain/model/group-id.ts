import { Id } from '../../../core/domain';

export class GroupId extends Id {
  private constructor(id: string) {
    super(id);
  }

  public static fromString(id: string) {
    return new this(id);
  }
}
