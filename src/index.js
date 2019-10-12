const fs = require('fs');
const path = require('path');
var argv = require('minimist')(process.argv.slice(2));

const folders = argv['_'];
const isDeleteFolder = argv.d;

const copyToResultDir = (base, res) => {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      copyToResultDir(localBase, res);
    } else {
      const firstLetter = item.charAt(0);
      const extname = path.extname(item);
      const dest = path.join(res, firstLetter, extname, item);
      try {
        fs.accessSync(path.join(res, firstLetter));
      } catch (err) {
        fs.mkdirSync(path.join(res, firstLetter));
      }
      try {
        fs.accessSync(path.join(res, firstLetter, extname));
      } catch (err) {
        fs.mkdirSync(path.join(res, firstLetter, extname));
      }
      fs.copyFileSync(localBase, dest);
    }
  });
};

const removeDir = (base) => {
  const files = fs.readdirSync(base);
  try {
    files.forEach(item => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      if (state.isDirectory()) {
        removeDir(localBase);
      } else {
        fs.unlinkSync(localBase);
      }
    });
    fs.rmdirSync(base);
  } catch (err) {
    console.log(err.message);
  }
};
// TODO remove this if it does not needed
const removeRedDirecory = (loc) => {
  const files = fs.readdirSync(loc);
  try {
    files.forEach(item => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      if (state.isDirectory()) {
        removeDir(localBase);
      } else {
        fs.unlinkSync(localBase);
      }
    });
    fs.rmdirSync(base);
  } catch (err) {
    console.log(err.message);
  }
};

// adding method to add list of items
const addListOfItems = (list) => {
  const files = fs.readdirSync(list);
  try {
    files.forEach(item => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      if (state.isDirectory()) {
        addDir(localBase);
      } else {
        fs.unlinkSync(localBase);
      }
    });
    fs.addirSync(base);
  } catch (err) {
    console.log(err.message);
  }
};

if (folders.length === 2) {
  try {
    fs.accessSync(folders[0], fs.constants.R_OK);
    fs.mkdirSync(folders[1]);
    copyToResultDir(folders[0], folders[1]);
    if (isDeleteFolder) {
      removeDir(folders[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
} else {
  console.log('Enter path to folder and path to result folder!');
}
