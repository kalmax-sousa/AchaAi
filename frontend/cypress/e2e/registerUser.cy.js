describe('User Registration', () => {
    beforeEach(() => {
      // Visita a página onde o formulário de registro está localizado
      cy.visit('http://localhost:5173/auth/register'); // Substitua pelo caminho correto
    });

    it('should display validation errors for empty fields', () => {
      // Clica no botão de enviar sem preencher o formulário
      cy.get('button[type="submit"]').click();

      // Verifica se as mensagens de erro de validação aparecem
      cy.contains('Digite seu nome').should('be.visible');
      cy.contains('Digite sua matrícula').should('be.visible');
      cy.contains('Digite um email válido').should('be.visible');
      cy.contains('Digite sua senha').should('be.visible');
      cy.contains('Confirme sua senha').should('be.visible');
    });

    it('should display an error if passwords do not match', () => {
      // Preenche o formulário com senhas diferentes
      cy.get('input[name="name"]').type('Nome Teste');
      cy.get('input[name="enrollment"]').type('123456789');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senhaerrada');

      // Envia o formulário
      cy.get('button[type="submit"]').click();

      // Verifica se a mensagem de erro para senhas diferentes aparece
      cy.contains('As senhas precisam ser iguais').should('be.visible');
    });

    it('should display an error if the password is too short', () => {
      // Preenche o formulário com uma senha curta demais
      cy.get('input[name="name"]').type('Nome Teste');
      cy.get('input[name="enrollment"]').type('123456789');
      cy.get('input[name="email"]').type('teste@teste.com');
      cy.get('input[name="password"]').type('12'); // Senha muito curta
      cy.get('input[name="confirmPassword"]').type('12'); // Confirma senha

      // Envia o formulário
      cy.get('button[type="submit"]').click();

      // Verifica se a mensagem de erro para a senha curta aparece
      cy.contains('Senha deve ter pelo menos 8 caracteres').should('be.visible'); // Mensagem de erro genérica
    });

    it('should display an error if the password is too long', () => {
        // Preenche o formulário com uma senha curta demais
        cy.get('input[name="name"]').type('Nome Teste');
        cy.get('input[name="enrollment"]').type('123456789');
        cy.get('input[name="email"]').type('teste@teste.com');
        cy.get('input[name="password"]').type('1234567891011121314151617181920212223242526272829303132'); // Senha muito curta
        cy.get('input[name="confirmPassword"]').type('1234567891011121314151617181920212223242526272829303132'); // Confirma senha

        // Envia o formulário
        cy.get('button[type="submit"]').click();

        // Verifica se a mensagem de erro para a senha curta aparece
        cy.contains('Senha deve ter no maximo 32 caracteres').should('be.visible'); // Mensagem de erro genérica
      });

    it('should display an error if the email is invalid', () => {
        // Preenche o formulário com um e-mail inválido
        cy.get('input[name="name"]').type('Nome Teste');
        cy.get('input[name="enrollment"]').type('123456789');
        cy.get('input[name="email"]').type('email@invalido'); // Email inválido
        cy.get('input[name="password"]').type('senha123');
        cy.get('input[name="confirmPassword"]').type('senha123');

        // Envia o formulário
        cy.get('button[type="submit"]').click();

        // Verifica se a mensagem de erro para e-mail inválido aparece
        cy.contains('Digite um email válido').should('be.visible');
    });

    it('should successfully register with valid data', () => {
      // Mock para simular a criação de usuário com sucesso
      cy.intercept('POST', '/api/register', {
        statusCode: 200,
        body: { message: 'Conta criada com sucesso' }
      }).as('registerUser');

      // Preenche o formulário com dados válidos
      cy.get('input[name="name"]').type('Nome Teste');
      cy.get('input[name="enrollment"]').type('1234567811');
      cy.get('input[name="email"]').type('teste@taaaa.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');

      // Envia o formulário
      cy.get('button[type="submit"]').click();

      // Verifica se o toast de sucesso aparece
      cy.contains('Conta criada com sucesso').should('be.visible');
    });

    it('should show error when registration fails', () => {
      // Mock para simular um erro ao criar a conta
      cy.intercept('POST', '/api/register', {
        statusCode: 400,
        body: { errors: ['Email já existente!', 'Matricula ja existente!'] }
      }).as('registerUserFail');

      // Preenche o formulário com dados válidos
      cy.get('input[name="name"]').type('Nome Teste');
      cy.get('input[name="enrollment"]').type('123456789');
      cy.get('input[name="email"]').type('admin@admin.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');

      // Envia o formulário
      cy.get('button[type="submit"]').click();

      // Aguarda a chamada da API ser feita
    //   cy.wait('@registerUserFail');

      // Verifica se as mensagens de erro específicas aparecem
      cy.contains('Email já existente!').should('be.visible');
    //   cy.contains('Matricula ja existente!').should('be.visible');
    });

    it('should show error if enrollment is already registered', () => {
      // Mock para simular um erro onde a matrícula já está cadastrada
      cy.intercept('POST', '/api/register', {
        statusCode: 400,
        body: { errors: ['Matrícula já cadastrada'] }
      }).as('registerDuplicateEnrollment');

      // Preenche o formulário com dados válidos, mas uma matrícula já existente
      cy.get('input[name="name"]').type('Nome Teste');
      cy.get('input[name="enrollment"]').type('123456789'); // Matrícula já cadastrada
      cy.get('input[name="email"]').type('novoemail@teste.com');
      cy.get('input[name="password"]').type('senha123');
      cy.get('input[name="confirmPassword"]').type('senha123');

      // Envia o formulário
      cy.get('button[type="submit"]').click();

      // Aguarda a chamada da API ser feita
    //   cy.wait('@registerDuplicateEnrollment');

      // Verifica se a mensagem de erro aparece
      cy.contains('Matricula ja existente!').should('be.visible');
    });
  });
