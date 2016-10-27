var request = require('request');
var elasticsearch = require('elasticsearch');

var token = '8nOtwI7LKKMk-WYdOnDZylrVQNiBc2-BJGUk0NoTwPlWqhXVA2Z0pyNctYZikcnP_CEZIXMGCgjXDqUABInxYkSbwuKg3D7fzcx3pBVJTaMq6lnxD1zQPBx-z6YLM0La_wuxnt9Ggzhm-GvkXhiR1wUZuVbTmw7Z7-UI9RI8nxftPRML55nDWhSjFt-mnmSb2WC9r5h5Dbj1tjqVFIXrVE4hc9CvxsoHSmA62fjHwnMrvU7HaBWk2sKIoykzT0hGfizUPiwOjZANoFLgxJ8GN_QVmgAjZRE903Ai5pTUUTzDb009wf-A4qlFhYWCEi9_9xULH2FBIEAlSY6j61I_IdftU0ZE_f4uHxuhXJc4m-9rEuNtSLjv4Hl0q5jIvhLFf-WZAJJFzd01W4_R3h5hxyt4pWbNt8FtowFjuM3QiW2MkXr2pQMvZPPxC1dn4xHyQ32T4uy2SPwrZRDGuFtUj1ttw46uX6tQc87EbkR1sPaTCdOVYoS5MAeYX9v1WfZSP1wME25f6Qoz4AOVoAVN16Q34CttsBxiO6u3NTce88xXNbZEW-7rD9t7QebRbWONatAQioAN0sTzu-KMVmwl9lMv2WgUsGkgQLvmzI9-YzjOXYZzzr_Iwrrb3SNsDuxcsEYbtzKWYlm2zYSy4TV38jVx6RPYJUvAAZzkzPMSdErS0_AAj2l96hGg-ibC2Uqs5q9YrqBdLDilxsOEjHmKduaQr6o-L7B4i1DftPrLQABoxZ9nzH0GygzchrYXi8KfMyorvLofQGql4sT7OR9s7su4RMY4wSanuejUhho2Zl_pwFstoBWT5lXf2Hco_c2XIU9QFWXF2qD_U38K1m36FHaQyED_n9l1fIkcOHni6-DiTHCZiuGkP0K1c_wcP7SOypnlzXG9opsB1un_13HeO52xILj1gs4OBAWVk6-cMhO73kBXV-J_4We3wrjERd7wdAMY-my7_OF52h8-iwKAZo_ARX_yi6GGC6gp2PaH2A3AKGlKuj1vz1i9rHfnqUX74bVCt4xJZG5kWVdsv8oSeLcnptRoOqWScZFNIykgpLgsSXVGIJ172Hg9PmrJflPh1SDOiLzjUZs5SDTqMjInnj5_dGpVMONaz0m5qXt8HPc_Xx4E_X5JZW3oHwCJaOg3oKkQAHq3viyDzhb_8Ek182jbE2kpK8Uz7DIxwDAA7oV1XVwQuH_Uyg6OjO-TbBDbEIRhgUa9HDosc1GfP4apCwVnFLYgclcLGAIunRKdC9JPUhTb_Sie5CTxEj30ZLYQsF0JiwgROzlQnPAA7sRF-l5Jk6BvHR1l5XmisHKNRRfT_voBcyRzbiY2EXo0gYynTq8xurXqRXk2wi5u_LQMWGlw5Le7NcgBCvDxl1Ht5S_MW3z50AJI3vuBUamDPc6FlTGSNfo23li5V2RwPLYHhIDlFvw_rEras808QdEfRPUW0QYxhUBSx1QbnVP2BB0RmCI2kRcthMqKEb-rTs8EgvNEUG__yogmZQ6NGgGI4PnZsjMajP9k0UfSd1T8GJzGPaGCzMdEjCa5G3I3Te2oZECBvNrIAVQHRyZAyo4cgYhogvBpKHIyU9Wu7qDmZxuy';

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
  var vehicleId = '105342';
  var date = '2016-05-20';

  request.get(
    {
      url: 'http://localhost:65027/api/Trips/GetTrips?VehicleId=' + vehicleId + '&SelectedDate=' + date,
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
        var trips = JSON.parse(body);
        trips.forEach(function (trip) {
          console.log(trip.trip.tripId);
          request.get(
            {
              url: 'http://localhost:65027/api/Trips/GetTripJsonData?TripId=' + trip.trip.tripId,
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
                  var body = Object.assign(
                    {
                      tripId: trip.trip.tripId.toString(),
                      vehicleId: vehicleId,
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
                      if (error) {
                        console.error(error.response);
                        throw new Error();
                      }

                      console.log(response);
                    }
                  );
                });
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
