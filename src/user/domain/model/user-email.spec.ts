import { EmptyUseremailError } from '../exception/empty-useremail.error';
import { UserEmail } from './user-email';

describe('Useremail', () => {
  it('creates a new email', () => {
    const email = UserEmail.fromString('john@john.es');

    expect(email.value).toBe('john@john.es');
  });

  it('expects the useremail to fail', () => {
    expect(() => UserEmail.fromString('')).toThrow(EmptyUseremailError);
  });
});