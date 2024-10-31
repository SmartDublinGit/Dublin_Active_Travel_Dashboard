// this keeps track of what co-ordinates the map is on.

const roundCoordinate = (value) => parseFloat(value.toFixed(3));

export const getCurrentCoords = (map) => {
  const center = map.getCenter();
  
  return {
    zoom: roundCoordinate(map.getZoom()),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
    center: {
      lat: roundCoordinate(center.lat),
      lng: roundCoordinate(center.lng)
    }
  };
};

export const getInitialCoords = (map, bounds) => {
  const coords = map.cameraForBounds(bounds);
  
  return {
    ...coords,
    zoom: roundCoordinate(coords.zoom),
    center: {
      lat: roundCoordinate(coords.center.lat),
      lng: roundCoordinate(coords.center.lng)
    }
  };
};

