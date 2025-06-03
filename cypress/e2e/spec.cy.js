describe('TODOMvc App', () => {
  it('Verifica se app está abrindo', () => {
    cy.visit('')
  })

  it('Insere uma tarefa', () => {
    cy.visit(''); 

    cy.get('[data-cy=todo-input]')
      .type('TP2 de Engenharia de Software{enter}');

    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1) 
      .first()
      .should('have.text', 'TP2 de Engenharia de Software'); 
  });

  it('Insere e deleta uma tarefa', () => {
    cy.visit('');

    cy.get('[data-cy=todo-input]')
      .type('TP2 de Engenharia de Software{enter}');

    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1);

    cy.get('[data-cy=todos-list] > li [data-cy=remove-todo-btn]')
      .invoke('show')
      .click();

    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 0);
  });

  it('Filtra tarefas completas e ativas', () => {
    cy.visit(''); 

    cy.get('[data-cy=todo-input]')
      .type('TP2 de ES{enter}')
      .type('Prova de ES{enter}');

    cy.get('[data-cy=todos-list] > li [data-cy=toggle-todo-checkbox]')
      .first()
      .click();

    cy.get('[data-cy=filter-active-link')
      .click();
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1)
      .first()
      .should('have.text', 'Prova de ES');

    cy.get('[data-cy=filter-completed-link')
      .click();
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 1)
      .first()
      .should('have.text', 'TP2 de ES');

    cy.get('[data-cy=filter-all-link')
      .click();
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 2);
  });
});

describe('TodoMVC App - Testes Novos', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('Edita uma tarefa existente', () => {
    // Adiciona uma tarefa
    cy.get('[data-cy=todo-input]').type('Estudar Cypress{enter}');
    
    // Dá duplo clique no label da primeira tarefa para entrar em modo de edição
    cy.get('[data-cy=todos-list] li')
      .first()
      .find('label')
      .dblclick();

    // Edita o texto no input de edição (classe .edit)
    cy.get('.edit')
      .clear()
      .type('Estudar Cypress E2E !!!{enter}');
    
    // Valida que o texto da tarefa foi alterado
    cy.get('[data-cy=todos-list] li')
      .first()
      .find('label')
      .should('have.text', 'Estudar Cypress E2E !!!');
  });

  it('Cancela edição com Esc', () => {
    // Adiciona uma tarefa
    cy.get('[data-cy=todo-input]').type('Primeira tarefa{enter}');

    // Duplo clique no label para entrar em modo de edição
    cy.get('[data-cy=todos-list] li')
      .first()
      .find('label')
      .dblclick();

    // Edita o texto, mas cancela com ESC
    cy.get('.edit')
      .clear()
      .type('Texto editado{esc}');

    // Verifica que o texto original permanece
    cy.get('[data-cy=todos-list] li')
      .first()
      .find('label')
      .should('have.text', 'Primeira tarefa');
  });

  it('Limpeza de Tarefas Completas', () => {
    // Cria 5 novas tarefas
    const tarefas = [
      'Engenharia de Software Prova 2',
      'Linguagens de Programação Prova 2',
      'Compiladores 1 Prova 3',
      'Sexta amigos',
      'Monitoria'
    ];
    tarefas.forEach(tarefa => {
      cy.get('[data-cy=todo-input]').type(`${tarefa}{enter}`);
    });

    // Confere a contagem de tarefas
    cy.get('[data-cy=todos-list]').children().should('have.length', 5);

    // Completa as 3 primeiras tarefas
    cy.get('[data-cy=todos-list] > li').each(($li, idx) => {
      if (idx < 3) {
        cy.wrap($li).find('[data-cy=toggle-todo-checkbox]').click();
      }
    });

    // Usa o botão de apagar completas
    cy.get('.clear-completed').should('be.visible').click();

    // Confere o comportamento das restantes
    cy.get('[data-cy=todos-list]')
      .children()
      .should('have.length', 2)
      .first()
      .should('contain.text', 'Sexta amigos')
      .next()
      .should('contain.text', 'Monitoria');
  });

  it('Botão que completa todas as tarefas', () => {
    // Cria 5 novas tarefas
    const tarefas = [
      'Engenharia de Software Prova 2',
      'Linguagens de Programação Prova 2',
      'Compiladores 1 Prova 3',
      'Sexta amigos',
      'Monitoria'
    ];
    tarefas.forEach(tarefa => {
      cy.get('[data-cy=todo-input]').type(`${tarefa}{enter}`);
    });

    // Clica na opção de marcar todos (label aciona o input .toggle-all)
    cy.get('.toggle-all-label').click();

    // Itera pela lista checando se todos estão completas (classe 'completed')
    cy.get('[data-cy=todos-list] > li')
      .should('have.length', 5)
      .each(($li) => {
        cy.wrap($li).should('have.class', 'completed');
      });

    // Clica novamente para desmarcar todos
    cy.get('.toggle-all-label').click();

    cy.get('[data-cy=todos-list] > li')
      .each(($li) => {
        cy.wrap($li).should('not.have.class', 'completed');
      });
  });
});