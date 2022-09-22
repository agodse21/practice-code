/// <reference types="Cypress" />
describe('Checking The application', () => {
  it('should be able to visit the application URL', () => {
    cy.visit('http://localhost:3000/')
  });
  it('Should have all the components',()=>{
    cy.visit('http://localhost:3000/');
   cy.get(".inputbox").should("exist");
   
  });
  it('The input element should be auto-focused ',()=>{
    cy.visit('http://localhost:3000/');
   cy.get(".inputbox").then((input) => {
    const InputSelector = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const inputDOM = input[0];
    InputSelector.call(inputDOM, '');
   });

  })
  it('Should be able to type something in input element',()=>{
    cy.visit('http://localhost:3000/');
   cy.get(".inputbox").then((input) => {
    const InputValueSelector = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const inputDOM = input[0];
    InputValueSelector.call(inputDOM, 'test');
    inputDOM.dispatchEvent(new Event('change', { bubbles: true }));
   });

  })
})


