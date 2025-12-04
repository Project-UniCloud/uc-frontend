
describe('Strona Zarządzania Grupami', () => {
    const selectors = {
        headerTitle: '[data-cy="title"]',
        tabs: {
            active: 'button:contains("Aktywne")',
            archived: 'button:contains("Zarchiwizowane")',
            inactive: 'button:contains("Nieaktywne")'
        },
        actions: {
            addButton: 'button:contains(" Dodaj grupę")',
            searchInput: 'input[placeholder="Szukaj grupy"]'
        },
        table: {
            row: 'tbody tr',

            colId:       'td:nth-child(1)',
            colName:     'td:nth-child(2)',
            colLecturer: 'td:nth-child(3)',
            colServices: 'td:nth-child(4)',
            colSemester: 'td:nth-child(5)',
            colEndDate:  'td:nth-child(6)'
        },
        pagination: {
            nextButton: 'button:contains("Następna")',
            prevButton: 'button:contains("Poprzednia")',
            displaySelect: '.rounded-lg.px-2.py-1.bg-gray-200.cursor-pointer'
        },
        modal: {
            container: 'div[role="dialog"], div:contains("Dodaj grupę")',
            title: 'h2:contains("Dodaj grupę")', // Tytuł w modalu "Dodaj grupę"
            closeBtn: 'button[aria-label="Close"], svg.close-icon', // Ikona X

            inputName: 'input[placeholder="Nazwa grupy"]',

            inputYear: 'input[placeholder="Rok"]',
            selectSemester: 'select',

            inputStartDate: 'input[type="date"]',
            inputEndDate: 'input[type="date"]',

            inputLecturer: 'input[placeholder="Wyszukaj prowadzącego"]',
            inputDescription: 'textarea[placeholder="Opis"]',

            cancelBtn: 'button:contains("Anuluj")',
            submitBtn: 'button:contains("Zatwierdź")'
        }
    };

    const endpoints = {
        pageUrl: 'http://localhost:3000/groups',
        apiGetGroups: '**/api/groups*'
    };

    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit(endpoints.pageUrl);
        cy.intercept('GET', endpoints.apiGetGroups, { fixture: 'groups/all-groups-small.json' }).as('getGroupsData');


        cy.wait('@getGroupsData');
    });

    it('Powinna poprawnie załadować stronę i wyświetlić nagłówek', () => {
        cy.get(selectors.headerTitle).should('be.visible').and('contain', 'Grupy');
    });

    it('TC02: Powinien załadować dane grupy z API do tabeli', () => {
        cy.fixture('groups/all-groups-small.json').then((data) => {
            const groupFromApi = data.content[0];

            cy.get(selectors.table.row).first().within(() => {

                cy.get(selectors.table.colName)
                    .should('contain.text', groupFromApi.name);

                cy.get(selectors.table.colLecturer)
                    .should('contain.text', groupFromApi.lecturers);

                cy.get(selectors.table.colSemester)
                    .should('contain.text', groupFromApi.semester);
                cy.get(selectors.table.colEndDate)
                    .should('contain.text', groupFromApi.endDate);
            });
        });
    });

    it('Powinna umożliwić wpisanie tekstu w wyszukiwarkę', () => {
        const searchTerm = 'Grupa Testowa';

        cy.get(selectors.actions.searchInput)
            .should('be.visible')
            .clear()
            .type(searchTerm)
            .should('have.value', searchTerm);
    });

    it('Przycisk "Dodaj Grupę" powinien być widoczny i klikalny', () => {
        cy.get(selectors.actions.addButton)
            .should('be.visible')
            .and('not.be.disabled');
    });

    it('Powinna umożliwiać przełączanie między zakładkami (tabami)', () => {

        cy.get(selectors.tabs.archived).click();

        cy.get(selectors.tabs.archived).should('be.visible');
    });

    it('Elementy paginacji powinny być widoczne', () => {
        cy.get(selectors.pagination.prevButton).should('be.visible');
        cy.get(selectors.pagination.nextButton).should('be.visible');
        cy.get(selectors.pagination.displaySelect).should('have.value', '10'); // Domyślna wartość
    });

    it('TC02: Powinien dodać nową grupę przez Modal', () => {
        // Dane testowe do wpisania
        const newGroup = {
            name: 'Nowa Grupa 2024',
            year: '2024',
            semester: 'L', // Zgodnie z selectem na obrazku
            startDate: '2024-02-20',
            endDate: '2024-06-30',
            lecturer: 'Jan Kowalski',
            desc: 'Testowy opis grupy'
        };
        cy.intercept('POST', '**/api/groups', {
            statusCode: 201,
            body: { id: 100, name: newGroup.name }
        }).as('createGroupRequest');

        cy.get('button:contains(" Dodaj grupę")').click();

        cy.contains('Dodaj grupę').should('be.visible'); // Czekamy aż modal się pojawi

        cy.get(selectors.modal.inputName).type(newGroup.name);
        cy.get(selectors.modal.inputYear).type(newGroup.year);

        cy.get(selectors.modal.inputStartDate).first().type(newGroup.startDate);
        cy.get(selectors.modal.inputEndDate).last().type(newGroup.endDate);

        cy.get(selectors.modal.inputLecturer).type(newGroup.lecturer);
        cy.get(selectors.modal.inputDescription).type(newGroup.desc);

        cy.get(selectors.modal.submitBtn).click();

        cy.wait('@createGroupRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
            expect(interception.request.body).to.include({
                name: newGroup.name,
                description: newGroup.desc
            });
        });
    });
});