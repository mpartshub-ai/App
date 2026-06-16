function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function pointToSegmentDistance(point, start, end) {
  const lat1 = toRad(start.lat);
  const lon1 = toRad(start.lng);
  const lat2 = toRad(end.lat);
  const lon2 = toRad(end.lng);
  const lat3 = toRad(point.lat);
  const lon3 = toRad(point.lng);

  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  if (dx === 0 && dy === 0) {
    return distance(point.lat, point.lng, start.lat, start.lng);
  }

  const t = ((lon3 - lon1) * dx + (lat3 - lat1) * dy) / (dx * dx + dy * dy);
  if (t <= 0) {
    return distance(point.lat, point.lng, start.lat, start.lng);
  }
  if (t >= 1) {
    return distance(point.lat, point.lng, end.lat, end.lng);
  }

  const projection = {
    lat: start.lat + t * (end.lat - start.lat),
    lng: start.lng + t * (end.lng - start.lng)
  };
  return distance(point.lat, point.lng, projection.lat, projection.lng);
}

function parseLocation(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    const parts = raw.split(',').map((s) => s.trim());
    if (parts.length !== 2) return null;
    return { lat: Number(parts[0]), lng: Number(parts[1]) };
  }
  if (typeof raw === 'object' && raw.lat != null && raw.lng != null) {
    return { lat: Number(raw.lat), lng: Number(raw.lng) };
  }
  return null;
}

function normalizeRoutePoints(routeGeo) {
  if (!routeGeo) return [];
  if (typeof routeGeo === 'string') {
    try {
      const parsed = JSON.parse(routeGeo);
      return normalizeRoutePoints(parsed);
    } catch {
      return [];
    }
  }
  if (Array.isArray(routeGeo)) {
    return routeGeo.map((item) => parseLocation(item)).filter(Boolean);
  }
  return [];
}

function pointAlongRoute(point, routePoints, thresholdMeters = 1000) {
  if (!routePoints || routePoints.length === 0) return false;
  for (let i = 0; i < routePoints.length - 1; i += 1) {
    const segmentDistance = pointToSegmentDistance(point, routePoints[i], routePoints[i + 1]);
    if (segmentDistance <= thresholdMeters) return true;
  }
  return false;
}

function findMatchingTrips(trips, pickup, dropoff) {
  const pickupPoint = parseLocation(pickup);
  const dropoffPoint = parseLocation(dropoff);
  if (!pickupPoint || !dropoffPoint) return [];

  return trips
    .map((trip) => ({
      ...trip,
      routeGeo: normalizeRoutePoints(trip.routeGeo)
    }))
    .filter((trip) => {
      return pointAlongRoute(pickupPoint, trip.routeGeo) && pointAlongRoute(dropoffPoint, trip.routeGeo);
    })
    .map((trip) => ({
      ...trip,
      matchScore: 100,
      pickupLocation: pickup,
      dropoffLocation: dropoff
    }));
}

module.exports = {
  findMatchingTrips
};
