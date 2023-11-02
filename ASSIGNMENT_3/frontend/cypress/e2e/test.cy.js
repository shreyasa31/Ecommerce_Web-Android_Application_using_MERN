describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('#keyword').type('iphone')
    cy.get('#distance').type(10)
    cy.get('#other').click()
    cy.get('.col-md-6 > :nth-child(2) > .form-control').type('90007')
    cy.get('#new').click()
    cy.get('#freeshipping').click()
    cy.get('.btn-primary').click()
  })
})