import * as uuid from 'uuid';

describe('PUT /users', () => {

  const userName = 'User name';
  const userPaypal = 'User paypal';

  beforeEach(() => {
    cy.fixture('users.json').as('users');
    cy.fixture('groups.json').as('groups');
  });

  const put = (auth, name, paypal, id) =>
    cy.request({
      method: 'PUT',
      url: `users/${id}`,
      auth: { bearer: auth },
      body: {
        name: name,
        paypal: paypal
      },
    });

  const get = (user) => 
    cy.request({
      method: 'GET',
      url: `users/${user.id}`,
      auth: { bearer: user.id },
    });

  it('Validate user name has changed', function() {

    const result = [
      {
        _id: this.users.johndoe.id,
        name: userName,
        email: this.users.johndoe.email,
      },
    ];

    put(this.users.johndoe.id, userName, '', this.users.johndoe.id);

    get(this.users.johndoe)
      .its('body')
      .should('deep.equal', result[0]);
  });
  
  it('Validate paypal has changed', function() {

    const result = [
      {
        _id: this.users.johndoe.id,
        name: userName,
        email: this.users.johndoe.email,
        paypal: userPaypal
      },
    ];

    put(this.users.johndoe.id, userName, userPaypal, this.users.johndoe.id);

    get(this.users.johndoe)
      .its('body')
      .should('deep.equal', result[0]);
  }); 

  it('Validate name abd paypal has changed', function() {
    const newuserName = 'New User name';
    const newuserPaypal = 'New User paypal';

    const result = [
      {
        _id: this.users.johndoe.id,
        name: newuserName,
        email: this.users.johndoe.email,
        paypal: newuserPaypal
      },
    ];

    put(this.users.johndoe.id, newuserName, newuserPaypal, this.users.johndoe.id);

    get(this.users.johndoe)
      .its('body')
      .should('deep.equal', result[0]);
  }); 
});
