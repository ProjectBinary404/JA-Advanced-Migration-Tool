describe("Joomla Installation Wizard", () => {
  it("should complete Joomla installation", () => {
    cy.visit("http://localhost:8080/installation/index.php");

    // --- Step 1: Site Name ---
    cy.get("#jform_site_name").clear().type("JA Advanced Migration Tool Test");
    cy.get("#step1").click();

    // --- Step 2: Admin User ---
    cy.get("#jform_admin_email")
      .should("be.visible")
      .clear()
      .type("admin@example.com");
    cy.get("#jform_admin_user")
      .clear()
      .type(Cypress.env("joomlaAdminUser") || "admin");
    cy.get("#jform_admin_username")
      .clear()
      .type(Cypress.env("joomlaAdminUser") || "admin");
    cy.get("#jform_admin_password")
      .clear()
      .type(Cypress.env("joomlaAdminPass") || "admin1234234");
    cy.get("#step2").click();

    // --- Step 3: Database ---
    cy.get("#jform_db_type").should("be.visible").select("MySQLi");
    cy.get("#jform_db_host").clear().type("mysql");
    cy.get("#jform_db_user").clear().type("root");
    cy.get('[name="jform[db_pass]"]').clear().type("root");
    cy.get("#jform_db_name").clear().type("joomla");

    // --- Step 4: Install ---
    cy.get("#setupButton").click();
    
    // Wait for installation to complete with multiple possible success indicators
    cy.get("body", { timeout: 60000 }).should(($body) => {
      const bodyText = $body.text();
      expect(
        bodyText.includes("Congratulations! Joomla is now installed") ||
          bodyText.includes("Congratulations! Joomla has been installed") ||
          bodyText.includes("Installation Complete") ||
          bodyText.includes("Joomla is now installed") ||
          $body.find("button:contains('Remove installation folder')").length > 0
      ).to.be.true;
    });

    // Clean up install folder - look for the button more flexibly
    cy.get("body").then(($body) => {
      if (
        $body.find("button:contains('Remove installation folder')").length > 0
      ) {
        cy.contains("Remove installation folder").click();
      } else if (
        $body.find("a:contains('Remove installation folder')").length > 0
      ) {
        cy.contains("a", "Remove installation folder").click();
      } else if (
        $body.find(":contains('Remove installation folder')").length > 0
      ) {
        cy.contains("Remove installation folder").click();
      }
    });

    cy.wait(5000);
    // Ensure redirect to administrator login
    cy.url().should("include", "/administrator/index.php");
    cy.get("#mod-login-username").should("be.visible");
    cy.get("#mod-login-password").should("be.visible");
  });
});
