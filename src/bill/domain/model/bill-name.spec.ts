import { BillName } from './bill-name';
import { EmptyBillNameError } from '../exception/empty-bill-name.error';

describe('BillName', () => {
  it('creates a new bill name', () => {
    const fullname = BillName.fromString('netflix');

    expect(fullname.value).toBe('netflix');
  });

  it('expects empty bill name exception', () => {
    expect(() => BillName.fromString('')).toThrow(EmptyBillNameError);
  });
});
