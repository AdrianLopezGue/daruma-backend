import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs';

export abstract class AggregateRoot extends BaseAggregateRoot {
  public abstract aggregateId(): string;

  public equals(other: AggregateRoot): boolean {
    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.aggregateId() === other.aggregateId();
  }
}
