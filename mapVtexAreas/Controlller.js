function initMap() {
  var arraydata = dataStructure();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12.5,
    center: {
      lat: 20.681845076925256,
      lng: -103.39608907699585
    },
    mapTypeId: "terrain"
  });
  infoWindow = new google.maps.InfoWindow();
  // Try HTML5 geolocation.
  var poligonos = [];
  for (var i = 0; i < arraydata.length; i++) {
    var auxArraydata = arraydata[i][0].data;
    console.log(arraydata[i][0]);
    poligonos[i] = new google.maps.Polygon({
      paths: auxArraydata,
      strokeColor: arraydata[i][0].color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: arraydata[i][0].color,
      fillOpacity: 0.35
    });
  }
  for (let aux in poligonos) {
    console.log(poligonos[aux]);
    poligonos[aux].setMap(map);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        /*var pos = {
        lat:  19.390519 ,
        lng:  -99.4238064
      };*/
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var myLatLng = new google.maps.LatLng({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        infoWindow.setPosition(pos);
        infoWindow.open(map);
        map.setCenter(pos);
        var brange = false;
        var resultPath;
        var resultColor;
        brange= checkCoverage(position.coords.latitude,position.coords.longitude,poligonos);
        if (brange) {
          resultPath = "m 0 -1 l 1 2 -2 0 z";
          resultColor = "blue";
          infoWindow.setContent(
            "Tú ubicación esta cubierta por nuestro servicio"
          );
        } else {
          resultPath = google.maps.SymbolPath.CIRCLE;
          resultColor = "red";
          infoWindow.setContent("Úps! estamos mejorando nuestra cobertura");
        }
        
        new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: {
            path: resultPath,
            fillColor: resultColor,
            fillOpacity: 0.2,
            strokeColor: "white",
            strokeWeight: 0.5,
            scale: 10
          }
        });
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function dataStructure() {
  var str = `[
      {
        "area1":{
          "color":"#DD92D4",
          "data":[
            {
              "lng":-103.38847160339355,
              "lat":20.709555881251763
            },
            {
              "lng":-103.3871841430664,
              "lat":20.679927916296663
            },
            {
              "lng":-103.35937499999999,
              "lat":20.678482501697477
            },
            {
              "lng":-103.35774421691893,
              "lat":20.70080459152051
            },
            {
              "lng":-103.37491035461426,
              "lat":20.71188412094581
            },
            {
              "lng":-103.38847160339355,
              "lat":20.709555881251763
            }
          ]
        }
      },
      {
        "area2":{
          "color":"#8E9FD8",
          "data":[
            {
              "lng":-103.38847160339355,
              "lat":20.70265123599509
            },
            {
              "lng":-103.39662551879883,
              "lat":20.696067444156363
            },
            {
              "lng":-103.39911460876465,
              "lat":20.692373972366624
            },
            {
              "lng":-103.4197998046875,
              "lat":20.687716858013058
            },
            {
              "lng":-103.42160224914551,
              "lat":20.679205210717495
            },
            {
              "lng":-103.39585304260254,
              "lat":20.66635653729943
            },
            {
              "lng":-103.37722778320312,
              "lat":20.666758074799105
            },
            {
              "lng":-103.37739944458008,
              "lat":20.67936581225468
            },
            {
              "lng":-103.38735580444335,
              "lat":20.679847615846686
            },
            {
              "lng":-103.38847160339355,
              "lat":20.70265123599509
            }
          ]
        }
      }

    ]`;
  var arraydata = JSON.parse(str);
  var poligonos = [];
  arraydata.forEach(function(element) {
    var AuxPoligonos = [];
    for (let prop in element) {
      AuxPoligonos.push(element[prop]);
    }
    poligonos.push(AuxPoligonos);
  });
  console.log(poligonos);
  return poligonos;
}

function checkCoverage(PARAM_latitude, PARAM_longitude, PARAM_polygon) {
  var myLatLng = new google.maps.LatLng({
    lat: PARAM_latitude,
    lng: PARAM_longitude
  });
  var brange = false;
  for (let aux in PARAM_polygon) {
    var auxArraydata = PARAM_polygon[aux];
    console.log(myLatLng);
    console.log(auxArraydata);
    if (
      google.maps.geometry.poly.containsLocation(myLatLng, PARAM_polygon[aux])
    ) {
      brange = true;
    }
  }
  return brange;
}

function getCoordinatesFromAddress(PARAM_address) {
var geocoder = new google.maps.Geocoder();
geocoder.geocode({
    "address": PARAM_address
}, function(results) {
  console.log(results[0]);
  console.log(results[0].geometry.location.lat()); //LatLng
  console.log(results[0].geometry.location.lng()); //LatLng
  var Toreturn={
    lat: results[0].geometry.location.lat(),
    lng:results[0].geometry.location.lng()
  }
  console.log(Toreturn)
    return Toreturn;
});
}