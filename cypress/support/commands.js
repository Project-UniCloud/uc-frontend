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
    cy.session(
        'admin',
        () => {
            stubLogin(); // interceptujemy zapytanie logowania

            // symulacja zalogowanego użytkownika – np. ustawiamy cookie
            cy.setCookie('jwt', 'twojastara2137');

            // możesz też przejść od razu na stronę chronioną
            // cy.visit('/dashboard'); ← opcjonalnie
        },
        { cacheAcrossSpecs: false }
    );
});
