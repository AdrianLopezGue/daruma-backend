import { UserPaypal } from './user-paypal';

describe('Paypal', () => {
  it('creates a new paypal', () => {
    const paypal = UserPaypal.fromString('john');

    expect(paypal.value).toBe('john');
  });
});
