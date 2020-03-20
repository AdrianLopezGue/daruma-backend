import { EmptyGroupnameError } from '../exception/empty-group-name.error';
import { GroupName } from './group-name';

describe('Groupname', () => {
  it('creates a new group name', () => {
    const fullname = GroupName.fromString('john');

    expect(fullname.value).toBe('john');
  });

  it('expects empty group name exception', () => {
    expect(() => GroupName.fromString('')).toThrow(EmptyGroupnameError);
  });
});
