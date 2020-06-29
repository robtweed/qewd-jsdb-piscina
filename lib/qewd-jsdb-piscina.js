/*

 -----------------------------------------------------------------------------
 | qewd-jsdb-piscina: Opens access to QEWD-JSdb from a Piscina Worker Thread |
 |                                                                           |
 | Copyright (c) 2020 M/Gateway Developments Ltd,                            |
 | Reigate, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | http://www.mgateway.com                                                   |
 | Email: rtweed@mgateway.com                                                |
 |                                                                           |
 |                                                                           |
 | Licensed under the Apache License, Version 2.0 (the "License");           |
 | you may not use this file except in compliance with the License.          |
 | You may obtain a copy of the License at                                   |
 |                                                                           |
 |     http://www.apache.org/licenses/LICENSE-2.0                            |
 |                                                                           |
 | Unless required by applicable law or agreed to in writing, software       |
 | distributed under the License is distributed on an "AS IS" BASIS,         |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  |
 | See the License for the specific language governing permissions and       |
 |  limitations under the License.                                           |
 -----------------------------------------------------------------------------

  29 June 2020

*/

const http = require('http');
const qewd_mg_dbx = require('qewd-mg-dbx');
const DocumentStore = require('ewd-document-store');
const os = require('os');

function jsdb(args) {

  args = args || {};
  let params;
  if (args.database) {
    params = {
      database: args.database
    };
    args.database.multithreaded = true;
  }
  else {
    let ydb_release = args.ydb_release || 'r1.28';
    let arch = os.arch();
    if (arch === 'x64') arch = 'x86';
  
    params = {
      database: {
        type: 'YottaDB',
        release: ydb_release,
        architecture: arch,
        multithreaded: true
      }
    };
  }
  let db = new qewd_mg_dbx(params);
  let status = db.open();
  if (status.error) return status;
  let documentStore = new DocumentStore(db);
  documentStore.close = db.close.bind(db);

  let displayInViewer = function(glo) {
    let viewer_refresh_url = 'http://localhost:8080/jsdb/viewer/refresh?global=' + glo.documentName;
    let req = http.get(viewer_refresh_url, function(response) {
      if (response.status !== 200) {
        console.log('Unable to update viewer');
      }
    });

    req.on('error', function(error) {
      console.log('Unable to update viewer');
    });

    req.end();

  };

  let viewerEnabled = false;

  documentStore.viewer = {
    enable: function() {
      if (!viewerEnabled) {
        documentStore.on('afterSet', displayInViewer);
        documentStore.on('afterDelete', displayInViewer);
        viewerEnabled = true;
      }
    },
    disable: function() {
      if (viewerEnabled)
      documentStore.removeListener('afterSet', displayInViewer);
      documentStore.removeListener('afterDelete', displayInViewer);
      viewerEnabled = false;
    },
    display: displayInViewer
  };

  return documentStore;

};

module.exports = jsdb;
