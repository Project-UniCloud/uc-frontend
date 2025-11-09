describe('Login Page', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:3000/login')
  });

  it('Should display the login page correctly', ()=>{
    cy.getWithDataCy('login-header').should('have.text', 'Miło Cię znowu widzieć!');
    cy.get('form').within(() => {
      cy.get('label').eq(0).should('have.text', 'Login');
      cy.get('input').eq(0).should('have.attr', 'placeholder', 'Wprowadź login');

      cy.get('label').eq(1).should('have.text', 'Hasło');
      cy.get('input').eq(1).should('have.attr', 'placeholder', 'Wprowadź hasło');

        cy.get('button').should('have.text', 'Zaloguj');
    });

    cy.getWithDataCy('logo-login-page').should('have.attr', 'src', '/_next/image?url=%2Flogo.png&w=3840&q=75');
    cy.get('img').eq(0).should('have.attr', 'src', '/_next/image?url=%2Fwmi.png&w=3840&q=75');

  });

  it.only('Should log the user in correctly', () => {
    stubLogin().as('loginStub');
    cy.getWithDataCy('input-login').type('s123234567');
    cy.getWithDataCy('input-password').type('password');

    cy.get('button').click();
    cy.wait('@loginStub')
    cy.wait(500); // wait for redirect
    cy.get('h1').should('have.text', 'Witamy w UniCloud Manager!');
    cy.get('.text-gray-8-00').should('have.text', 'Akademickim systemie zarządzania zasobami chmurowymi WMiI UAM. Nasza platforma umożliwia efektywne zarządzanie zasobami chmurowymi, automatyzację rutynowych procesów i monitorowanie wykorzystania infrastruktury. Zachęcamy do korzystania z narzędzia i dzielenia się opinią na temat dalszego rozwoju systemu.');
  });
});

function stubLogin(){
  return cy.intercept('POST', 'http://localhost:8080/api/auth', {
    statusCode: 200,
    body: { role: 'ADMIN' },
    headers: {
      'Set-Cookie': 'jwt=twojastara2137; Path=/; HttpOnly;',
    },
  });
}