const fs = require('fs');
const path = require('path');
var argv = require('minimist')(process.argv.slice(2));

const folders = argv['_'];
const isDeleteFolder = argv.d;

const checkFolderExist = (folder) => {
  return new Promise((resolve, reject) => {
    fs.access(folder, fs.constants.R_OK, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const createFolder = (folder) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(folder, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const copyToResultDir = (base, res) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(base);

    const promiseArray = files.map(item => {
      let localBase = path.join(base, item);
      let state = fs.statSync(localBase);
      if (state.isDirectory()) {
        return copyToResultDir(localBase, res);
      } else {
        const firstLetter = item.charAt(0);
        const extname = path.extname(item);
        const dest = path.join(res, firstLetter, extname, item);
        return checkFolderExist(path.join(res, firstLetter))
          .then((is) => {
            if (!is) {
              return createFolder(path.join(res, firstLetter));
            }
          })
          .then(() => checkFolderExist(path.join(res, firstLetter, extname)))
          .then((is) => {
            if (!is) {
              return createFolder(path.join(res, firstLetter, extname));
            }
          })
          .then(() => {
            fs.copyFileSync(localBase, dest);
          });
      }
    });

    Promise.all(promiseArray).then(resolve);
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

const mainFunction = async (folders) => {
  try {
    const isFolderExist = await checkFolderExist(folders[0]);
    const isFolderCreated = await createFolder(folders[1]);
    console.log('isFolderExist ', isFolderExist, 'isFolderCreated ', isFolderCreated);
    if (isFolderExist && isFolderCreated) {
      await copyToResultDir(folders[0], folders[1]);
      if (isDeleteFolder) {
        removeDir(folders[0]);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

if (folders.length === 2) {
  mainFunction(folders);
} else {
  console.log('Enter path to folder and path to result folder!');
}
