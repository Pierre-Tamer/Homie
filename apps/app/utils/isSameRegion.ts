import { Region } from 'react-native-maps';

export function regionToCordinates(region: Region): number[][] {
  const {
    latitude: lat,
    latitudeDelta: latDelta,
    longitude: lng,
    longitudeDelta: lngDelta,
  } = region;
  const coordinates = [
    [lng - lngDelta / 2, lat + latDelta / 2],
    [lng + lngDelta / 2, lat + latDelta / 2],
    [lng + lngDelta / 2, lat - latDelta / 2],
    [lng - lngDelta / 2, lat - latDelta / 2],
    [lng - lngDelta / 2, lat + latDelta / 2],
  ];
  return coordinates;
}

export function pointInsideRegion(point: number[], vs: number[][]) {
  let x = point[0],
    y = point[1];

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0],
      yi = vs[i][1];
    let xj = vs[j][0],
      yj = vs[j][1];

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export function isRegionInsideRegion(r1: Region, r2: number[][]) {
  const points = regionToCordinates(r1);

  let inside = true;

  for (const point of points) {
    if (!pointInsideRegion(point, r2)) inside = false;
  }

  return inside;
}
