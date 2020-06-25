# qewd-jsdb-piscina

Opens access to QEWD-JSdb from a Piscina Worker Thread

Rob Tweed <rtweed@mgateway.com>  
25 June 2020, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: [@rtweed](https://twitter.com/rtweed)

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


# About *qewd-jsdb-piscina*

This module should be used within a Piscina Worker Thread module to:

- open a connection to the YottaDB Database
- create the QEWD-JSdb abstraction of its Global Storage database, giving you access to its 
persistent JavaScript Objects and multi-model database functionality

# Installing *qewd-jsdb-piscina*

        npm install qewd-jsdb-piscina

# Using *qewd-jsdb-piscina*

Within your Piscina Worker Thread module:

        const jsdb = require('qewd-jsdb-piscina');

You'll then have access to the QEWD-JSdb APIs, eg instantiate a Document Node Object 
representing the persistent database document named *Person*

        let person = jsdb.use('Person');
        
You then have access to all of the Document Node Object's properties and methods.

[Further information on QEWD-JSdb can be read here](https://github.com/robtweed/qewd-jsdb).

[Read here for further information on using QEWD-JSdb with Piscina](https://github.com/robtweed/qewd-jsdb/blob/master/PISCINA.md).

Also see the [included example](./examples).

# Closing the QEWD-JSdb Connection

When your Piscina Worker Thread module has completed its processing, you should close the
connection to QEWD-JSdb before allowing the Worker Thread to stop:

        jsdb.close();



