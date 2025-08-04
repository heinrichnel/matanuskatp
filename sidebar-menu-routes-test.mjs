// sidebar-menu-routes-test.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { sidebarConfig } = require("./src/config/sidebarConfig");

function getComponentName(component) {
  if (!component) return "None";
  // Try to show lazy type or named function/component
  if (component.displayName) return component.displayName;
  if (component.name) return component.name;
  if (typeof component === "function")
    return component.toString().match(/function (\w+)/)?.[1] || "FunctionComponent";
  if (component.$$typeof) return "LazyComponent";
  return "Unknown";
}

function printSidebarRoutes(items, prefix = "") {
  for (const item of items) {
    if (item.path && item.component) {
      console.log(`${prefix}${item.label} => ${item.path} => ${getComponentName(item.component)}`);
    }
    if (item.children) printSidebarRoutes(item.children, prefix + "  ");
  }
}

console.log("\nSidebar menu options and mapped routes:\n");
printSidebarRoutes(sidebarConfig);
