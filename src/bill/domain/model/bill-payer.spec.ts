import { BillCurrencyUnit } from './bill-currency-unit';
import { BillPayer } from './bill-payer';
import { MemberId } from '../../../member/domain/model/member-id';

describe('BillPayer', () => {
  const uuidA = '1061abe8-37e5-4623-8696-a9fd40797f73';

  it('should return a payer', () => {
    const memberId = MemberId.fromString(uuidA);
    const amount = BillCurrencyUnit.fromNumber(100);

    const payer = BillPayer.withMemberIdAndAmount(memberId, amount);
    expect(payer.memberId.value).toBe(uuidA);
    expect(payer.amount.value).toBe(100);
  });
});