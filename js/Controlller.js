/*
! @Autor: Hiram Gamiz
*Funcion principal para dibujar las areas de cobertura, detecta la ubicación y compara con el area de cobertura
*/
function initMap() {
  var arraydata = dataStructure();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12.5, disableDefaultUI: true,
    center: {
      lat: 20.681845076925256,
      lng: -103.39608907699585
    },
    mapTypeId: "terrain"
  });
  infoWindow = new google.maps.InfoWindow();//*se utiliza para la ubicación actual
  // Try HTML5 geolocation.
  var polygons = [];//*arreglo de instacias para dibujar polygons, cada instancia es un poligono diferente
  for (var i = 0; i < arraydata.length; i++) {//*arreglo de datos despues del parse
    var auxArraydata = arraydata[i][0].data;
    console.log(arraydata[i][0]);
    polygons[i] = new google.maps.Polygon({
      paths: auxArraydata,//*Coordenadas
      strokeColor: arraydata[i][0].color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: arraydata[i][0].color,
      fillOpacity: 0.35
    });
  }
  for (let aux in polygons) {//*recorro el arreglo de instancias y lo dibujo en el mapa
    console.log(polygons[aux]);
    polygons[aux].setMap(map);
  }
  if (navigator.geolocation) {//*Si permite la ubicación entra
    navigator.geolocation.getCurrentPosition(
      function (position) {
        /*var pos = {
        lat:  19.390519 ,
        lng:  -99.4238064
      };*/
        var pos = {//*para centrar
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var myLatLng = new google.maps.LatLng({//*con la que se compara tiene queser de este tipo ya que tiene que heredar las propiedades de la clase
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        infoWindow.setPosition(pos);
        infoWindow.open(map);
        map.setCenter(pos);
        var brange = false;
        var resultPath;
        var resultColor;
        brange = checkCoverage(position.coords.latitude, position.coords.longitude, polygons);//*Funcion que verifica la coobertura true=cubierto false=no cubierto
        if (brange) {//*Figuras y mensaje ademas del color del marcador
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
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

/*
* @param PARAM_polygon: arreglo de polygons(los que se envian al mapa para dibujarse)
?Funcion que verifica la coobertura true=cubierto false=no cubierto
?Recibe coordenadas en formato numerico
*/
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
/*
* @PARAM_address: Dirección escrita de manera simple, ejemplo "Mariano otero 1105"
? Retorna un objeto con las propiedades :: 
* @lat:latitud  
* @lng :Longitud
*/
function getCoordinatesFromAddress(PARAM_address) {
  var Toreturn
  var param1 = {
    "address": PARAM_address
  }
  var param2 = function (results) {
    var perToreturn = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng()
    }
    console.log(perToreturn)
    return perToreturn;
  }
  var geocoder = new google.maps.Geocoder();
  return  geocoder.geocode(param1, param2);;
}
/*
* @param lat:latitud  
* @param @lng :Longitud
?Recibe dos latitud y longitud, retorna un arreglo estructurado de la dirección si se encontro una
*
*/
function getAddressFromCoordinates(lat, lng) {
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    'latLng': latlng
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {

        console.log(results[1].address_components);
        return results[1].address_components
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}
/*
* Estructura de datos, puede ser extraida por medio de api, recibe un JSON y retorna un objeto
*/
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
   },
   {
    "area3":{
       "color":"#0008FF",
       "data":[
          {
             "lng":-103.40194702148438,
             "lat":20.621859611844727
          },
          {
             "lng":-103.30839157104492,
             "lat":20.608845416450194
          },
          {
             "lng":-103.38220596313477,
             "lat": 20.694943353567634
          }
       ]
    }
 }
 ]`;
  var arraydata = JSON.parse(str);
  var polygons = [];
  arraydata.forEach(function (element) {
    var Auxpolygons = [];
    for (let prop in element) {
      Auxpolygons.push(element[prop]);
    }
    polygons.push(Auxpolygons);
  });
  console.log(polygons);
  return polygons;
}




$(window).on('load', function () {
  $('#myModal').modal('show');
  // Trigger map resize event after modal shown
  $('#myModal').on('shown', function () {
    google.maps.event.trigger(map, "resize");

  });
});