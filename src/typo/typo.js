const mailCheck = require('mailcheck');

const checkTypo = async (email, additionalTLDs) => {
  return new Promise((resolve) => {
    let topLevelDomains = undefined;
    if (additionalTLDs && additionalTLDs.length > 0) {
      topLevelDomains = [...mailCheck.defaultTopLevelDomains, ...additionalTLDs];
    }
    mailCheck.run({
      email,
      topLevelDomains: topLevelDomains,
      suggested: (suggestion) => {
        resolve(`Likely typo, suggested email: ${suggestion.full}`);
      },
      empty: function () {
        resolve();
      },
    });
  });
};

module.exports = {
  checkTypo,
};
