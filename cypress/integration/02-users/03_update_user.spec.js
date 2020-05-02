import * as uuid from 'uuid';

describe('PUT /users', () => {
  let userid;

  const put = (auth, name, paypal, id) =>
    cy.request({
      method: 'PUT',
      url: `users/${id}`,
      auth: { bearer: auth },
      body: {
        name: name,
        paypal: paypal,
      },
    });

  const get = (user) =>
    cy.request({
      method: 'GET',
      url: `users/${user}`,
      auth: { bearer: user },
    }),;

  const post = (auth, user) =>
    cy.request({
      method: 'POST',
      url: 'users',
      auth: { bearer: auth },
      body: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      failOnStatusCode: false,
    });

  beforeEach(() => {
    cy.task('db:clean');

    userid = uuid.v4();

    cy.fixture('users.json').then(users => {
      users.johndoe.id = userid;

      post(users.johndoe.id, users.johndoe)
        .its('status')
        .should('equal', 204);
    });
  });

  it('Validate user name has changed', function() {
    cy.fixture('users.json').then(users => {
      const userName = 'New User name';
      users.johndoe.id = userid;

      const result = [
        {
          _id: users.johndoe.id,
          name: userName,
          email: users.johndoe.email,
        },
      ];

      put(users.johndoe.id, userName, '', users.johndoe.id);

      get(users.johndoe.id)
        .its('body')
        .should('deep.equal', result[0]);
    });
  });

  it('Validate paypal has changed', function() {
    cy.fixture('users.json').then(users => {
      const userPaypal = 'New Paypal name';
      users.johndoe.id = userid;

      const result = [
        {
          _id: users.johndoe.id,
          name: users.johndoe.name,
          email: users.johndoe.email,
          paypal: userPaypal,
        },
      ];

      put(users.johndoe.id, users.johndoe.name, userPaypal, userid);

      get(users.johndoe.id)
        .its('body')
        .should('deep.equal', result[0]);
    });
  });

  it('Validate name and paypal has changed', function() {
    cy.fixture('users.json').then(users => {
      const newuserName = 'New User name';
      const newuserPaypal = 'New User paypal';
      users.johndoe.id = userid;

      const result = [
        {
          _id: users.johndoe.id,
          name: newuserName,
          email: users.johndoe.email,
          paypal: newuserPaypal,
        },
      ];

      put(users.johndoe.id, newuserName, newuserPaypal, users.johndoe.id);

      get(users.johndoe.id)
        .its('body')
        .should('deep.equal', result[0]);
    });
  });
});
