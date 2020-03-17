import { ValueObject } from './value-object';

describe('ValueObject', () => {
  it('creates a value object with one attribute', () => {
    const foo = FooValueObject.fromString('foo');

    expect(foo.value).toBe('foo');
  });

  it('creates a value object with many attributes', () => {
    const person = FullName.from('John', 'Doe');

    expect(person.first).toBe('John');
    expect(person.last).toBe('Doe');
  });

  it('a value objects is equal with itself', () => {
    const foo = FooValueObject.fromString('foo');

    expect(foo.equals(foo)).toBeTruthy();
  });

  it('two value objects with same values are equals', () => {
    const foo = FooValueObject.fromString('foo');
    const foo2 = FooValueObject.fromString('foo');

    expect(foo.equals(foo2)).toBeTruthy();
  });

  it('two value objects with different values are not equals', () => {
    const foo = FooValueObject.fromString('foo');
    const bar = FooValueObject.fromString('bar');

    expect(foo.equals(bar)).toBeFalsy();
  });

  it('two different value objects with same values are not equals', () => {
    const foo = FooValueObject.fromString('foo');
    const bar = BarValueObject.fromString('foo');

    expect(foo.equals(bar)).toBeFalsy();
  });
});

class FooValueObject extends ValueObject<{ value: string }> {
  public static fromString(value: string): FooValueObject {
    return new FooValueObject({ value });
  }

  get value(): string {
    return this.props.value;
  }
}

class BarValueObject extends ValueObject<{ value: string }> {
  public static fromString(value: string): BarValueObject {
    return new BarValueObject({ value });
  }

  get value(): string {
    return this.props.value;
  }
}

class FullName extends ValueObject<{ first: string; last: string }> {
  public static from(first: string, last: string): FullName {
    return new FullName({ first, last });
  }

  get first(): string {
    return this.props.first;
  }

  get last(): string {
    return this.props.last;
  }
}
