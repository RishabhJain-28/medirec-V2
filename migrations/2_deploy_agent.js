const fs = require("fs");
const path = require("path");
var Agent = artifacts.require("Agent");

module.exports = function (deployer) {
  deployer.deploy(Agent).then(() => {
    let config = `
    const contractAddress = "${Agent.address}"
  `;

    let data = JSON.stringify(config);
    fs.writeFileSync(
      path.join(__dirname, "../src/js/contractAddress.js"),
      JSON.parse(data)
    );
  });
};
