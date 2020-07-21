const babel = require('@babel/core');
const glob = require('glob');

const files = glob.sync(`./test/**/*.{js,jsx,ts,tsx}`, {
  ignore: './test/test.js',
});
files.forEach((file) => {
  const { code } = babel.transformFileSync(file, {
    plugins: [['./lib/index.js', {}]],
  });
  console.log('-------------- ' + file + '----------------');
  console.log(code);
});
