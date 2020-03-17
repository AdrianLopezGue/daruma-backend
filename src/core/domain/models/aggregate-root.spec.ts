import uuid = require('uuid');

import { AggregateRoot } from './aggregate-root';
import { Id } from './id';

describe('AggregateRoot', () => {
  it('creates an aggregate root', () => {
    const fooId = FooId.fromString(uuid.v4());
    const foo = Foo.add(fooId);

    expect(foo.aggregateId()).toEqual(fooId.value);
  });

  it('is equals to itself', () => {
    const fooId = FooId.fromString(uuid.v4());
    const foo = Foo.add(fooId);

    expect(foo.equals(foo)).toBeTruthy();
  });

  it('is different to another aggregate', () => {
    const fooId = FooId.fromString(uuid.v4());
    const foo = Foo.add(fooId);
    const barId = FooId.fromString(uuid.v4());
    const bar = Foo.add(barId);

    expect(foo.equals(bar)).toBeFalsy();
  });
});

class FooId extends Id {
  public static fromString(id: string) {
    return new this(id);
  }
}

class Foo extends AggregateRoot {
  private _id: FooId;

  static add(id: FooId): Foo {
    const foo = new this();

    foo._id = id;

    return foo;
  }

  public aggregateId(): string {
    return this._id.value;
  }
}
