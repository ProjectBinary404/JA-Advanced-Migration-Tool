describe("Joomla Installation Wizard", () => {
  it("should complete Joomla installation", () => {
    // Visit Joomla installer
    cy.visit("http://localhost:8080/installation/index.php");

    // --- Step 1: Site Setup ---
    cy.get("#jform_site_name").clear().type("JA Advanced Migration Tool Test");
    cy.get("#jform_admin_email").clear().type("admin@example.com");
    cy.get("#jform_admin_user").clear().type(Cypress.env("JOOMLA_ADMIN_USER"));
    cy.get("#jform_admin_password").clear().type(Cypress.env("JOOMLA_ADMIN_PASS"));
    cy.get("#jform_admin_password2").clear().type(Cypress.env("JOOMLA_ADMIN_PASS"));
    cy.contains("Next").click();

    // --- Step 2: Database Setup ---
    cy.get("#jform_db_type").select("MySQLi");
    cy.get("#jform_db_host").clear().type("mysql");
    cy.get("#jform_db_user").clear().type("root");
    cy.get("#jform_db_password").clear().type("root");
    cy.get("#jform_db_name").clear().type("joomla");
    cy.contains("Next").click();

    // --- Step 3: Finalization ---
    cy.contains("Install").click();

    // Wait until installation finishes and remove installation folder link appears
    cy.contains("Congratulations! Joomla is now installed.").should("be.visible");

    // Remove installation folder (required before Joomla lets you log in)
    cy.contains("Remove installation folder").click();

    // Redirect to admin login
    cy.url().should("include", "/administrator/index.php");
    cy.get("#mod-login-username").should("be.visible");
    cy.get("#mod-login-password").should("be.visible");
  });
});
