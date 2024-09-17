describe('Login Test', () => {
  beforeEach(() => {
      cy.visit('http://localhost:5173/')
  })

  it('should successfully log in', () => {
      cy.intercept('POST', '/api/auth/login', {
          statusCode: 200,
          body: {
              user: {
                  id: 1,
                  email: 'test@example.com',
                  token: 'fake-jwt-token',
              },
          },
      }).as('loginRequest')

      cy.get('input[name="email"]').type('admin@admin.com')
      cy.get('input[name="password"]').type('admin123')

      cy.get('button[type="submit"]').click()
      cy.url().should('not.include', 'http://localhost:5173/home')
  })

  it('should show error message on failed login', () => {
      cy.intercept('POST', '/api/auth/login', {
          statusCode: 401,
          body: {
              message: 'Email ou senha inválido',
          },
      }).as('loginRequest')

      cy.get('input[name="email"]').type('wrong@example.com')
      cy.get('input[name="password"]').type('wrongpassword')

      cy.get('button[type="submit"]').click()
      cy.contains('Email ou senha inválidos').should('be.visible');
  })
})
