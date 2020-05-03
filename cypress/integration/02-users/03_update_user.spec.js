import * as uuid from 'uuid';

import { get, newUser, post, put } from '../../api';

describe('PUT /users/:id', () => {
  let userId;
  let ownerId;

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

  it('Validate user name has changed', function() {
    cy.fixture('users.json').then(users => {
      const name = 'New User name';
      const response = { ...users.response, _id: userId, name };

      put('users', userId, { name }, ownerId).then(() => {
        cy.task('sync');

        get('users', userId, ownerId)
          .its('body')
          .should('deep.equal', response);
      });
    });
  });

  it('Validate paypal has changed', function() {
    cy.fixture('users.json').then(users => {
      const paypal = 'New Paypal name';
      const response = { ...users.response, _id: userId, paypal };
      const user = newUser(...users.body, userId);

      put('users', userId, { ...user, paypal }, ownerId).then(() => {
        cy.task('sync');

        get('users', userId, ownerId)
          .its('body')
          .should('deep.equal', response);
      });
    });
  });

  it('Validate name and paypal has changed', function() {
    cy.fixture('users.json').then(users => {
      const name = 'New User name';
      const paypal = 'New User paypal';
      const response = { ...users.response, _id: userId, name, paypal };
      const user = newUser(...users.body, userId);

      put('users', userId, { ...user, name, paypal }, ownerId).then(() => {
        cy.task('sync');

        get('users', userId, ownerId)
          .its('body')
          .should('deep.equal', response);
      });
    });
  });
});
