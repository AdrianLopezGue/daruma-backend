import { EmptyUsernameError } from '../exception/empty-username.error';
import { Username } from './username';

describe('Fullname', () => {
  it('creates a new fullname', () => {
    const fullname = Username.fromString('john');

    expect(fullname.value).toBe('john');
  });

  it('expects the fullname', () => {
    expect(() => Username.fromString('')).toThrow(EmptyUsernameError);
  });
});