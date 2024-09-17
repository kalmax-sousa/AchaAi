describe('Modify Password', () => {
    const validToken = 'enQtRFc5NEc3Zk5rMkJqR0JmSUV4SzRNTl9KMGxNY1JoWm9BSzQtRVRmUHZYWlpfZmh3bmRtTkh1VC1Sd2hlQXA4ZkFoZkhlU0dySFlhdG1ubk9sNjdhSXE5MQ9SSFdJZFNvVnB3TjFhS3E5WkVhX1k2TzRCdTg2RTZJUi8=';
    const invalidToken = 'Ng6ciCQSccZOVtKm4ViS6efepFkelt8HzfG9oEggmxbr96ZuzuALW2PUKIUvfep8MHPjljnbKv4Wmra1CQzrE2561R8HwvmxjvgbaZy5DJERrkQ3WNEhN4G';

    beforeEach(() => {
      cy.visit(`http://localhost:5173/auth/recovery-password/${invalidToken}`);
    });

    it('should display validation error for empty password fields', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('Digite sua nova senha').should('be.visible');
      cy.contains('Confirme sua nova senha').should('be.visible');
    });

    it('should display validation error when password is too short', () => {
      cy.get('input[name="password"]').type('short');
      cy.get('input[name="password_confirmation"]').type('short');
      cy.get('button[type="submit"]').click();
      cy.contains('Senha deve ter pelo menos 8 caracteres').should('be.visible');
    });

    it('should display validation error when password is too long', () => {
      const longPassword = 'a'.repeat(33);
      cy.get('input[name="password"]').type(longPassword);
      cy.get('input[name="password_confirmation"]').type(longPassword);
      cy.get('button[type="submit"]').click();
      cy.contains('Senha deve ter no maximo 32 caracteres').should('be.visible');
    });

    it('should display error when password modification fails due to invalid token', () => {
      cy.visit(`http://localhost:5173/auth/recovery-password/${invalidToken}`);
      cy.get('input[name="password"]').type('senhaValida123');
      cy.get('input[name="password_confirmation"]').type('senhaValida123');
      cy.get('button[type="submit"]').click();
      cy.contains('Token invalido').should('be.visible');
    });

    it('should successfully modify the password when valid data is provided', () => {
        cy.visit(`http://localhost:5173/auth/recovery-password/${validToken}`);
        cy.get('input[name="password"]').type('senhaValida123');
        cy.get('input[name="password_confirmation"]').type('senhaValida123');
        cy.get('button[type="submit"]').click();
        cy.contains('Sua senha foi alterada com sucesso!').should('be.visible');
      });
  });