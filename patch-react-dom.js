const fs = require("fs");
const path = require("path");

console.log("\nrun react-dom patcher");
//fix https://github.com/facebook/react/issues/8693

const sourcePath = path.join(__dirname, "node_modules", "react-dom", "cjs");

const devFilePath = path.join(sourcePath, "react-dom.development.js");
const prodFilePath = path.join(sourcePath, "react-dom.production.min.js");

const devFileContent = fs.readFileSync(devFilePath, "utf-8");
const prodFileContent = fs.readFileSync(prodFilePath, "utf-8");

const patchedDevFileContent = devFileContent.replace(
  "= rootContainerElement.nodeType === DOCUMENT_NODE",
  "= true || rootContainerElement.nodeType === DOCUMENT_NODE",
);
const patchedProdFileContent = prodFileContent.replace("a=9===a.nodeType||11", "a=true||9===a.nodeType||11");

fs.writeFileSync(devFilePath, patchedDevFileContent);
fs.writeFileSync(prodFilePath, patchedProdFileContent);

console.log("patch ok\n");
