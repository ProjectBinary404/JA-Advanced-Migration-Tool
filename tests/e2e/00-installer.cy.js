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
    cy.wait(5000)
    cy.get('body', { timeout: 60000 }).should(($body) => {
    // Check for various possible success messages
    const successMessages = [
      'Congratulations! Joomla is now installed.',
      'Congratulations! Joomla has been installed.',
      'Installation completed successfully',
      'Joomla is now installed',
      'Installation Complete'
    ];
    
    let found = false;
    successMessages.forEach(message => {
      if ($body.text().includes(message)) {
        found = true;
      }
    });
    
    expect(found, 'Installation success message not found').to.be.true;
  });

    // Clean up install folder
    cy.contains("Remove installation folder").click();
    cy.wait(5000);
    // Ensure redirect to administrator login
    cy.url().should("include", "/administrator/index.php");
    cy.get("#mod-login-username").should("be.visible");
    cy.get("#mod-login-password").should("be.visible");
  });
});
