/*
! @Autor: Hiram Gamiz
*Funcion principal para dibujar las areas de cobertura, detecta la ubicación y compara con el area de cobertura
*/
function initMap() {
  var arraydata = dataStructure();
  var map = new google.maps.Map(document.getElementById("map"), {
    //mapa inicial
    zoom: 12.5,
    disableDefaultUI: true, //* Desactiva los contoles de google maps
    center: {
      lat: 20.681845076925256,
      lng: -103.39608907699585
    },
    mapTypeId: "roadmap"
  });
  infoWindow = new google.maps.InfoWindow(); //*se utiliza para la ubicación actual
  setBranch(map);
  // Try HTML5 geolocation.
  var polygons = []; //*arreglo de instacias para dibujar polygons, cada instancia es un poligono diferente
  for (var i = 0; i < arraydata.length; i++) {
    //*arreglo de datos despues del parse
    var auxArraydata = arraydata[i][0].data;
    console.log(arraydata[i][0]);
    polygons[i] = new google.maps.Polygon({
      paths: auxArraydata, //*Coordenadas
      strokeColor: arraydata[i][0].color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: arraydata[i][0].color,
      fillOpacity: 0.35
    });
  }
  for (let aux in polygons) {
    //*recorro el arreglo de instancias y lo dibujo en el mapa
    console.log(polygons[aux]);
    polygons[aux].setMap(map);
  }
  if (navigator.geolocation) {
    //*Si permite la ubicación entra
    navigator.geolocation.getCurrentPosition(
      function(position) {
        /*var pos = {
        lat:  19.390519 ,
        lng:  -99.4238064
      };*/
        var pos = {
          //*para centrar
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var myLatLng = new google.maps.LatLng({
          //*con la que se compara tiene que ser de este tipo ya que tiene que heredar las propiedades de la clase
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        infoWindow.setPosition(pos);
        infoWindow.open(map);
        map.setCenter(pos);
        var brange = false;
        var resultPath;
        var resultColor;
        brange = checkCoverage(
          position.coords.latitude,
          position.coords.longitude,
          polygons
        ); //*Funcion que verifica la coobertura true=cubierto false=no cubierto
        if (brange) {
          //*Figuras y mensaje ademas del color del marcador
          resultPath = "m 0 -1 l 1 2 -2 0 z";
          resultColor = "blue";
          infoWindow.setContent(
            "Tú ubicación esta cubierta por nuestro servicio"
          );
        } else {
          resultPath = google.maps.SymbolPath.CIRCLE;
          resultColor = "red";
          infoWindow.setContent("¡Ups! estamos mejorando nuestra cobertura");
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
/*
? Función que dibuja las sucursales en el mapa
* @param map: instaciá del componente donde se muestra el mapa (new google.maps.Map(document.getElementById("map"))
*/
function setBranch(map) {
  var locationsBranch=dataStructureBranch() // * Extrae el arreglo de surcusales
  for (i = 0; i < locationsBranch.length; i++) {
    if (locationsBranch[i][1] == "undefined") {
      description = "";
    } else {
      description = locationsBranch[i][1];
    }
    if (locationsBranch[i][2] == "undefined") {
      telephone = "";
    } else {
      telephone = locationsBranch[i][2];
    }
    if (locationsBranch[i][3] == "undefined") {
      email = "";
    } else {
      email = locationsBranch[i][3];
    }
    if (locationsBranch[i][4] == "undefined") {
      web = "";
    } else {
      web = locationsBranch[i][4];
    }
    if (locationsBranch[i][7] == "undefined") {
      markericon = "";
    } else {
      markericon = locationsBranch[i][7];
    }
    var marker = new google.maps.Marker({
      icon: markericon,
      position: new google.maps.LatLng(
        locationsBranch[i][5],
        locationsBranch[i][6]
      ),
      map: map,
      title: locationsBranch[i][0],
      desc: description,
      tel: telephone,
      email: email,
      web: web
    });
    link = "";
    bindInfoWindow(
      marker,
      map,
      locationsBranch[i][0],
      description,
      telephone,
      email,
      web,
      link
    );
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
* @param PARAM_address: Dirección escrita de manera simple, ejemplo "Mariano otero 1105"
? Retorna un objeto con las propiedades :: 
* @lat:latitud  
* @lng :Longitud
*/
function getCoordinatesFromAddress(PARAM_address) {
  var Toreturn;
  var param1 = {
    address: PARAM_address
  };
  var param2 = function(results) {
    var perToreturn = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng()
    };
    console.log(perToreturn);
    return perToreturn;
  };
  var geocoder = new google.maps.Geocoder();
  return geocoder.geocode(param1, param2);
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
  geocoder.geocode(
    {
      latLng: latlng
    },
    function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log(results[1].address_components);
          return results[1].address_components;
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    }
  );
}
function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
  var infoWindowVisible = (function() {
    var currentlyVisible = false;
    return function(visible) {
      if (visible !== undefined) {
        currentlyVisible = visible;
      }
      return currentlyVisible;
    };
  })();
  iw = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, "click", function() {
    if (infoWindowVisible()) {
      iw.close();
      infoWindowVisible(false);
    } else {
      var html =
        "<div style='color:#000;background-color:#fff;padding:5px;'><h4>" +
        title +
        "</h4><p>" +
        desc +
        "<p><p>" +
        telephone +
        "<p></div>";
      iw = new google.maps.InfoWindow({ content: html });
      iw.open(map, marker);
      infoWindowVisible(true);
    }
  });
  google.maps.event.addListener(iw, "closeclick", function() {
    infoWindowVisible(false);
  });
}
/*
 * Estructura de datos para los poligonos, puede ser extraida por medio de api, recibe un JSON y retorna un objeto
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
   }
 ]`;
  var arraydata = JSON.parse(str);
  var polygons = [];
  arraydata.forEach(function(element) {
    var Auxpolygons = [];
    for (let prop in element) {
      Auxpolygons.push(element[prop]);
    }
    polygons.push(Auxpolygons);
  });
  console.log(polygons);
  return polygons;
}

/*
* Estructura de datos para las sucursales, puede ser extraida por medio de api, recibe un JSON
*/
function dataStructureBranch() {
var locationsBranch = [
  [
    "Marisa Golfo de Cortés",
    "</br>Golfo de Cortés 4182-2</br>Fracc. Monraz</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3813-4086</br><a href="https://goo.gl/maps/zj6vj4xsVRv" target="_blank">Ver mapa</a>',
    "",
    "undefined",
    20.6816606,
    -103.3957448,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Olímpica",
    "</br>Fernando Méndez Velázquez 1710, Local 3</br>Ciudad Universitaria,</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '<a href="https://goo.gl/maps/pRTobZkYTDN2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6534056,
    -103.3267687,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Acueducto",
    "</br>Av. Acueducto 3901- A</br>Col. Real San Bernardo</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3343-3606</br><a href="https://goo.gl/maps/sMooQVasrbT2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.707227,
    -103.405208,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Ajijic",
    "</br>Blvd. Chapala Jocotepec 57-2</br>Plaza Ajijic</br>Ajijic, Jalisco</br>L-S: 5 a.m. a 9 p.m.</br>D: 9 a.m. a 8 p.m.",
    '+52 (376) 766-2024</br><a href="https://goo.gl/maps/zAwZtLvrRZL2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.299978,
    -103.255761,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Álamo",
    "</br>Niños héroes 709-L5</br>Col. Quintas Álamo Tlaquepaque</br>Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3657-0897</br><a href="https://goo.gl/maps/5WqX7BPHRM52" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.62716797948097,
    -103.3204116527786,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Américas",
    "</br>Av. Américas 538</br>Col. Ladrón de Guevara</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3630-5496</br><a href="https://goo.gl/maps/gNDRYDY2Sok" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.686468,
    -103.37307,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Arcos",
    "</br>Av. de los Arcos 660 L1</br>Col. Jardines del Bosque</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3122-4079</br><a href="https://goo.gl/maps/X6Aojh6DTbv" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6673996,
    -103.3847419,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Avila Camacho",
    "</br>Av. Avila Camacho 2093-A</br>Col. Country Club</br>Guadalajara, Jalisco</br>Cerrada temporalmente por obras del Tren Ligero",
    '+52 (33) 3824-3852</br><a href="https://goo.gl/maps/pDcxgL1qy5G2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.706423,
    -103.366413,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Calzada",
    "</br>Av. Circunvalación 154-1</br>Col. Independencia Oriente</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3637-0893</br><a href="https://goo.gl/maps/8o258XbXD9u" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.696026,
    -103.32826,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Centro",
    "</br>Galeana 144</br>Col. Centro <br />Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3658-1384</br><a href="https://goo.gl/maps/7VJYpkn2qaH2" target="_blank">Ver mapa</a>',
    "",
    "undefined",
    20.674688,
    -103.348753,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Chapalita",
    "</br>Av. Guadalupe 845-A</br>Col. Chapalita</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3121-5023</br><a href="https://goo.gl/maps/mKoApNfhLdw" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.666207,
    -103.400823,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Sucursal Chapultepec",
    "</br>Av. Chapultepec Sur 371</br>Col. Americana</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3825-3780</br><a href="https://goo.gl/maps/B4jyPjQLG572" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.670243,
    -103.368253,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Clouthier",
    "</br>Av. Manuel J. Clouthier 326-A</br>Col. Lomas de Zapopan</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3629-9430</br><a href="https://goo.gl/maps/FhegALS7mh82" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6690208,
    -103.4183832,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Colón",
    "</br>Av. Lopez Mateos</br>Col. Providencia <br /></br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3817-0635</br><a href="https://goo.gl/maps/Y1nxcmZDDQ22" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.695372,
    -103.373754,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Conchitas",
    "</br>Av. Conchita 4629</br>Col. Lomas de la Victoria</br>Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3367-3320</br><a href="https://goo.gl/maps/uLPdebuuPkQ2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.633697,
    -103.399125,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Coral",
    "</br>Coral 3219-A</br>Col. Residencial Victoria</br>Zapopan, Jalisco<br />L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3623-1838</br><a href="https://goo.gl/maps/iDj76JzDAjP2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.642212,
    -103.39935,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Guadalupe",
    "</br>Av. Guadalupe 6180-B</br>Col.Residencial  Plaza Guadalupe</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 1204-4852</br><a href="https://goo.gl/maps/VpPxMPnmk5T2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.658717,
    -103.438177,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa La Cima",
    "</br>Av. Juan Gil Preciado 1600-L5</br>Col. Arcos de Zapopan 3era sección</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3364 0648</br><a href="https://goo.gl/maps/jbdoeXmTEum" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.746648,
    -103.413913,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Manantial",
    "</br>Av. López Mateos 5560 L-15</br>Centro Comercial Manantial</br>Tlajomulco de Zúñiga, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3188-3664</br><a href="https://goo.gl/maps/XSetNFRYLqJ2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.565394,
    -103.460098,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Naciones Unidas",
    "</br>Av. Naciones Unidas 5428-1</br>Col. Vallarta Universidad</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3344-7526</br><a href="https://goo.gl/maps/aaNfdoK9UHt" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.687958,
    -103.426074,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Patria",
    "</br>Av. Patria 2974-C</br><br />Col. El Coli Urbano</br>Zapopan, Jalisco<br />L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3628-3653</br><a href="https://goo.gl/maps/3tetzLVd9j52" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.639561,
    -103.419917,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Providencia",
    "<br />Montevideo 3204-A</br>Col. Providencia <br />Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3642-4971</br><a href="https://goo.gl/maps/VoTPjQGUMv22" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.696569,
    -103.389705,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Revolución",
    "</br>Av. Revolución 2238</br>Col. Lomas del Paradero</br><br />Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3657-2746</br><a href="https://goo.gl/maps/NgNiWnmpdsJ2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.65091,
    -103.310619,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Río Nilo",
    "</br>Av. Patria 34 L-5</br>Col. La Soledad</br> Plaza Surtidora</br>Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3601-5969</br><a href="https://goo.gl/maps/K9Sbftu2Ah62" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.637918,
    -103.284021,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa San Isidro",
    "</br>Prol. Rio Blanco 29-11</br>Col. Rinconada de los Sauces<br />Plaza los Sauces</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3364-8487</br><a href="https://goo.gl/maps/rvobWegRpzx" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.7526,
    -103.383889,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Tepatitlán",
    "</br>Samartín 146</br>Col. Centro</br>Tepatitlán de Morelos, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (378) 781-4692</br><a href="https://goo.gl/maps/kcoaMqMxZdP2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.815705,
    -102.76107,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Tepeyac",
    "</br>Av. Tepeyac 4685</br>Col. Prados Tepeyac</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3123-0732</br><a href="https://goo.gl/maps/54KZ781XNxP2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.65699,
    -103.418512,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Tlaquepaque",
    "</br>Av. Juárez 149</br>Col. Centro</br>San Pedro Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3657-4547</br><a href="https://goo.gl/maps/7s7aqgYBHvS2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.638335,
    -103.312537,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Tránsito",
    "</br>Av. División del Norte 1008</br>Col. Tránsito </br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3280-2056</br><a href="https://goo.gl/maps/AV45bRyEJmD2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.705622,
    -103.347606,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Universidad",
    "</br>Av. Patria 720</br>Col. Jardines Universidad</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3673-0269</br><a href="https://goo.gl/maps/XuAPdiwuCZ62" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6896512,
    -103.4182618,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Vallarta",
    "<br />Av. Vallarta poniente 6039-2</br>Col. Cd Granja</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3627-5788</br><a href="https://goo.gl/maps/MomvmT4k3hK2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.685136,
    -103.442885,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Valle Real",
    "</br>Av. Santa Margarita 4140-7</br>Fracc. Novaterra Plaza Fontana</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3364-3240</br><a href="https://goo.gl/maps/sAiTszZmHX62" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.729728,
    -103.435253,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Adolf Horn",
    "</br>Av. Adolf Horn 3</br>Col. Toluquilla</br>Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3601-0216</br><a href="https://goo.gl/maps/jc7Loo4b4zr" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.572565821462856,
    -103.3644449327881,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Plaza Patria",
    "</br>Centro comercial Plaza Patria L-A6</br>Col. Jacarandas</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3111-0318</br><a href="https://goo.gl/maps/QnwXDTsEcQ62" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.71286100000001,
    -103.37889039046019,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Expo",
    "</br>Av. Diamante 2544 L2</br>Col. Bosques de la Victoria</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3623-0714</br><a href="https://goo.gl/maps/QnwXDTsEcQ62" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.64781492065016,
    -103.39001055977172,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa La Calma",
    "</br>Av. López Mateos 5040-5</br>Col. La Calma</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3631-5741</br><a href="https://goo.gl/maps/cXmQ5B32uBm" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.633831,
    -103.4145,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Technology Park",
    "</br>Carretera a Nogales 4760 L16</br>Guadalajara Technology Park</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3627-8085</br><a href="https://goo.gl/maps/39Wau5WkcFk" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.720909,
    -103.4930177,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Lomas Altas",
    "</br>Paseo Lomas Altas 292-B</br>Lomas del Valle</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3641-9194</br><a href="https://goo.gl/maps/YJaNwW3f4YT2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.687096,
    -103.4129297,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa 8 de julio",
    "</br>Prolongación 8 de julio #2067</br>San Sebastianito</br>San Pedro Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '<a href="https://goo.gl/maps/VFzwg6uR4SB2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.5853453,
    -103.386061,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Tepatitlán La Gloria",
    "</br>Av. Circuito Interior SS Juan Pablo II 325</br>Col. La Gloria</br>Tepatitlán de Morelos, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (378) 701-4428</br><a href="https://goo.gl/maps/nkSQiV21xmy" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.8092676,
    -102.7792358,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Independencia",
    "</br>Calzada Independencia Norte</br>Col. Lomas de Independencia</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 2464-2353</br><a href="https://goo.gl/maps/HX6JfxjXo4N2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.712731,
    -103.321785,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Salida Real  Colima",
    "</br>Prolongación Cristóbal Colón #6034</br>Col. Santa María Tequepexpan,</br>Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '<a href="https://goo.gl/maps/ucENitkyT2E2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6003749,
    -103.4041877,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Juan Pablo II",
    "</br>Calzada Juan Pablo II 3205-6</br>Barranca de la Hacienda de Oblatos</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3652-0220</br><a href="https://goo.gl/maps/Wp5PAArj7iE2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.7030697,
    -103.2855466,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Oblatos",
    "</br>Av. Circunvalación 2353</br>Oblatos</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3643-0219</br><a href="https://goo.gl/maps/14nsJ4jpLbJ2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6893974,
    -103.2971863,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Tonalá",
    "</br>Plaza la Reina locas 12A</br>Av Tonaltecas 375</br>Tonalá, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 1516-1045</br><a href="https://goo.gl/maps/nWghXJF8Jdp" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6325378,
    -103.2440377,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Aviación",
    "</br>Av. Aviación 2197 3</br>San Juan de Ocotán</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 33 1371 3654</br><a href="https://goo.gl/maps/vkySbnu4okx" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.72334,
    -103.45405,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Las Rosas",
    "</br>Plaza One Expo</br>Av. López Mateos 1917 L1</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3121-0236</br><a href="https://goo.gl/maps/prJrpsrBA2R2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.65888,
    -103.39739,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Lázaro Cárdenas",
    "</br>Calzada Lázaro Cárdenas 2385- 4</br>Las Torres</br>Guadalajara, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3671 4993</br><a href="https://goo.gl/maps/jw9nXjmcnfm" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.65655,
    -103.3792,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Bugambilias",
    "</br>Blvd. Bugambilias 2299</br>Bugambilias</br>Zapopan, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 3188 4131</br><a href="https://goo.gl/maps/oX11tRG7eYM2" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.6005919,
    -103.4502375,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Aeropuerto",
    "</br>Carretera Guadalajara Chapala km 17.5</br>Aeropuerto</br>Tlajomulco, Jalisco</br>-</br>-",
    '-</br><a href="https://goo.gl/maps/SshkdCmBe262" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.5244891,
    -103.301354,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Santa Anita",
    "</br>Av. Ramón Corona #750 local 8</br>Santa Anita</br>Tlaquepaque, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (33) 1652 8084</br><a href="https://goo.gl/maps/dDwxaU6pdx12" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.5581564,
    -103.4613459,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Ocotlán",
    "</br>Av. Universidad 410 L8</br>Santa Cecilia</br>Ocotlán, Jalisco</br>L-S: 9 a.m. a 9 p.m.</br>D: 11 a.m. a 7 p.m.",
    '+52 (39) 2688 0569</br><a href="https://goo.gl/maps/AZzck1EDUwBYbtbX6" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.3536944,
    -102.7802214,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ],
  [
    "Marisa Andares",
    "</br>Plaza Andares</br>Blvrd. Puerta de Hierro</br>Local UP79-FC02</br>Zapopan, Jalisco</br>L-D: 11 a.m. a 9 p.m.",
    '-</br><a href="https://goo.gl/maps/vA4JDHut7GdDX8zW6" target="_blank">Ver mapa</a>',
    "undefined",
    "undefined",
    20.708389,
    -103.4112944,
    "https://www.pasteleriasmarisa.com/varios/images/marcador-marisa.png"
  ]
];
return locationsBranch}

$(window).on("load", function() {
  $("#myModal").modal("show");
  // Trigger map resize event after modal shown
  $("#myModal").on("shown", function() {
    google.maps.event.trigger(map, "resize");
  });
});
