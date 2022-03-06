const CracoLessPlugin = require("craco-less");
const path = require("path");

const isPro = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [{ plugin: CracoLessPlugin }],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    configure: {
      output: {
        publicPath: isPro ? '/dyhf/' : '/tcatche/dyhf',
      },
    },
  },
};