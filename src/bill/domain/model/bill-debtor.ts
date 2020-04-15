import { ValueObject } from '../../../core/domain';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillCurrencyUnit } from './bill-currency-unit';

interface Props {
  memberId: MemberId;
  amount: BillCurrencyUnit;
}

export class BillDebtor extends ValueObject<Props> {
  static withMemberIdAndAmount(
    memberId: MemberId,
    amount: BillCurrencyUnit,
  ): BillDebtor {
    return new BillDebtor({ memberId, amount });
  }

  get memberId(): MemberId {
    return this.props.memberId;
  }

  get amount(): BillCurrencyUnit {
    return this.props.amount;
  }
}