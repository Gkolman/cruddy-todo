const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId( (error, id) => {
    if (error) {
      console.log('error -> ', error);
    }
    console.log('id -> ', id);

    items[id] = text;
    callback(null, { id, text });

    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (error) {
        console.log('error =>', error);
      } else {
        console.log('success writing ', text, ' to file');
      }
    });
  });

};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   console.log('items - > ', items);
  //   return { id, text };
  // });
  var data = [];
  fs.readdir( exports.dataDir, (err, files) => {
    if (err) {
      console.log('error -> ', error);
    } else {
      files.forEach(file => {
        console.log('file -> ', file, 'typeof file', typeof file);
        data.push({ id: file.slice(0, file.length - 4), text: file.slice(0, file.length - 4)});
      });
      callback(null, data);
    }
  } );

};

exports.readOne = (id, callback) => {

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile(path.join(exports.dataDir, id + '.txt' ), (err, fileData) => {
    if (err) {
      console.log('error ->', error);
    } else {
      console.log('success reading ', fileData.toString(), ' from file ', id, '.txt ');
      callback(null, {id, text: fileData.toString()});
    }
  });

};

exports.update = (id, text, callback) => {

  fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {

    if (err) {
      console.log('error - > ', err);
    }

    callback(null, {id, text});


  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      console.log('error -> ', err);
    }
    callback();

  } );
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
