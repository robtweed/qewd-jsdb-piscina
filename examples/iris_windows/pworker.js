const qjp = require('qewd-jsdb-piscina');
const jsdb = qjp({
  database: {
    "type": "IRIS",
    "path": "C:\\InterSystems\\IRIS\\Mgr",
    "username": "_SYSTEM",
    "password": "SYS",
    "namespace": "USER"
  }
});

module.exports = ({ documentName }) => {

  // list the persistent Document directory in the JSdb database

  console.log(jsdb.db.global_directory());

  // We'll explore the specified document

  let doc = jsdb.use(documentName);

  // populate it if no data yet

  if (!doc.exists) {

    let data = {
      by_id: {
        1: {
          city: 'Redhill',
          gender: 'm',
          name: 'Rob'
        },
        2: {
          city: 'St Albans',
          gender: 'm',
          name: 'Simon'
        },
        3: {
          city: 'Carshalton',
          gender: 'f',
          name: 'Helen'
        }
      },
      id_counter: 3
    };

    doc.setDocument(data);
  }

  doc.$('viewed').value = new Date().toUTCString();;

  doc.forEachLeafNode(function(value, node) {
     console.log(node.path + ': ' + value);
  });


  doc.forEachChild(function(ix, node) {
    console.log('ix = ' + ix);
    node.forEachChild(function(ix2, node2) {
      console.log('  ix2: ' + ix2);
      node2.forEachChild(function(ix3, node3) {
        console.log('    ix3: ' + ix3 + ': ' + node3.value);
      });
    });
  });

  jsdb.close();

  return 'worker completed';
};
