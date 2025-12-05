

describe('Testy widoku szczegółów Grupy', () => {
    const selectors = {
        pageTitle: '.flex.items-center.gap-2.text-black.text-2xl.font-bold',
        tabs: {
            general: 'button:contains("Ogólne")',
            students: 'button:contains("Studenci")',
            services: 'button:contains("Usługi")'
        },

        editButton: 'button:contains("Edytuj")',
        form: {
            nameInput: 'input[name="name"]',

            lecturerChip: 'div:contains("Radosław Kazibut")',

            startDateInput: 'input[value="18/12/2025"], input[type="date"]',
            endDateInput: 'input[value="17/01/2026"], input[type="date"]',

            statusBadge: 'input[name="status"]',

            archiveButton: 'button:contains("Archiwizuj")',

            descriptionTextarea: 'textarea'
        }
    };

    beforeEach(() => {
        cy.fixture('groups/details/group-info.json').then((group) => {

            cy.intercept('GET', `**/api/groups/${group.groupId}`, {
                body: group
            }).as('getGroupDetails');

            cy.loginAsAdmin();
            cy.visit(`/groups/${group.groupId}`);
            cy.wait('@getGroupDetails');
        });
    });
    it('TC01: Powinien wyświetlić poprawny tytuł i zakładki', () => {
        cy.get(selectors.pageTitle).should('contain', 'Informacje o grupie');

        cy.get(selectors.tabs.general).should('be.visible');
        cy.get(selectors.tabs.students).should('be.visible');
        cy.get(selectors.tabs.services).should('be.visible');
    });

    it('TC02: Powinien wyświetlić dane grupy zgodne z Fixture (API)', () => {
        cy.fixture('groups/details/group-info.json').then((group) => {

            cy.get('input[name="name"]')
                .should('have.value', group.name);

            const lecturer = group.lecturerFullNames[0];
            const fullName = `${lecturer.firstName} ${lecturer.lastName}`;

            cy.get(selectors.form.lecturerChip)
                .should('contain', fullName);

            cy.get('input[name="startDate"]')
                .should('have.value', '2025-12-18');

            cy.get('input[name="endDate"]')
                .should('have.value', '2026-01-17');

            cy.get(selectors.form.statusBadge)
                .should('have.value', group.status);

            cy.get(selectors.form.descriptionTextarea)
                .should('have.value', group.description);
        });
    });

    it('TC03: Przyciski akcji (Edytuj, Archiwizuj) powinny być widoczne', () => {
        cy.get(selectors.editButton).should('be.visible').and('not.be.disabled');
        cy.get(selectors.form.archiveButton).should('be.visible');
    });

});