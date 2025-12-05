describe('Testy zakładki Usługi w Grupie', () => {
    const selectors = {
        tabServices: '.px-4.py-2.border-b-2.cursor-pointer.border-transparent.text-gray-500',

        emptyStateMessage: 'div:contains("Brak usług dla tej grupy")',
        suspendAllBtn: 'button:contains("Zawieś wszystko")',
        addServiceBtn: 'button:contains("Dodaj usługę")',

        modal: {
            title: 'h2:contains("Dodaj dostęp")',

            labelController: 'div:contains("Sterownik")',
            selectController: 'select',

            labelService: 'div:contains("Usługa")',
            selectService: 'select',

            inputLimit: 'input[type="number"]',

            cancelBtn: 'button:contains("Anuluj")',
            submitBtn: 'button:contains("Dodaj")'
        }
    };

    const groupId = '9fb6ccc8-b707-4d3f-ad86-494177e7618c';

    beforeEach(() => {
        cy.fixture('groups/details/group-info.json').then((group) => {

            cy.intercept('GET', `**/api/groups/${group.groupId}`, {
                body: group
            }).as('getGroupDetails');

            cy.intercept('GET', `**/api/groups/${groupId}/cloud-access*`, {
                body: []
            }).as('getServicesList');

            cy.loginAsAdmin();
            cy.visit(`/groups/${group.groupId}`);
            cy.wait('@getGroupDetails');

            cy.get(selectors.tabServices).eq(1).click();
            cy.wait('@getServicesList');
        });
    });

    it('TC01: Powinien wyświetlić komunikat o braku usług (Empty State)', () => {
        cy.get(selectors.emptyStateMessage).should('be.visible');

        cy.get(selectors.addServiceBtn).should('be.visible');

        cy.get(selectors.suspendAllBtn).should('be.visible');
    });

    it('TC02: Powinien otworzyć modal i wysłać żądanie dodania dostępu', () => {
        const newAccess = {
            controller: 'aws',
            service: 'EC2',
            limit: '3000'
        };

        cy.intercept('GET', `**/api/cloud/connector?page=0&pageSize=10`, {
            statusCode: 200,
            body: {
                "content": [
                    {
                        "cloudConnectorId": "aws",
                        "cloudConnectorName": "Default",
                        "costLimit": 1337.00,
                        "defaultCronExpression": "0 0 * * * *"
                    }
                ],
                "page": {
                    "size": 10,
                    "number": 0,
                    "totalElements": 1,
                    "totalPages": 1
                }
            }
        }).as('driversRequest');

        cy.intercept('GET', `**/api/cloud/connector/aws/resource-types`, {
            statusCode: 200,
            body: [{"name":"EC2"}]
        }).as('driversResourcesRequest');

        cy.intercept('POST', `**/api/groups/${groupId}/cloud-access`, {
            statusCode: 200
        }).as('addServiceRequest');

        cy.get(selectors.addServiceBtn).click();
        cy.wait('@driversRequest');

        cy.get(selectors.modal.title).should('be.visible');

        cy.get('select').first().select(newAccess.controller);
        cy.wait('@driversResourcesRequest');
        cy.get('select').eq(1)
            .select(newAccess.service);

        cy.get(selectors.modal.inputLimit)
            .clear()
            .type(newAccess.limit);

        cy.get(selectors.modal.submitBtn).eq(0).click();

    });

});