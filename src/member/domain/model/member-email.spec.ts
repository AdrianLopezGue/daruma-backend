import { MemberEmail } from './member-email';
import { EmptyMemberemailError } from '../exception/empty-memberemail.error';

describe('Memberemail', () => {
  it('creates a new email', () => {
    const email = MemberEmail.fromString('john@john.es');

    expect(email.value).toBe('john@john.es');
  });

  it('expects the memberemail to fail', () => {
    expect(() => MemberEmail.fromString('')).toThrow(EmptyMemberemailError);
  });
});
