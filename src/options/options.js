const defaultOptions = {
    email: 'name@example.org',
    sender: 'name@example.org',
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: true,
    validateAcceptAll : true,
  };
  
  const getOptions = (emailOrOptions) => {
    let options = defaultOptions;
  
    if (typeof emailOrOptions === 'string') {
      options = { ...options, email: emailOrOptions };
    } else {
      options = { ...options, ...emailOrOptions };
    }
  
    return options;
  };
  
  module.exports = {
    defaultOptions,
    getOptions,
  };
  