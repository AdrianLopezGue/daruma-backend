import * as uuid from 'uuid';

import { getAll } from '../../api';

describe('GET /groups', () => {
  beforeEach(() => {
    cy.task('db:clean');
  });

  it('Validate the status code', () => {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = uuid.v4();

      getAll('groups', null, users.johndoe.id)
        .its('status')
        .should('equal', 200);
    });
  });

  it('Validate empty content', () => {
    cy.fixture('users.json').then(users => {
      users.johndoe.id = uuid.v4();

      getAll('groups', null, users.johndoe.id)
        .its('body')
        .should('have.length', 0);
    });
  });
});
