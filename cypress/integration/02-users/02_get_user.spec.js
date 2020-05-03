import * as uuid from 'uuid';

import { get, newUser, post } from '../../api';

describe('GET /users/id', () => {
  let ownerId;
  let userId;

  beforeEach(() => {
    cy.task('db:clean');

    ownerId = uuid.v4();
    userId = ownerId;

    cy.fixture('users.json').then(users => {
      const user = newUser(...users.body, userId);

      post('users', user, ownerId);

      cy.task('sync');
    });
  });

  it('Validate the status code', function() {
    get('users', userId, ownerId)
      .its('status')
      .should('equal', 200);
  });

  it('Validate cannot access to unknown user', function() {
    const otherUserId = uuid.v4();
    get('users', otherUserId, ownerId)
      .its('status')
      .should('equal', 404);
  });
});
