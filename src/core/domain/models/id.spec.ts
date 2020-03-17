import uuid = require('uuid');

import { InvalidIdError } from '../exceptions/invalid-id-error';
import { Id } from './id';

describe('Id', () => {
  it('creates a id value object', () => {
    const id = uuid.v4();
    const myId = MyId.fromString(id);

    expect(myId.value).toBe(id);
  });

  it('returns exception if id is not valid', () => {
    expect(() => MyId.fromString('invalid')).toThrowError(
      InvalidIdError.withString('invalid'),
    );
  });
});

class MyId extends Id {
  private constructor(id: string) {
    super(id);
  }

  static fromString(id: string): MyId {
    return new this(id);
  }
}
