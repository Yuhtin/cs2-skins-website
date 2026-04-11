const fse = require('fs-extra');
const path = require('path');

const backendSrc = path.resolve(__dirname, 'backend');
const backendDest = path.resolve(__dirname, 'dist/api');

fse.removeSync(backendDest);

fse.copySync(backendSrc, backendDest, {
  overwrite: true,
  filter: (src) => {
    const lowerSrc = src.toLowerCase();
    return !lowerSrc.includes('.vscode') && !lowerSrc.includes('/old') && !lowerSrc.includes('\\old');
  },
});

console.log('Backend copied to dist/api');
