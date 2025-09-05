describe("Joomla Installation Wizard", () => {
  it("should complete Joomla installation", () => {
    cy.visit("http://localhost:8080/installation/index.php");

    // --- Step 1: Site Name ---
    cy.get("#jform_site_name").clear().type("JA Advanced Migration Tool Test");
    cy.contains("Next").click();

    // --- Step 2: Admin User ---
    cy.get("#jform_admin_email")
      .should("be.visible")
      .clear()
      .type("admin@example.com");
    cy.get("#jform_admin_user")
      .clear()
      .type(Cypress.env("JOOMLA_ADMIN_USER") || "admin");
    cy.get("#jform_admin_password")
      .clear()
      .type(Cypress.env("JOOMLA_ADMIN_PASS") || "admin123");
    cy.get("#jform_admin_password2")
      .clear()
      .type(Cypress.env("JOOMLA_ADMIN_PASS") || "admin123");
    cy.contains("Next").click();

    // --- Step 3: Database ---
    cy.get("#jform_db_type").should("be.visible").select("MySQLi");
    cy.get("#jform_db_host").clear().type("mysql");
    cy.get("#jform_db_user").clear().type("root");
    cy.get("#jform_db_password").clear().type("root");
    cy.get("#jform_db_name").clear().type("joomla");
    cy.contains("Next").click();

    // --- Step 4: Install ---
    cy.contains("Install").click();

    // Success confirmation
    cy.contains("Congratulations! Joomla is now installed.").should("be.visible");

    // Clean up install folder
    cy.contains("Remove installation folder").click();

    // Ensure redirect to administrator login
    cy.url().should("include", "/administrator/index.php");
    cy.get("#mod-login-username").should("be.visible");
    cy.get("#mod-login-password").should("be.visible");
  });
});
