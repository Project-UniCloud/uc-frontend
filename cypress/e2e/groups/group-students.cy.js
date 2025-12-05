describe('Testy zakładki Studenci w Grupie', () => {

    const selectors = {
        tabStudents: '.px-4.py-2.border-b-2.cursor-pointer.border-transparent.text-gray-500',
        addStudentBtn: 'button:contains("Dodaj Studenta")',
        importBtn: 'button:contains("Importuj")',

        table: {
            row: 'tbody tr',
            colLogin: 'td:nth-child(1)',
            colFirstName: 'td:nth-child(2)',
            colLastName: 'td:nth-child(3)',
            colEmail: 'td:nth-child(4)'
        },

        modal: {
            title: 'h2:contains("Dodaj studenta")',

            inputFirstName: 'input[placeholder="Jakub"]',
            inputLastName: 'input[placeholder="Kowalski"]',
            inputIndex: 'input[placeholder="s123456"]',
            inputEmail: 'input[placeholder*="@"]',

            submitBtn: 'button:contains("Dodaj studenta")',
            cancelBtn: 'button:contains("Anuluj")'
        },
        modalImport: {
            title: 'div:contains("Dodaj plik CSV")',
            fileInput: 'input[type="file"]',
            dropZone: '.dropzone, div:contains("Przeciągnij plik")',

            submitBtn: 'button:contains("Dodaj studentów")'
        }
    };

    const groupId = '9fb6ccc8-b707-4d3f-ad86-494177e7618c';

    beforeEach(() => {
        cy.fixture('groups/details/group-info.json').then((group) => {

            cy.intercept('GET', `**/api/groups/${group.groupId}`, {
                body: group
            }).as('getGroupDetails');

            cy.intercept('GET', `**/api/groups/${groupId}/students*`, {
                fixture: 'groups/details/group-students-list.json'
            }).as('getStudentsList');

            cy.loginAsAdmin();
            cy.visit(`/groups/${group.groupId}`);
            cy.wait('@getGroupDetails');

            cy.get(selectors.tabStudents).eq(0).click();
            cy.wait('@getStudentsList');
        });

    });

    it('TC01: Powinien wyświetlić tabelę studentów zgodnie z danymi z API', () => {
        cy.fixture('groups/details/group-students-list.json').then((data) => {
            const student = data.content[0];

            cy.get(selectors.table.row).first().within(() => {
                cy.get(selectors.table.colLogin).should('contain.text', student.login);

                cy.get(selectors.table.colFirstName).should('contain.text', student.firstName);

                cy.get(selectors.table.colLastName).should('contain.text', student.lastName);

                cy.get(selectors.table.colEmail).should('contain.text', student.email);
            });
        });
    });

    it('TC02: Powinien dodać nowego studenta przez Modal', () => {
        const newStudent = {
            firstName: 'Adam',
            lastName: 'Nowak',
            index: 's999999',
            email: 'adam.nowak@st.amu.edu.pl'
        };

        cy.intercept('POST', `**/api/groups/${groupId}/students`, {
            statusCode: 201, // Created
            body: { uuid: 'new-uuid-123', ...newStudent }
        }).as('createStudentRequest');

        cy.get(selectors.addStudentBtn).click();
        cy.contains('Dodaj studenta').should('be.visible');

        cy.get(selectors.modal.inputFirstName).type(newStudent.firstName);
        cy.get(selectors.modal.inputLastName).type(newStudent.lastName);
        cy.get(selectors.modal.inputIndex).type(newStudent.index);
        cy.get(selectors.modal.inputEmail).type(newStudent.email);

        cy.get(selectors.modal.submitBtn).click();

        cy.wait('@createStudentRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(201);

            expect(interception.request.body).to.include({
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                login: newStudent.index,
                email: newStudent.email
            });
        });

        cy.get(selectors.modal.submitBtn).should('not.exist');
    });

    it.only('TC03: Powinien zaimportować studentów z pliku CSV', () => {
        cy.intercept('POST', `**/api/groups/${groupId}/students/import`, {
            statusCode: 200,
            body: { importedCount: 2, message: 'Success' }
        }).as('importCsvRequest');

        cy.get(selectors.importBtn).click();

        cy.contains('Dodaj plik CSV').should('be.visible');

        cy.get(selectors.modalImport.fileInput).selectFile('cypress/fixtures/groups/details/students-import.csv', { force: true });

        cy.get(selectors.modalImport.submitBtn).click();

        cy.wait('@importCsvRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });

        cy.get(selectors.modalImport.submitBtn).should('not.exist');
    });

});