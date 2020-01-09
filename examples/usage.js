const TCLIService = require('../thrift/gen-nodejs/TCLIService');
const TCLIService_types = require('../thrift/gen-nodejs/TCLIService_types');
const HiveClient = require('../index').HiveClient;
const mech = require('../index').mechanisms;
const ResponseCombiner = require('../index').ResponseCombiner;

const connection = new mech.NoSaslTcpConnection();

const client = new HiveClient(
    TCLIService,
    TCLIService_types
);
