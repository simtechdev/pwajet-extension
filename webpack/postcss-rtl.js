const rtlLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
        require('postcss-rtl')(
          {
            addPrefixToSelector: function addPrefixToSelector ( selector, prefix ) {
              if (prefix === '[dir]' || prefix === '[dir=ltr]') {
                return `${selector}`
              }

              return `${prefix} ${selector}`
            }
          }
        )
      ]
    }
  }
};

module.exports.rtlLoader = rtlLoader;
