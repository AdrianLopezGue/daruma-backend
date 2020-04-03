import { MemberName } from './member-name';
import { EmptyMembernameError } from '../exception/empty-membername.error';

describe('Fullname', () => {
  it('creates a new fullname', () => {
    const fullname = MemberName.fromString('john');

    expect(fullname.value).toBe('john');
  });

  it('expects the fullname', () => {
    expect(() => MemberName.fromString('')).toThrow(EmptyMembernameError);
  });
});
