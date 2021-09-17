import {WKTLoader} from '@loaders.gl/wkt';
import {parseSync} from '@loaders.gl/core';
export const DEFAULT_USER_COMPONENT_IN_URL = '{user}';
export const DEFAULT_REGION_COMPONENT_IN_URL = '{region}';

export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
  V3: 'v3'
};

export const MAP_TYPES = {
  QUERY: 'query',
  TABLE: 'table',
  TILESET: 'tileset'
};

// AVAILABLE FORMATS
export const FORMATS = {
  GEOJSON: 'geojson',
  CSV: 'csv',
  NDJSON: 'ndjson',
  TILEJSON: 'tilejson',
  JSON: 'json'
};

/**
 * Simple encode parameter
 */
export function encodeParameter(name, value) {
  return `${name}=${encodeURIComponent(value)}`;
}

export function csvToGeoJson(csv, {geoColumn}) {
  const GEOM = geoColumn || 'geom';
  return csv.map(value => {
    try {
      const geometry = JSON.parse(value[GEOM]);
      const {...properties} = value;
      delete properties[GEOM];
      return {type: 'Feature', geometry, properties};
    } catch (error) {
      throw new Error(`Failed to parse geometry: ${value}`);
    }
  });
}

export function ndJsonToGeoJson(ndjson, {geoColumn}) {
  const GEOM = geoColumn || 'geom';
  const json = ndjson.map(value => {
    try {
      // TODO remove WKT once API passes geom as JSON
      const geometry = value[GEOM] && parseSync(value[GEOM], WKTLoader);
      const {...properties} = value;
      delete properties[GEOM];
      return {type: 'Feature', geometry, properties};
    } catch (error) {
      throw new Error(`Failed to parse geometry: ${value}`);
    }
  });

  return json.filter(value => value.geometry);
}
