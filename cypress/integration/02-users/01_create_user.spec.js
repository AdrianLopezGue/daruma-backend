import * as uuid from 'uuid';

import { newUser, post } from '../../api';

describe('POST /user', () => {
  let ownerId;
  let userId;

  beforeEach(() => {
    cy.task('db:clean');

    ownerId = uuid.v4();
    userId = ownerId;
  });

  it('creates an user', function() {
    cy.fixture('users.json').then(users => {
      const user = newUser(users.body, userId);

      post('users', user, ownerId)
        .its('status')
        .should('equal', 204);
    });
  });

  it('checks user is logged', function() {
    cy.fixture('users.json').then(users => {
      const user = newUser(users.body, userId);
      const otherUserId = uuid.v4();

      post('users', user, otherUserId)
        .its('status')
        .should('equal', 403);
    });
  });
});
