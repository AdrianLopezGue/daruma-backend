import { GroupCurrencyCode } from './group-currency-code';
import { GroupCurrencyCodeLengthError } from '../exception/group-currency-code-length.error';

describe('GroupCurrencyCode', () => {
  it('should be a string', () => {
    expect(GroupCurrencyCode.fromString('EUR').value).toBe('EUR');
  });

  it('should not be empty', () => {
    expect(() => {
      GroupCurrencyCode.fromString('');
    }).toThrow(GroupCurrencyCodeLengthError);
  });

  it('should not have more than three characters', () => {
    expect(() => {
      GroupCurrencyCode.fromString('EURO');
    }).toThrow(GroupCurrencyCodeLengthError);
  });
});
