function initMap() {
  var arraydata = dataStructure()
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12.5,
    center: {
      lat: 20.681845076925256,
      lng: -103.39608907699585
    },
    mapTypeId: 'terrain'
  });
  var poligonos = [];
  for (var i = 0; i < arraydata.length; i++) {
    var auxArraydata = arraydata[i][0].data
    console.log(arraydata[i][0])
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
    console.log(poligonos[aux])
    poligonos[aux].setMap(map);
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
  arraydata.forEach(function (element) {
    var AuxPoligonos = [];
    for (let prop in element) {
      AuxPoligonos.push(element[prop]);
    }
    poligonos.push(AuxPoligonos);

  });
  console.log(poligonos);
  return poligonos
}
