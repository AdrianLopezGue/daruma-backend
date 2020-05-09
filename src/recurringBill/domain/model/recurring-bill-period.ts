import { ValueObject } from '../../../core/domain';
import { RecurringBillPeriodNotValidError } from '../exception/recurring-bill-period-not-valid.error';

export enum PeriodTypes {
    Daily = 1,
    Weekly = 7,
    Monthly = 30,
    Anually = 360
}

interface Props {
  value: PeriodTypes;
}

export class RecurringBillPeriod extends ValueObject<Props> {
  public static fromNumber(type: number): RecurringBillPeriod {
    if (type in PeriodTypes === false) {
      throw RecurringBillPeriodNotValidError.withType(type);
    }

    return new RecurringBillPeriod({ value: type });
  }

  public static daily(): RecurringBillPeriod {
    return new RecurringBillPeriod({ value: PeriodTypes.Daily });
  }

  public static weekly(): RecurringBillPeriod {
    return new RecurringBillPeriod({ value: PeriodTypes.Weekly });
  }

  public static monthly(): RecurringBillPeriod {
    return new RecurringBillPeriod({ value: PeriodTypes.Monthly });
  }

  public static anually(): RecurringBillPeriod {
    return new RecurringBillPeriod({ value: PeriodTypes.Anually });
  }

  get value(): PeriodTypes {
    return this.props.value;
  }
}