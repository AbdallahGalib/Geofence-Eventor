<!-- Map.svelte -->
<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import L from 'leaflet';
  import type { Map as LeafletMap, FeatureGroup, Layer } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-draw/dist/leaflet.draw.css';
  import type { DrawEvents } from 'leaflet';

  export let map: LeafletMap | null = null;
  export let mapElement: HTMLElement;
  export let drawnItems: FeatureGroup;

  const dispatch = createEventDispatcher();

  onMount(() => {
    // Initialize the map
    map = L.map(mapElement).setView([0, 0], 2);
    
    // Fix Leaflet's default icon paths
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
      iconUrl: '/images/leaflet/marker-icon.png',
      shadowUrl: '/images/leaflet/marker-shadow.png'
    });

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // Initialize the FeatureGroup for drawn items
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Add draw control to the right side
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: true,
        circle: true,
        rectangle: true,
        polyline: false,
        circlemarker: false,
        marker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });
    map.addControl(drawControl);

    // Add event handlers for draw events
    map.on(L.Draw.Event.CREATED, ((event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
      dispatch('geofenceCreated', { layer, type: event.layerType });
    }) as L.LeafletEventHandlerFn);

    map.on(L.Draw.Event.EDITED, ((event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: Layer) => {
        dispatch('geofenceEdited', { layer });
      });
    }) as L.LeafletEventHandlerFn);

    map.on(L.Draw.Event.DELETED, ((event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: Layer) => {
        dispatch('geofenceDeleted', { layer });
      });
    }) as L.LeafletEventHandlerFn);
  });

  onDestroy(() => {
    if (map) {
      map.remove();
      map = null;
    }
  });
</script>

<div bind:this={mapElement} class="w-full h-[500px] rounded-lg shadow-lg"></div>

<style>
  :global(.leaflet-container) {
    background-color: #f5f5f5;
  }

  :global(.leaflet-control-attribution) {
    background-color: rgba(255, 255, 255, 0.8) !important;
  }

  :global(.leaflet-draw-toolbar a) {
    background-color: white !important;
    border: 2px solid rgba(0, 0, 0, 0.2) !important;
  }

  :global(.leaflet-draw-toolbar a:hover) {
    background-color: #f4f4f4 !important;
  }

  /* Move zoom controls to the right */
  :global(.leaflet-control-zoom) {
    right: 10px !important;
    left: auto !important;
  }
</style>
