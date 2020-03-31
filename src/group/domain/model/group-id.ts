import { Id } from '../../../core/domain';
import { version } from 'uuid-validate';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class GroupId extends Id {

  static generate(): GroupId {
    return new GroupId(uuid());
  }

  public static fromString(id: string): GroupId {
    /*if (version(id) !== 4) {
      throw new Error('Invalid Id');
    }*/

    return new GroupId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
