import { registerCommands } from "joomla-cypress";
import "./command.js";
registerCommands();

// Handle uncaught exceptions from Joomla's guided tours and other plugins
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  if (
    err.message.includes(
      "Cannot read properties of undefined (reading 'length')"
    ) ||
    err.message.includes("guidedtours.min.js")
  ) {
    return false;
  }
  // Let other errors fail the test
  return true;
});
