module.exports = {
  newGroup: (body, _id, ownerId) => ({
    ...body,
    _id,
    owner: { ...body.owner, _id: ownerId },
  }),
  newUser: (body, _id) => ({
    ...body,
    _id,
  }),
  newBill: (body, _id, groupId, payers, debtors, creatorId) => ({
    ...body,
    _id,
    groupId,
    payers,
    debtors,
    creatorId,
  }),
  newTransaction: (body, _id, senderId, beneficiaryId, groupId) => ({
    ...body,
    _id,
    senderId,
    beneficiaryId,
    groupId,
  }),
  newMember: (body, _id, groupId) => ({
    ...body,
    _id,
    groupId,
  }),
  newRecurringBill: (body, _id, billId, groupId) => ({
    ...body,
    _id,
    billId,
    groupId,
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
