describe('Login Page', () => {
  beforeEach(()=>{
    cy.visit('http://localhost:3000/login')
    stubLogin().as('loginStub');
  });

  it('Should display the login page correctly', ()=>{
    cy.getWithDataCy('wmi-image-side').should('be.visible');
    cy.getWithDataCy('wmi-image-side').should('have.attr', 'src').and('include', '%2Fwmi.png');

    cy.getWithDataCy('logo-login-page').should('be.visible');
    cy.getWithDataCy('logo-login-page').should('have.attr', 'src').and('include', '%2Flogo.png');

    cy.getWithDataCy('login-header').should('be.visible').and('have.text', 'Miło Cię znowu widzieć!');

    cy.getWithDataCy('input-login').should('be.visible').and('have.attr', 'placeholder', 'Wprowadź login');
    cy.getWithDataCy('input-password').should('be.visible').and('have.attr', 'placeholder', 'Wprowadź hasło');


    cy.getWithDataCy('remebeer-me-checkbox').should('be.visible').and('have.text', 'Pamiętaj mnie');

    cy.getWithDataCy('login-submit-button').should('be.visible').and('have.text', 'Zaloguj');
    cy.getWithDataCy('login-submit-button').should('have.css', 'background-color', 'rgb(97, 77, 226)');

    cy.getWithDataCy('login-footer').should('have.text', '© Unicloud 2025');
  });

  it('Should log the user in correctly', () => {
    cy.getWithDataCy('input-login').type('admin');
    cy.getWithDataCy('input-password').type('password');

    cy.getWithDataCy('login-submit-button').click();
    cy.wait('@loginStub')

    cy.getWithDataCy('title').should('have.text', 'Przegląd');
    cy.get('h1').should('have.text', 'Dashboard');
  });


})

function stubLogin(){
  return cy.intercept('POST', 'http://localhost:8080/api/auth', {
    statusCode: 200,
    body: { role: 'ADMIN' },
    headers: {
      'Set-Cookie': 'jwt=twojastara2137; Path=/; HttpOnly;',
    },
  });
}