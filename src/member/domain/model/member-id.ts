import { Id } from '../../../core/domain';

export class MemberId extends Id {
  private constructor(id: string) {
    super(id);
  }

  public static fromString(id: string) {
    return new this(id);
  }
}
