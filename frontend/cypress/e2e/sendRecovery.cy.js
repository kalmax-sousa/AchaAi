describe('Send Recovery Password', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/auth/recovery-password');
    });

    it('should display validation error for empty email', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Digite um email válido').should('be.visible');
    });

    it('should display validation error for invalid email', () => {
      cy.get('input[name="email"]').type('email@invalido');
      cy.get('button[type="submit"]').click();
      cy.contains('Digite um email válido').should('be.visible');
    });

    it('should successfully send recovery password email with valid data', () => {
      cy.intercept('POST', '/api/recovery-password', {
        statusCode: 200,
        body: { message: 'Email enviado!' },
      }).as('sendRecoveryPassword');
      cy.get('input[name="email"]').type('devachaai01@outlook.com');
      cy.get('button[type="submit"]').click();
      cy.wait('@sendRecoveryPassword');
      cy.contains('Email enviado!').should('be.visible');
      cy.contains('Verifique sua caixa de entrada').should('be.visible');
    });
  });