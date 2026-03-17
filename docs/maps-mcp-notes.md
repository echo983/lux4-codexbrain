# Maps Grounding Lite MCP Notes

This note captures the minimum official details we need for Google Maps Grounding Lite MCP and the current behavior observed in this environment.

## Official docs

- Overview: https://developers.google.com/maps/ai/grounding-lite
- MCP reference index: https://developers.google.com/maps/ai/grounding-lite/reference
- `search_places`: https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places
- `compute_routes`: https://developers.google.com/maps/ai/grounding-lite/reference/mcp/compute_routes
- `lookup_weather`: https://developers.google.com/maps/ai/grounding-lite/reference/mcp/lookup_weather

## Authentication

Google's overview says Grounding Lite MCP uses Streamable HTTP and API-key auth should be passed as the custom `X-Goog-Api-Key` header.

Relevant official note:
- Grounding Lite overview says to pass the key using the `X-Goog-Api-Key` header in the MCP client config.

## Tool summary

- `search_places`: search for places, businesses, addresses, and points of interest.
- `compute_routes`: compute route distance and duration between origin and destination.
- `lookup_weather`: current conditions, hourly forecast, and daily forecast.

## Minimum argument shapes from the official MCP reference

### `search_places`

Official rule:
- Required field: `text_query` string

Useful response fields:
- `places[].id`: place ID
- `places[].location.latitude`
- `places[].location.longitude`
- `summary`

Minimal example:

```json
{
  "text_query": "Eiffel Tower, Paris, France"
}
```

### `compute_routes`

Official rule:
- Both `origin` and `destination` are required.
- Each must be one of:
  - `{"address":"..."}`
  - `{"lat_lng":{"latitude": ..., "longitude": ...}}`
  - `{"place_id":"..."}`

Official example:

```json
{
  "origin": { "address": "Eiffel Tower" },
  "destination": { "place_id": "ChIJt_5xIthw5EARoJ71mGq7t74" },
  "travel_mode": "DRIVE"
}
```

Important note:
- Official reference uses `travel_mode` in the example payload.
- Our local Codex tool binding currently exposes the parameter name as `travelMode`.

### `lookup_weather`

Official rule:
- Required field: `location`
- `location` is a oneof, so provide exactly one of:
  - `{"address":"..."}`
  - `{"place_id":"..."}`
  - `{"lat_lng":{"latitude": ..., "longitude": ...}}`
- For current weather: provide `location` only
- For hourly forecast: add `date` and `hour`
- For daily forecast: add `date` only
- `date` is an object with year/month/day integers

Minimal examples:

Current weather:

```json
{
  "location": { "address": "Madrid, Spain" }
}
```

Hourly forecast:

```json
{
  "location": { "address": "Madrid, Spain" },
  "date": { "year": 2026, "month": 3, "day": 17 },
  "hour": 17
}
```

Daily forecast:

```json
{
  "location": { "address": "Madrid, Spain" },
  "date": { "year": 2026, "month": 3, "day": 18 }
}
```

Important note:
- Our local Codex tool binding currently exposes the parameter name as `unitsSystem`.
- The official prose describes the concept as `units_system`, but the JSON request schema shown on the reference page uses `unitsSystem`.

## What works in this environment today

Verified working:
- `search_places`

Observed successful queries:
- `"Eiffel Tower, Paris, France"`
- `"Madrid, Spain"`
- `"Barcelona, Spain"`

Observed current limitation:
- The local Codex tool wrapper for `compute_routes` and `lookup_weather` did not accept nested JSON objects when called through the current function binding in this environment.
- Errors looked like:
  - `Invalid value at 'origin'`
  - `Invalid value at 'destination'`
  - `Invalid value at 'location'`

Interpretation:
- This looks like a local tool-binding / argument-marshalling issue, not an authentication failure.
- `search_places` already proves the MCP server itself is reachable and authenticated.

## Practical usage pattern

Until the local binding issue is fixed, the safe sequence is:

1. Use `search_places` first.
2. Capture the returned `place ID` and coordinates.
3. When testing routes or weather, compare the call shape against the official JSON examples above.
4. Treat failures from `compute_routes` and `lookup_weather` as likely client-side argument formatting problems unless authentication also fails.

## Sources

- Google Maps Grounding Lite overview: https://developers.google.com/maps/ai/grounding-lite
- Google Maps Grounding Lite `search_places` reference: https://developers.google.com/maps/ai/grounding-lite/reference/mcp/search_places
- Google Maps Grounding Lite `compute_routes` reference: https://developers.google.com/maps/ai/grounding-lite/reference/mcp/compute_routes
- Google Maps Grounding Lite `lookup_weather` reference: https://developers.google.com/maps/ai/grounding-lite/reference/mcp/lookup_weather
