

export const getInitialCoords = (map, usBounds) => {
  let initialCoords = map.cameraForBounds(usBounds);
  initialCoords.zoom = parseFloat(initialCoords.zoom.toFixed(3));
  initialCoords.center.lat = parseFloat(initialCoords.center.lat.toFixed(3));
  initialCoords.center.lng = parseFloat(initialCoords.center.lng.toFixed(3));

  return initialCoords;
};

export const getCurrentCoords = (map) => {
  let currentCoords = {
    center: map.getCenter(),
    zoom: parseFloat(map.getZoom().toFixed(3)),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
  currentCoords.center.lat = parseFloat(currentCoords.center.lat.toFixed(3));
  currentCoords.center.lng = parseFloat(currentCoords.center.lng.toFixed(3));

  return currentCoords;
};
