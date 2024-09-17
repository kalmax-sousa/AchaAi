describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/auth/register');
  });

  it('should display validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Digite seu nome').should('be.visible');
    cy.contains('Digite sua matrícula').should('be.visible');
    cy.contains('Digite um email válido').should('be.visible');
    cy.contains('Digite sua senha').should('be.visible');
    cy.contains('Confirme sua senha').should('be.visible');
  });

  it('should display an error if passwords do not match', () => {
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('123456789');
    cy.get('input[name="email"]').type('teste@teste.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();
    cy.contains('As senhas precisam ser iguais').should('be.visible');
  });

  it('should display an error if the password is too short', () => {
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('123456789');
    cy.get('input[name="email"]').type('teste@teste.com');
    cy.get('input[name="password"]').type('12');
    cy.get('input[name="confirmPassword"]').type('12');
    cy.get('button[type="submit"]').click();
    cy.contains('Senha deve ter pelo menos 8 caracteres').should('be.visible');
  });

  it('should display an error if the password is too long', () => {
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('123456789');
    cy.get('input[name="email"]').type('teste@teste.com');
    cy.get('input[name="password"]').type('1234567891011121314151617181920212223242526272829303132');
    cy.get('input[name="confirmPassword"]').type('1234567891011121314151617181920212223242526272829303132');
    cy.get('button[type="submit"]').click();
    cy.contains('Senha deve ter no maximo 32 caracteres').should('be.visible');
  });

  it('should display an error if the email is invalid', () => {
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('123456789');
    cy.get('input[name="email"]').type('email@invalido');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('Digite um email válido').should('be.visible');
  });

  it('should successfully register with valid data', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: { message: 'Conta criada com sucesso' }
    }).as('registerUser');
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('12345678111');
    cy.get('input[name="email"]').type('teste@taaaaa.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('Conta criada com sucesso').should('be.visible');
  });

  it('should show error when registration fails', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 400,
      body: { errors: ['Email já existente!', 'Matricula ja existente!'] }
    }).as('registerUserFail');
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('123456789');
    cy.get('input[name="email"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('Email já existente!').should('be.visible');
  });

  it('should show error if enrollment is already registered', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 400,
      body: { errors: ['Matrícula já cadastrada'] }
    }).as('registerDuplicateEnrollment');
    cy.get('input[name="name"]').type('Nome Teste');
    cy.get('input[name="enrollment"]').type('123456789');
    cy.get('input[name="email"]').type('novoemail@teste.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('input[name="confirmPassword"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('Matricula ja existente!').should('be.visible');
  });
});