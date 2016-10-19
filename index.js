var request = require('request');

var token = 'KdOGWvMrRnrK6MKT6K6Fr_SJcZpybTiZ4NQCY-Wl4fwwRMWnHdoUh5S4jGLu-IPgdpr_c-IbeIyjb2ioU4uRMZL4aIRn0lXkUKPjQ9AjNwKgBwbtuOO3C2NhH8Jb7QAWQy0VBjBJPuofGlHWv-7QgDkLA3Ajulzw_4K5ygo5vkOYzX1xZ7rGcmItrSgycA6nVLVaI_8K3_OdfqymFug1Ln7H2kqfVnAdCVpsMaUiFCapxZ_2vF-QbXcfaUELHCuJge432tXxeVSXYFczQXN-opllZXFZXoSd9AYtSgq_k8z1mBpwa8vyuE4kNV5z0gIhWIYS1gYqxcbPk5RBdTtBGFYTTLtw4kfrrL5JHTcHATlVlK4kZ7Ui_K7HfF3uCFSq6ScB3_VOp-8fNA5g6GYM_neVi4iZiI32auVEgl0SL1RpHKHTjgXSlhmDyOgcP84MDYEdivaA9zSFBir8iMdC8Ijc_FjFr5FS5FwMB7AJZtezZYENqOxU2igN8jiFqLtzr0ACUuQz6zDl-LIrpZUQxQYbB_6WB9ozynY_9j5f99Xcrs9ai4V5KyIePHQ5wsTJCIflMh1gXh1IuzTY_ttQiv0KGd53oNW7aHoX78hYh7ASndgTdbIKOLE7DZuq2egf-dEsDK3OwCjaRSB3Xy173yyN6xGqRa2XnIEqT46cYKxKd1lI6ZEoWjwC90XSqYZ-ksppmTPxoYnsZLkMSBOjOpINgLtHr7L5hQE1st_EaQfAWjX6LENM36WFgdyfwFUNxvGht2e4y5YBWEeWXroRQioAjtdI5ABC7gb5cmyBYxMgkM4xbzfl5IMhC2TmFLQOdbEVTPAM9lEDFhNp_h101HPWV75p_JUWB5nnfQTsKJQUrSeIDtd8iX0ousf5KrxxNhcp8PF-gT-vcFWaiqBVbCU9GliMCQPDm_6yGHiHDlYaJgUI1n_4Ku4LWmrywUjy0ttUifaRfsfqKpcp7TvvhzqhBR2izWuT4o5BXHhpBT5p6198S5d4Mw81nLEo04tsybVaSe9FaLAG18GkdM9JW3BYZDz87qsjX4AnlLMECIShtbkdYNtYGKdXgYm5UrN45SzmNRFlmXo3l8a-5YNSmh8RlvLNe9WOXyyVK5t_jbfDMHdKYj7oCuBUO18Z7Nt0K96euvd1I86QRncPofmi79ZStcTRpLu1EzlwvoL5HJ0tW-ieiHRijXBR1VEjggjup_KZhKQGBbAFi3Hg3kzZN-dx0ZIzXxAVJM_a9o35qinbXhCkK7yvFk0qs1jSPuZxaNt5zZ6Yg8d5QP8R5B-nG6JKFPijauBXR5A8iTNpmv1MyHdvA1V7N0Q05i-YQWFuNurLDQQ15tkkx064wKFHu3iHAls3FLZEaYaqvmnIYKN05RpPkxrtW8x_9ESOQUGI5x9NPzAQgs2AEbsKmn7m7W49XZTbqSAiunZkZxENUrSG17wSas0Jlpsv345vgiMNletodgPHHG75ZrZTC3QOupcesRh89Y4hSAgPysyw1kskQvi_Gvg0CFGlQzXut8_49n2P2-udCe5XOeCZ0z7McoWCjCnNWzMn_7vhfCWqVWZ-E_408EaCrRaqyBgY5_Ec';

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
              console.log(data[0]);
            }
          }
        )
      });
    }
    else {
      console.log(response);
    }
  }
);
