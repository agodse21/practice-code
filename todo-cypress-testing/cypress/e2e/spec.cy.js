/// <reference types="Cypress" />
describe('Checking The Todo application', () => {
  it('should be able to visit the application URL', () => {
    cy.visit('http://localhost:3000/');

  });

  it("Should check the basic stucture  of the App",()=>{
    cy.visit('http://localhost:3000/')
    cy.get("form").should('exist');
cy.get("h1").should("exist");
cy.get(".inputBox").should("exist");
cy.get(".Addbtn").should("exist");
  });
  it("Should intercept a GET request",()=>{
    cy.visit("http://localhost:3000")
     cy.intercept('GET',"http://localhost:8080/todos",{ 
      "title": "hello",
      "status": false,
      "id": 2
    }).as("getReq");
 
     cy.wait('@getReq').should((data)=>{
         console.log("the data is",data)
     })
 
     });

     it("Should intercept POST request",()=>{
      cy.visit("http://localhost:3000")
      cy.intercept('GET',"http://localhost:8080/todos",{  "title": "hello",
      "status": false,
      "id": 2}).as("getReq");
  cy.intercept("POST","http://localhost:8080/todos",{ "title": "java",
  "status": false,
  "id": 3}).as("postReq");
      cy.wait('@getReq');
      cy.get('.Addbtn').click();
      cy.wait("@postReq").then((r)=>{
          console.log("the data is",r)
      })
  
  });


//   it("on submitting the form, if error occurs",()=>{
//     cy.visit("http://localhost:3000")
//   cy.get(".error").should("have.text","")
//     cy.intercept('GET',"http://localhost:8080/todos",{  "title": "hello",
//     "status": false,
//     "id": 2}).as("getReq");
//     cy.intercept("POST","http://localhost:8080/todos",{ "title": "java",
//   "status": false,
//   "id": 3}).as("postReq");
//       cy.wait('@getReq');
//       cy.get('.Addbtn').click();
//       cy.wait("@postReq").then((r)=>{
//           console.log("the data is",r)
//       })
//     cy.get(".error").should("have.text","ERR_CONNECTION_REFUSED")
  
// });

  // it("should be able to add some todos",()=>{
  //   cy.visit('http://localhost:3000/');
  //   cy.get(".todo-list").children().should("have.length",2);
  //   cy.get(".inputBox").type('Learn TypeScript and Testing{enter}');
  // //  cy.get(".todo-list").children().should("have.length",3);
   
  // });

})