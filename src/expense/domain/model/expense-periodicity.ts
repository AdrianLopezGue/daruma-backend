import { ValueObject } from '../../../core/domain';
import { InvalidPeriodicityStateError } from '../exception/invalid-periodicity-state.error';

export enum ValidPeriodicityStates {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

interface Props {
  value: ValidPeriodicityStates;
}

export class ExpensePeriodicity extends ValueObject<Props> {
  public static fromString(value: string): ExpensePeriodicity {
    if (value in ValidPeriodicityStates === false) {
      throw InvalidPeriodicityStateError.withPeriodicityState(value);
    }
    return new ExpensePeriodicity({ value: ValidPeriodicityStates[value] });
  }

  public static daily(): ExpensePeriodicity {
    return new ExpensePeriodicity({ value: ValidPeriodicityStates.Daily });
  }

  public static weekly(): ExpensePeriodicity {
    return new ExpensePeriodicity({ value: ValidPeriodicityStates.Weekly });
  }

  public static monthly(): ExpensePeriodicity {
    return new ExpensePeriodicity({ value: ValidPeriodicityStates.Monthly });
  }

  get value(): ValidPeriodicityStates {
    return this.props.value;
  }
}
