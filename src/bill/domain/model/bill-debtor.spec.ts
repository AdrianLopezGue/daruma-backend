import { BillCurrencyUnit } from './bill-currency-unit';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillDebtor } from './bill-debtor';

describe('BillDebtopr', () => {
  const uuidA = '1061abe8-37e5-4623-8696-a9fd40797f73';

  it('should return a debtor', () => {
    const memberId = MemberId.fromString(uuidA);
    const amount = BillCurrencyUnit.fromNumber(100);

    const debtor = BillDebtor.withMemberIdAndAmount(memberId, amount);
    expect(debtor.memberId.value).toBe(uuidA);
    expect(debtor.amount.value).toBe(100);
  });
});
