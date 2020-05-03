module.exports = {
  newGroup: (body, groupId, ownerId) => ({
    ...body,
    groupId,
    owner: { ...body.owner, id: ownerId },
  }),
  newUser: (body, id) => ({
    ...body,
    id,
  }),
  newBill: (body, billId, groupId, payers, debtors, creatorId) => ({
    ...body,
    billId,
    groupId,
    payers,
    debtors,
    creatorId,
  }),
  newTransaction: (body, transactionId, senderId, beneficiaryId, groupId) => ({
    ...body,
    transactionId,
    senderId,
    beneficiaryId,
    groupId,
  }),
  newMember: (body, id, groupId) => ({
    ...body,
    id,
    groupId
  }),

  getAll: (resource, body, bearer, failOnStatusCode = false) =>
    cy.request({
      method: 'GET',
      url: resource,
      auth: { bearer },
      body,
      failOnStatusCode,
    }),
  post: (resource, body, bearer, failOnStatusCode = false) =>
    cy.request({
      method: 'POST',
      url: resource,
      auth: { bearer },
      body,
      failOnStatusCode,
    }),
  put: (resource, id, body, bearer, failOnStatusCode = false) =>
    cy.request({
      method: 'PUT',
      url: `${resource}/${id}`,
      auth: { bearer },
      body,
      failOnStatusCode,
    }),
  patch: (resource, id, body, bearer, failOnStatusCode = false) =>
    cy.request({
      method: 'PATCH',
      url: `${resource}/${id}`,
      auth: { bearer },
      body,
      failOnStatusCode,
    }),
  get: (resource, id, bearer, failOnStatusCode = false) =>
    cy.request({
      method: 'GET',
      url: `${resource}/${id}`,
      auth: { bearer },
      failOnStatusCode,
    }),
  remove: (resource, id, bearer, failOnStatusCode = false) =>
    cy.request({
      method: 'DELETE',
      url: `${resource}/${id}`,
      auth: { bearer },
      failOnStatusCode,
    }),
};
