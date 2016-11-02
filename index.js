var request = require('request');
var elasticsearch = require('elasticsearch');

var token = '7RnXXNLgkix3uZWkOoe48T0t_Jz5tECahcIsSHB_dK1ZoXauQEsSdQ_qvgLKu2osJRavy3QIz7t3J9p1OGJ4BMpGDmEGNeHZVwmbfK6pcfqru40uxBDATAhy_J5LF2vJ0l1Ugx_53_wYcKv1Uiz9ldiPjMtgA7C7oso81P9yHX4oepgy9bqHsCyBJYn2_lmF-IkZJCZeFJ3lWvSrYKJSACcu7OpwYd_jIZFptiRuTmnscFNMWvXOYuvUWFD9kq4EW9I1VTVi29rlNianLQHL5v63OK7pf0qqHVKSsOHX9raXql2aZg2ygHGhfGq4YJlQa3ffxZZrfd9ygiD3Y0W1PrL4gEASF8LHFjiJUsW83E4Erx23asLnBweZlR--Qo3NnWLgqNi5_V_fkQ2kYcLkqECjHcmyO-Aml-CrCSj3jNbmTQoAUQxboCbLYLnk2NEEPIUJnwE89Uf81YH7nsjkUopLYk78BpCw3wX1G8OAFXp6doP7oUoEScwBgvZ2XCQu2JHtLZSyK8fAIlp_BW8NfPCPeUPVZVrsNSvmaMT-wzoLlD4LxeO4JotVs9XUFVyooOceu-WMK9Oomx7fVmAJW7ux5gzazv-TJRn97Ya0eUQemgvFTt39GIUXaGNN-t6XhV8VgqTwZHX9Mj2O29KdbyUZfA0V3JJJugDNDsmvzHMsEw_dlXP1V-d-CEbjJu5VUST6-aDmwSsbygUDrJPw2g_ejD7Po917-0n6xniT8KI8YN5cQuWMZmSgolRC66doY6HEczWBps9g9neSu089_aXm_9VibMoRDgVTuNwwByDjClFZgtF52JSZAFKkSNG46UWWXdJZ4wY5fUxUlkiK4q-iWK92decsJrSChK7YrLc4zBRXL3iyLlP-unWmqhX8r9-7ceBO8-iiL-NPej61zvH0XFy84EbVnbPGfZpC4d0Sh1Q0uirKfFu-m4VulVr9ds5sHk6mF4dOIJ2ArfyBPAX28frJYADLgf4RVAxLRdrz2ep97vm2Ky3viKdmvHkBCW_z6ZQ_Od5JccJGAmeS3zK5MyNJTUbKiCXJyw5lMmy5bjXpUlUGcSeltAwglO4u4rkGNLK0gD3VpukwKkDfKYZDPdq96QMrirPrcAXTtpFr1jycWUMNeHlEA1nd14PPlLd8M8vANcEhZPTxjaILWyH1USBByeaE8OjGozKASaQXHqZE-iQyTwHrz0_P28X3NxML3mQXio6MeCdUOfW2CkXVI2hnKVnU-k99uGbvi-GkNGXkmgB0W6lGcPqRhOpYJgPFLODHtNRuxrTsNkmun58w1e82P3lmBad7YapUK-fYnnHhD08VmnjsOUH73qtMFeIQfuDTg-HrYYfAE9gQ2fUYhuSwvlv9_X2-SjZ4XuPJKymnsf_wyPac-i9kQlfo0tvgwH8dyMSUhZeVvIdgig82mjGgAgSHDC-1_tUI5JCmdTwlagy71RrI8VEpy-k9WGM_m3eX82uyBxytQaMvCKQAN2aNQwvFGAzlCGlUTvEk1eh99c1hVetqiz04N5GNczHQ_tjWgcK69YzvRMzMm0i5wJ2LjUVFU9wioMuASYvt5uBizvtP5PBimBvLOnQm';

var client = new elasticsearch.Client({
  host: 'https://lo0l35z0:6mnvwo0j46ih3gym@fig-7632293.us-east-1.bonsaisearch.net'
});

client.indices.exists(
  {
    index: 'vision'
  },
  function (error, response, status) {
    if (error) throw error;

    if (!response) {
      client.indices.create(
        {
          index: 'vision',
          body: {
            mappings: {
              message: {
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
        },
        function (error) {
          if (error) throw error;

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
  var vehicleId1 = '105342';
  var vehicleId2 = '581a365f5d5f735698a021bf';
  var date = '2016-05-20';

  request.get(
    {
      url: 'http://visiontest.danlawinc.com/api/Trips/GetTrips?VehicleId=' + vehicleId1 + '&SelectedDate=' + date,
      auth: {
        bearer: token
      }
    },
    function (error, response, body) {
      if (error) throw error;

      if (response.statusCode != 200) {
        console.log(response);
        return;
      }

      var trips = JSON.parse(body);

      function processTrip(trips, i) {
        if (i == trips.length) {
          console.log('done', vehicleId1, date);
          return;
        }

        var trip = trips[i];

        console.log(trip.trip.tripId);
        request.get(
          {
            url: 'http://visiontest.danlawinc.com/api/Trips/GetTripJsonData?TripId=' + trip.trip.tripId,
            auth: {
              bearer: token
            }
          },
          function (error, response, body) {
            if (error) throw error;

            if (response.statusCode == 200) {
              var data = JSON.parse(body);

              function processElement(data, j) {
                if (j == data.length) {
                  console.log('done', trip.trip.tripId);
                  processTrip(trips, i + 1);
                  return;
                }

                var element = data[j];

                var body = Object.assign(
                  {
                    tripId: trip.trip.tripId.toString(),
                    vehicleId: vehicleId2,
                    tripNumber: trip.trip.tripNumber.toString()
                  },
                  element
                );
                // console.log(body);
                client.index(
                  {
                    index: 'vision',
                    type: 'message',
                    body: body
                  },
                  function (error, response) {
                    if (error) throw error;

                    console.log(j);

                    processElement(data, j + 1);
                  }
                );
              }

              processElement(data, 0);
            }
          }
        );
      }

      processTrip(trips, 0);
    }
  );
}
