// const { expect } = require('chai');
// const FetchResult = require('../../../dist/hive/commands/FetchResult').default;

// const TCLIService_types = {
//     TFetchOrientation: {
//         FETCH_FIRST: 0,
//         FETCH_NEXT: 1,
//     },
//     TFetchResultsReq: function (options) {
//         this.options = options;
//     }
// };
// const response = {
//     operationHandle: {
//         hasResultSet: true
//     }
// };

// describe('FetchResult', () => {
//     it('should be instantinated correctly', () => {
//         const result = new FetchResult(
//             TCLIService_types,
//             {
//                 FetchResults: (request, callback) => {
//                 }
//             },
//             response,
//             100
//         );

//         expect(result instanceof FetchResult).to.be.true;
//     });

//     it('should fetch multiple result correctly', (callback) => {
//         const result = new FetchResult(
//             TCLIService_types,
//             {
//                 FetchResults: (request, callback) => {
//                     callback(null, {
//                         hasMoreRows: false,
//                         data: 1
//                     });
//                 }
//             },
//             response,
//             100
//         );

//         result.execute().then(data => {
//             expect(data).instanceOf(Array);
//             expect(data).to.be.deep.eq([{
//                 hasMoreRows: false,
//                 data: 1
//             }]);
//             callback();
//         });
//     });

//     it('should fetch single result correctly', (callback) => {
//         let data = 1;
//         const result = new FetchResult(
//             TCLIService_types,
//             {
//                 FetchResults: (request, callback) => {
//                     callback(null, {
//                         hasMoreRows: data < 3,
//                         data: data++
//                     });
//                 }
//             },
//             response,
//             100
//         );

//         result.execute().then(data => {
//             expect(data).instanceOf(Array);
//             expect(data).to.be.deep.eq([{
//                 hasMoreRows: true,
//                 data: 1
//             }, {
//                 hasMoreRows: true,
//                 data: 2
//             }, {
//                 hasMoreRows: false,
//                 data: 3
//             }]);
//             callback();
//         });
//     });

//     it('should throw error if fetching faults', (callback) => {
//         const result = new FetchResult(
//             TCLIService_types,
//             {
//                 FetchResults: (request, callback) => {
//                     callback(new Error('test'));
//                 }
//             },
//             response,
//             100
//         );

//         result.execute().catch(error => {
//             expect(error.message).to.be.eq('test');
//             callback();
//         });
//     });
// });
