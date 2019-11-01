/* eslint-disable no-undef */
describe('Blog App', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('user can login', function() {
    cy.contains('login')
      .click()
    cy.get('input:first')
      .type('mluukkai')
    cy.get('input:last')
      .type('salainen')
    cy.get('[data-cy=submit]')
      .click()
    cy.contains('Matti Luukkainen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('login')
        .click()
      cy.get('input:first')
        .type('mluukkai')
      cy.get('input:last')
        .type('salainen')
      cy.get('[data-cy=submit]')
        .click()
    })

    it('name of the user is shown', function() {
      cy.contains('Matti Luukkainen logged in')
    })

    it('a new blog can be create', function() {
      cy.contains('new blog')
        .click()
      cy.get('[data-cy=title]')
        .type('React Hooks 入门教程')
      cy.get('[data-cy=author]')
        .type('阮一峰')
      cy.get('[data-cy=url]')
        .type('http://www.ruanyifeng.com/blog/2019/09/react-hooks.html')
      cy.contains('create')
        .click()
      cy.contains('React Hooks 入门教程 阮一峰')
    })

    describe('and a blog is created', function() {
      beforeEach(function() {
        cy.contains('new blog')
          .click()
        cy.get('[data-cy=title]')
          .type('TCP 协议简介')
        cy.get('[data-cy=author]')
          .type('阮一峰')
        cy.get('[data-cy=url]')
          .type('http://www.ruanyifeng.com/blog/2017/06/tcp-protocol.html')
        cy.contains('create')
          .click()
        cy.contains('TCP 协议简介 阮一峰')
          .click()
      })

      it('it can add likes', function() {
        cy.get('[data-cy=like').should('have.not.contain', '1')
        cy.contains('like')
          .click()
        cy.get('[data-cy=like').should('have.contain', '1')
      })

      it('it can be add comments', function() {
        cy.get('input')
          .type('awesome article')
        cy.contains('add comment')
          .click()
        cy.contains('awesome article')
      })
    })
  })
})