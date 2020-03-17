import { EmptyUseremailError } from '../exception/empty-useremail.error';
import { Useremail } from './useremail';

describe('Fullname', () => {
  it('creates a new fullname', () => {
    const fullname = Useremail.fromString('john@john.es');

    expect(fullname.value).toBe('john@john.es');
  });

  it('expects the fullname', () => {
    expect(() => Useremail.fromString('')).toThrow(EmptyUseremailError);
  });
});