var request = require('request');
var elasticsearch = require('elasticsearch');

var token = 'rujhU_ZeTFgC8nnrGS3fJQ9SnmbmNRSDKd6WrSLdKljb6HMd_4hBeRGItvC68NDfyuPvSmOILBeGSJtDrMdr27ZnSTnDBOKFSsR9xftz5RMr_DOH6ZBEXa5Xm61LXGGx01T2rXTIZSOc2_hMMMAwJ1JMbF_yJjHqdCsQ4dAiLHj6rhOBwhtpE4gh3-3MZ9udnWu9eHXzvn59vX015hqsymqCfez3tdBueLUz5O9FRB-STGWQrlHQhq7naXLth9DZvbjvtkPV4Wv-KRoRyI1WQwWXBNeOUxYK7loght_zrMra3DWwzJlLe3aAnrcHzq0cFHpyWfWdmPZUmMWq6RLZc1alPVm1O3khISOxq6Xswdb2tbvKcG-eZ3Y20b53NltZcJd-GwkeIcL11j8IAYpk2CHXdESFlXlAqwLeQnZyVuhU-B2108RcnCwAAb4xnJKhY_Io13EbQ1bwTbwdy4AoujEIHBHjMKuEJQbf4GCfy3U_AqABXZ1ouA0r4D-a-FUA4mmuHCVvaSX5Z7ZAQcft7ENrY8bU1jjqQLe2WXjiD9DxLae9dUtsagBH2aCfGK9cBW6qe_6Kw7C_3X7Hex4m0BGf8HpU7Ttw1I7u6IAo0aIJiRo-CwzOeOMstyLKLLapNsi0WZvfEZq2qCmgfXDUlKiSX0mwEcGXCBNfQXR5AG__df4eHHtGQp6vBHkB9oRnEQiJESoUxuXbW3gSdRBZPEGIU0iCKSfYuW1nCJzkIFXoPKP6AVU_ArrOGibMvRkTOgOz9aGBVBON2JpjmgWReKziKwgR5ni5lvYJTX7l4n6n38sX7UWGPxARTgyhQgHIPFp7j-QZlYLFm55QmGzR03l84Au8zkgMPtlNOq1Jq3jMva9FrlHeD5ARaoiGyfx3V1ui3213xp8xYnYqaWgt7udJ4jVNkSzlNI4BH2dYscYLxxtlJ9wpCL1januKJtXVyN7bJVM8vX5ZGYZfuE3CXjFxWwmviuPRg6f8kMDMEPXGIsW1xBS5hVmiUciY7C7F2eYTwLhaH4rOHgdNLjOcG-9pK1PDJIlHKh1t8Icv2ewuLfTRi8awnx-Ne0A2318tVWvGI21me-FmYUXjpSvBgWIy5u6Uhq7sba_BJHxjaFWssEHiYx3hubBjMgLUC_1ZP4i-Vk4soDzn32yBpaDtbfwnw3S7WiBkIk0b4s998pFMH_XFqPW2-OPafM8z3PLpOoAecEZDNN-qt0aKSmBlAI3DEw-ZiTmpyLarTuw8lUfNFgprZe_CGdiOnV_PbvJifx8sM9PPuIz5f9kJSpctjY_JvuIAw7sMpD4z1asMRNZ6maQdfYsNGb6s1L_sRv6P8e2k5jjGM5RQuCtQQI8JqBeA0pDvPhKgDMjLoH9FhkMgGqjTUppSlmHLdUWqigBYwwuqSaiHu425XiG3A0NawdCGP1BcJTMqtUBlbiVAxMANpkqNb73DSizXzExbK3j_tc6p4xGqyPr7gHhprBcr1Oa5RMRlY00p3eLqiurNZ8eceM16XqZ6v1S3ip7JjhNjfLCZxfXO9rPjRkRRAqUoXGHcIewVWgQOylr9JpYvdRiuBA5ElEYs1vFRE5Za9sjL';

var client = new elasticsearch.Client();
client.indices.exists(
  {
    index: 'vision'
  },
  function (error, response, status) {
    if (error) {
      throw new Error();
    }

    if (!response) {
      client.indices.create(
        {
          index: 'vision',
          body: {
            mappings: {
              trip: {
                properties: {
                  data: {
                    properties: {
                      m12: {
                        type: 'double'
                      },
                      m13: {
                        type: 'double'
                      },
                      x: {
                        type: 'double'
                      },
                      y: {
                        type: 'double'
                      },
                      z: {
                        type: 'double'
                      },
                      l: {
                        type: 'double'
                      },
                      n: {
                        type: 'double'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        function (error) {
          if (error) {
            throw new Error();
          }

          migrate();
        }
      );
    }
    else {
      migrate();
    }
  }
);

function migrate() {
  request.get(
    {
      url: 'http://localhost:65027/api/Trips/GetTrips?VehicleId=105342&SelectedDate=2016-05-20',
      auth: {
        bearer: token
      }
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
        return;
      }

      if (response.statusCode == 200) {
        var data = JSON.parse(body);
        data.forEach(function (element) {
          console.log(element.trip.tripId);
          request.get(
            {
              url: 'http://localhost:65027/api/Trips/GetTripJsonData?TripId=' + element.trip.tripId,
              auth: {
                bearer: token
              }
            },
            function (error, response, body) {
              if (error) {
                console.log(error);
                return;
              }

              if (response.statusCode == 200) {
                var data = JSON.parse(body);
                var body = Object.assign({}, element.trip, { data: data });
                console.log(body);
                // client.index(
                //   {
                //     index: 'vision',
                //     type: 'trip',
                //     body: body
                //   },
                //   function (error, response) {
                //     if (error) {
                //       console.error(error.response);
                //       throw new Error();
                //     }
                //
                //     console.log(response);
                //   }
                // );
              }
            }
          );
        });
      }
      else {
        console.log(response);
      }
    }
  );
}
