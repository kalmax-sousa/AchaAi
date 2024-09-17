describe('Account Confirmation Tests', () => {
    const validToken = 'Ng6ciCQSccZOVtKm4ViS6efepFkelt8HzfG9oEggmxbr96ZuzuALW2PUKIUvfep8MHPjljnbKv4Wmra1CQzrE2561R8Hwvmxj%2FvgbaZy5DJERrkQ3WNEhN4G';
    const invalidToken = 'Ng6ciCQSccZOVtKm4ViS6efepFkelt8HzfG9oEggmxbr96ZuzuALW2PUKIUvfep8MHPjljnbKv4Wmra1CQzrE2561R8HwvmxjvgbaZy5DJERrkQ3WNEhN4G';

    it('should successfully confirm account with valid token', () => {
      cy.visit(`http://localhost:5173/auth/confirmate-account/${validToken}`);
      cy.contains('A sua conta foi confirmada com sucesso.').should('be.visible');
    });

    it('should display error with invalid token', () => {
      cy.visit(`http://localhost:5173/auth/confirmate-account/${invalidToken}`);
      cy.contains('Token inválido').should('be.visible');
    });
  });