import { EmptyUsernameError } from '../exception/empty-username.error';
import { UserName } from './user-name';

describe('Fullname', () => {
  it('creates a new fullname', () => {
    const fullname = UserName.fromString('john');

    expect(fullname.value).toBe('john');
  });

  it('expects the fullname', () => {
    expect(() => UserName.fromString('')).toThrow(EmptyUsernameError);
  });
});
