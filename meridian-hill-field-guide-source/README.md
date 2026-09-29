# Meridian Hill — Experimental Field Guide

An interactive, single-page field guide to Meridian Hill Park (also known as Malcolm X Park) in Washington, DC.

## Run locally

No build step or API key is required.

```bash
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000`.

## What is included

- Responsive editorial layout
- Live park-hours indicator in Eastern Time
- Personalized “park mood” route selector
- Interactive park anatomy diagram
- Draggable 1936/now image comparison
- Optional synthesized water ambience using the Web Audio API
- Keyboard-accessible controls and reduced-motion support
- Public-domain imagery sourced from the National Park Service

## Sources

Facts and visitor guidance were checked against these official National Park Service pages on September 28, 2026:

- [Meridian Hill Park](https://www.nps.gov/rocr/learn/historyculture/meridian-hill-park.htm)
- [Meridian Hill Park Cascades](https://www.nps.gov/places/000/cascading-fountain.htm)
- [Discover Meridian Hill Park](https://www.nps.gov/thingstodo/discover-meridian-hill-park.htm)
- [Rock Creek Park accessibility](https://www.nps.gov/rocr/planyourvisit/accessibility.htm)

## Image credits

- Cascade: DOI / Kelsey Graczyk
- Visitors at the fountain: NPS / Tony DeYoung
- 1936 view: National Park Service History Collection / Ezra B. Thompson
- Joan of Arc statue: NPS

NPS states that images credited to NPS without a copyright symbol are public domain. Review the source pages if you plan to redistribute the imagery separately.

## Security

The project contains no API keys or credentials. If a credential was exposed in a screenshot or message, rotate it before using it anywhere else.
