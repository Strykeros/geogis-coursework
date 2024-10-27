let map;

const icons = {
  "Vehicle ran into an obstacle": L.IconMaterial.icon({
    icon: "warning",
    iconColor: 'black',
    markerColor: 'rgba(255,69,0,1)',
    outlineColor: 'rgba(255,69,0,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Vehicle ran over a cyclist": L.IconMaterial.icon({
    icon: "directions_bike",
    iconColor: 'black',
    markerColor: 'rgba(0,128,255,1)',
    outlineColor: 'rgba(0,128,255,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Collision": L.IconMaterial.icon({
    icon: "car_crash",
    iconColor: 'black',
    markerColor: 'rgba(255,0,0,1)',
    outlineColor: 'rgba(255,0,0,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Other accidents": L.IconMaterial.icon({
    icon: "report",
    iconColor: 'white',
    markerColor: 'rgba(128,128,128,1)',
    outlineColor: 'rgba(128,128,128,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Vehicle ran into a parked vehicle": L.IconMaterial.icon({
    icon: "local_parking",
    iconColor: 'white',
    markerColor: 'rgba(127,0,255,1)',
    outlineColor: 'rgba(127,0,255,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Vehicle ran over a pedestrian": L.IconMaterial.icon({
    icon: "directions_walk",
    iconColor: 'black',
    markerColor: 'rgba(50,205,50,1)',
    outlineColor: 'rgba(50,205,50,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Vehicle flipped over": L.IconMaterial.icon({
    icon: "minor_crash",
    iconColor: 'black',
    markerColor: 'rgba(255,140,0,1)',
    outlineColor: 'rgba(255,140,0,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
  "Vehicle ran over an animal": L.IconMaterial.icon({
    icon: "pets",
    iconColor: 'white',
    markerColor: 'rgba(160,82,45,1)',
    outlineColor: 'rgba(160,82,45,1)',
    outlineWidth: 1,
    iconSize: [45, 51],
    iconAnchor: [22, 51],
    popupAnchor: [0, -50]
  }),
};


const initMap = () => {
  map = L.map("map", {
    center: [56.8796, 24.6032],
    zoom: 8,
  });

  let OpenStreetMap_Mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  let lvRoadNetwork = L.tileLayer.wms('https://lvmgeoserver.lvm.lv/geoserver/ows', {
    layers: 'publicwfs:Adreses_celu_tikls',
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    attribution: '© Valsts zemes dienests.'
  }).addTo(map);

  let lvRegions = L.tileLayer.wms('https://lvmgeoserver.lvm.lv/geoserver/ows', {
    layers: 'publicwfs:arisregion',
    version: '1.3.0',
    format: 'image/png',
    transparent: true,
    attribution: '© Valsts zemes dienests.'
  }).addTo(map);

  let baseLayers = {
    "OpenStreetMap": OpenStreetMap_Mapnik
  };

  let overlays = {
    "Address road network": lvRoadNetwork,
    "Regions": lvRegions
  };

  let layerControl = L.control.layers(baseLayers, overlays).addTo(map);
  loadData(map, layerControl);
};

const loadData = (mapObj, existingLayers) => {
  let accidents = L.geoJSON(accidentData, {
    pointToLayer: function (feature, latlng) {
      const icon = icons[feature.properties.accident_type] || icons["Other accidents"];
      return L.marker(latlng, { icon: icon });
    },    
    onEachFeature: function (feature, layer) {
      let popupContent = `<strong>Accident Type:</strong> ${feature.properties.accident_type}<br>
                                <strong>Date:</strong> ${feature.properties.date}<br>
                                <strong>Time:</strong> ${feature.properties.time}<br>
                                <strong>Perished:</strong> ${feature.properties.perished}<br>
                                <strong>Injured:</strong> ${feature.properties.injured}`;

      layer.bindPopup(popupContent);
    }
  }).addTo(mapObj);

  existingLayers.addOverlay(accidents, "Accidents");
};

initMap();
