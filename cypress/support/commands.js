Cypress.Commands.add('getWithDataCy', (dataCy) => {
    return cy.get(`[data-cy="${dataCy}"]`);
});

// cypress/support/commands.js

function stubLogin() {
    return cy.intercept('POST', 'http://localhost:8080/api/auth', {
        statusCode: 200,
        body: { role: 'ADMIN' },
        headers: {
            'Set-Cookie': 'jwt=twojastara2137; Path=/; HttpOnly;',
        },
    });
}

Cypress.Commands.add('loginAsAdmin', () => {
    cy.session('admin', () => {
        cy.intercept('POST', 'http://localhost:8080/api/auth', {
            statusCode: 200,
            body: { role: 'ADMIN' },
            headers: {
                'Set-Cookie': 'jwt=twojastara2137; Path=/; HttpOnly;',
            },
        }).as('loginStub');

        // ustawiamy cookie jak po zalogowaniu
        cy.setCookie('jwt', 'twojastara2137');
    }, { cacheAcrossSpecs: true }); // true, żeby nie logować za każdym razem
});

