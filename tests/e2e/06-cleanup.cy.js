describe("Joomla cleanup: clear content, categories, fields, media, tags, and users", () => {
  const adminUser = Cypress.env("joomlaAdminUser") || "admin";

  beforeEach(() => {
    // Maintain login session
    cy.session("adminLogin", () => {
      cy.doAdministratorLogin(
        Cypress.env("joomlaAdminUser"),
        Cypress.env("joomlaAdminPass"),
        true
      );
    });

    // Navigate to admin and handle popups
    cy.visit("/administrator");
    cy.handlePopups();
  });

  it("Clears all Articles", () => {
    cy.trashAndEmpty(
      "/administrator/index.php?option=com_content&view=articles",
      "articles"
    );
  });

  it("Clears all Categories (content categories)", () => {
    cy.trashAndEmpty(
      "/administrator/index.php?option=com_categories&extension=com_content",
      "categories"
    );
  });

  it("Clears all Fields (custom fields)", () => {
    cy.trashAndEmpty(
      "/administrator/index.php?option=com_fields&view=fields",
      "fields"
    );
  });

  it("Removes 'imports' folder from Media", () => {
    cy.visit("/administrator/index.php?option=com_media");
    cy.wait(2000); // Wait for media manager to load

    cy.get("body").then(($body) => {
      if ($body.find(".media-browser-item").length > 0) {
        cy.get(".media-browser-item").then(($items) => {
          const matchingItem = [...$items].find(
            (item) =>
              item
                .querySelector(".media-browser-item-info")
                ?.textContent.trim() === "imports"
          );

          if (matchingItem) {
            cy.log("Found 'imports' folder, deleting");
            cy.wrap(matchingItem).within(() => {
              cy.get(".media-browser-item-preview").click({ force: true });
            });
            cy.wait(500);
            cy.get(
              'button:contains("Delete"), [aria-label*="Delete"], .fa-trash, a:contains("Delete")'
            )
              .first()
              .click({ force: true });
            cy.get('.modal-dialog[role="dialog"]').should("be.visible");
            cy.get("#media-delete-item.btn-danger").click({ force: true });
            cy.get('.modal-dialog[role="dialog"]').should("not.exist");
            cy.log("'imports' folder deleted successfully");
          } else {
            cy.log("No 'imports' folder found");
          }
        });
      } else {
        cy.log("Media browser items not found or different structure");
      }
    });
  });

  it("Clears all Tags", () => {
    cy.trashAndEmpty("/administrator/index.php?option=com_tags", "tags");
  });

  it("Clears Users except Super Users", () => {
    cy.visit("/administrator/index.php?option=com_users");
    cy.wait(1000);
    cy.setListLimitToAll();
    cy.hasListItems().then((hasItems) => {
      if (hasItems) {
        cy.log("Found users to delete");
        cy.get('input[name="checkall-toggle"]').check({ force: true });
        // Uncheck Super Users
        cy.get("table tbody tr").each(($row) => {
          if ($row.find("td:contains('Super Users')").length) {
            cy.wrap($row)
              .find('input[type="checkbox"][name*="cid"]')
              .uncheck({ force: true });
          }
        });
        cy.get(
          '[data-bs-target="#toolbar-delete"], button:contains("Delete"), a:contains("Delete")'
        )
          .first()
          .click({ force: true });
        cy.confirmDialog();
        cy.log("Deleted non-Super Users");
      } else {
        cy.log("No users found to delete");
      }
    });
  });

  after(() => {
    cy.visit("/administrator");
    cy.customAdministratorLogout();
    // Verify logout by checking if redirected to login page
    cy.url({ timeout: 10000 }).should("include", "/administrator/index.php");
    // Verify login form is present
    cy.contains("Username", { timeout: 10000 }).should("be.visible");
    cy.log("✅ Logout verification successful: User logged out from admin.");
  });
});
