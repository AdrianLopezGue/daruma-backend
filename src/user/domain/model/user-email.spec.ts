import { EmptyUseremailError } from '../exception/empty-useremail.error';
import { UserEmail } from './user-email';

describe('Fullname', () => {
  it('creates a new fullname', () => {
    const fullname = UserEmail.fromString('john@john.es');

    expect(fullname.value).toBe('john@john.es');
  });

  it('expects the fullname', () => {
    expect(() => UserEmail.fromString('')).toThrow(EmptyUseremailError);
  });
});