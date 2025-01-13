<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet-draw';
  import 'leaflet-draw/dist/leaflet.draw.css';
  import type { Map as LeafletMap, FeatureGroup, Marker, Circle, LatLng, LeafletEventHandlerFn, Layer, LayerGroup } from 'leaflet';
  import type { Geofence } from '$lib/types';
  import Map from '$lib/components/Map.svelte';
  import GeofenceControls from '$lib/components/GeofenceControls.svelte';
  import GeofenceList from '$lib/components/GeofenceList.svelte';
  import Notifications from '$lib/components/Notifications.svelte';
  import GeofenceRename from '$lib/components/GeofenceRename.svelte';

  interface Position {
    lat: number;
    lng: number;
  }

  interface CircleCoordinate extends Position {
    radius: number;
  }

  interface Geofence {
    id: string;
    name: string;
    type: string;
    coordinates: Position[] | [Position, CircleCoordinate];
    layer: Layer;
  }

  interface DrawCreatedEvent {
    layer: Layer;
    layerType: 'circle' | 'polygon' | 'rectangle';
  }

  type GeofenceStore = Record<string, Geofence>;

  // Fix Leaflet's default icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  });

  let map: LeafletMap | null = null;
  let mapElement: HTMLElement;
  let drawnItems: FeatureGroup;
  let geofences: { [key: string]: Geofence } = {};
  let selectedGeofence: string | null = null;
  let geofenceName = '';
  let status: string = '';
  let insideGeofences: string[] = [];
  let outsideGeofences: string[] = [];
  let watching = false;
  let watchId: number | null = null;
  let currentLocationMarker: L.Marker | null = null;
  let locationCircle: L.Circle | null = null;
  let notificationPermission: NotificationPermission = 'default';

  // Initialize custom icon
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  function isPointInPolygon(point: Position, polygon: Position[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat;
      const yi = polygon[i].lng;
      const xj = polygon[j].lat;
      const yj = polygon[j].lng;
      const intersect = ((yi > point.lng) !== (yj > point.lng)) &&
        (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function isPointInCircle(point: Position, center: Position, radius: number): boolean {
    const R = 6371e3;
    const φ1 = point.lat * Math.PI / 180;
    const φ2 = center.lat * Math.PI / 180;
    const Δφ = (center.lat - point.lat) * Math.PI / 180;
    const Δλ = (center.lng - point.lng) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance <= radius;
  }

  function checkGeofences(position: Position) {
    const newInsideGeofences: string[] = [];
    const newOutsideGeofences: string[] = [];

    Object.entries(geofences).forEach(([name, fence]) => {
      let isInside = false;

      if (fence.type === 'circle') {
        const [center, circleData] = fence.coordinates as [Position, CircleCoordinate];
        isInside = isPointInCircle(position, center, circleData.radius);
      } else {
        isInside = isPointInPolygon(position, fence.coordinates as Position[]);
      }

      if (isInside) {
        if (!insideGeofences.includes(name)) {
          showNotification(`Entered ${name}`, `You have entered the geofence: ${name}`);
        }
        newInsideGeofences.push(name);
      } else {
        if (insideGeofences.includes(name)) {
          showNotification(`Left ${name}`, `You have left the geofence: ${name}`);
        }
        newOutsideGeofences.push(name);
      }
    });

    insideGeofences = newInsideGeofences;
    outsideGeofences = newOutsideGeofences;
  }

  function showNotification(title: string, body: string) {
    if (notificationPermission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.png'
      });
    }
  }

  async function startWatching() {
    if (!watching && 'geolocation' in navigator) {
      watching = true;
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude: lat, longitude: lng, accuracy } = pos.coords;
          updatePosition({ lat, lng });
          checkGeofences({ lat, lng });
        },
        (error) => {
          console.error('Geolocation error:', error);
          status = 'Error getting location';
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
      );
    }
  }

  function updatePosition(pos: Position) {
    if (!map) return;

    const { lat, lng } = pos;

    if (currentLocationMarker) {
      currentLocationMarker.setLatLng([lat, lng]);
    } else {
      currentLocationMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'current-location-marker',
          html: '<div class="ping"></div>'
        })
      }).addTo(map);
    }

    map.setView([lat, lng], map.getZoom());
  }

  function handleMapEvent(event: any) {
    if (event.type === 'geofenceCreated') {
      const { layer, type } = event.detail;
      const id = crypto.randomUUID();
      const defaultName = `Geofence ${Object.keys(geofences).length + 1}`;

      if (type === 'circle') {
        const circle = layer as L.Circle;
        const center = circle.getLatLng();
        const radius = circle.getRadius();

        geofences[defaultName] = {
          id,
          name: defaultName,
          type: 'circle',
          coordinates: [
            { lat: center.lat, lng: center.lng },
            { lat: center.lat, lng: center.lng, radius }
          ],
          layer
        };
      } else {
        const polygon = layer as L.Polygon;
        const latLngs = polygon.getLatLngs();
        const coordinates = (Array.isArray(latLngs[0]) ? latLngs[0] : latLngs) as L.LatLng[];
        
        geofences[defaultName] = {
          id,
          name: defaultName,
          type: type === 'rectangle' ? 'rectangle' : 'polygon',
          coordinates: coordinates.map(latLng => ({
            lat: latLng.lat,
            lng: latLng.lng
          })),
          layer
        };
      }

      geofences = { ...geofences };
    } else if (event.type === 'geofenceEdited') {
      const { layer } = event.detail;
      for (const [name, fence] of Object.entries(geofences)) {
        if (fence.layer === layer) {
          if (fence.type === 'circle') {
            const circle = layer as L.Circle;
            const center = circle.getLatLng();
            const radius = circle.getRadius();
            fence.coordinates = [
              { lat: center.lat, lng: center.lng },
              { lat: center.lat, lng: center.lng, radius }
            ];
          } else {
            const polygon = layer as L.Polygon;
            const latLngs = polygon.getLatLngs();
            const coordinates = (Array.isArray(latLngs[0]) ? latLngs[0] : latLngs) as L.LatLng[];
            fence.coordinates = coordinates.map(latLng => ({
              lat: latLng.lat,
              lng: latLng.lng
            }));
          }
          break;
        }
      }
      geofences = { ...geofences };
    } else if (event.type === 'geofenceDeleted') {
      const { layer } = event.detail;
      for (const [name, fence] of Object.entries(geofences)) {
        if (fence.layer === layer) {
          delete geofences[name];
          break;
        }
      }
      geofences = { ...geofences };
    }
  }

  async function initializeMap(): Promise<void> {
    try {
      if (!map) return;

      // Initialize the FeatureGroup for drawn items
      drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // Add draw control
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

      // Add event listeners with proper type assertions
      map.on('draw:created', ((e: any) => handleMapEvent({
        type: 'geofenceCreated',
        detail: {
          layer: (e as { layer: L.Layer }).layer,
          type: (e as { layerType: string }).layerType
        }
      })) as L.LeafletEventHandlerFn);

      map.on('draw:edited', ((e: any) => handleMapEvent({
        type: 'geofenceEdited',
        detail: {
          layers: (e as { layers: L.LayerGroup }).layers
        }
      })) as L.LeafletEventHandlerFn);

      map.on('draw:deleted', ((e: any) => handleMapEvent({
        type: 'geofenceDeleted',
        detail: {
          layers: (e as { layers: L.LayerGroup }).layers
        }
      })) as L.LeafletEventHandlerFn);

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            if (map) {
              map.setView([lat, lng], 13);
              updatePosition({ lat, lng });
            }
          },
          (error) => {
            console.error('Error getting position:', error);
            status = 'Error getting position';
          }
        );
      } else {
        status = 'Geolocation is not supported by your browser';
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      status = 'Error initializing map. Please refresh the page.';
    }
  }

  async function startMonitoring(): Promise<void> {
    if (!watching) {
      watching = true;
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude: lat, longitude: lng, accuracy } = pos.coords;
            updatePosition({ lat, lng });
            checkGeofences({ lat, lng });
          },
          (error) => {
            console.error('Error watching position:', error);
            status = 'Error watching position';
            watching = false;
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        status = 'Geolocation is not supported by your browser';
      }
    }
  }

  async function stopMonitoring(): Promise<void> {
    if (watching && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watching = false;
      status = 'Monitoring stopped';
    }
  }

  function handleRename(newName: string) {
    if (selectedGeofence && newName !== selectedGeofence) {
      const geofence = geofences[selectedGeofence];
      if (geofence) {
        geofences[newName] = { ...geofence, name: newName };
        delete geofences[selectedGeofence];
        selectedGeofence = newName;
        geofenceName = newName;
      }
    }
  }

  function handleSaveGeofence() {
    if (selectedGeofence) {
      const fence = geofences[selectedGeofence];
      if (fence) {
        const newFence = { ...fence, name: geofenceName };
        delete geofences[selectedGeofence];
        geofences[geofenceName] = newFence;
        selectedGeofence = null;
        geofenceName = '';
      }
    }
  }

  function handleDeleteGeofence() {
    if (selectedGeofence) {
      const fence = geofences[selectedGeofence];
      if (fence && fence.layer) {
        drawnItems.removeLayer(fence.layer);
      }
      delete geofences[selectedGeofence];
      selectedGeofence = null;
    }
  }

  function handleSelectGeofence(event: CustomEvent<{ name: string }>) {
    selectedGeofence = event.detail.name;
    geofenceName = event.detail.name;
  }

  function handleGeofenceSelect(name: string) {
    selectedGeofence = name;
  }

  function handleGeofenceDelete(name: string) {
    if (geofences[name]) {
      delete geofences[name];
      geofences = { ...geofences }; // Trigger reactivity
      
      // Remove from inside/outside arrays
      insideGeofences = insideGeofences.filter(g => g !== name);
      outsideGeofences = outsideGeofences.filter(g => g !== name);
      
      // Clear selection if deleted geofence was selected
      if (selectedGeofence === name) {
        selectedGeofence = null;
      }
    }
  }

  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);

        // Request periodic background sync
        // @ts-ignore - periodicSync is not in the type definitions yet
        if ('periodicSync' in registration && registration.periodicSync?.register) {
          try {
            // @ts-ignore - periodicSync is not in the type definitions yet
            await registration.periodicSync.register('geofence-sync', {
              minInterval: 60 * 1000 // Minimum interval of one minute
            });
            console.log('Periodic background sync registered');
          } catch (error) {
            console.error('Error registering periodic sync:', error);
          }
        }

        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Request permissions only on user interaction
  async function requestPermissions() {
    try {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }

      // Request geolocation permission
      if ('geolocation' in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        console.log('Geolocation permission granted');
        return position;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  }

  // Initialize app after permissions
  async function initializeApp() {
    await registerServiceWorker();
    // Don't request permissions here, wait for user interaction
  }

  onMount(async () => {
    try {
      // Service Worker Registration
      await registerServiceWorker();
      
      // Request notification permission
      if ('Notification' in window) {
        notificationPermission = await Notification.requestPermission();
        console.log('Notification permission:', notificationPermission);
      }

      // Request geolocation permission
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            console.log('Geolocation permission granted');
            startMonitoring();
          },
          () => console.log('Geolocation permission denied')
        );
      }

      // Set up map event listeners with proper type assertions
      if (map) {
        map.on('draw:created', ((e: any) => handleMapEvent({
          type: 'geofenceCreated',
          detail: {
            layer: (e as { layer: L.Layer }).layer,
            type: (e as { layerType: string }).layerType
          }
        })) as L.LeafletEventHandlerFn);

        map.on('draw:edited', ((e: any) => handleMapEvent({
          type: 'geofenceEdited',
          detail: {
            layers: (e as { layers: L.LayerGroup }).layers
          }
        })) as L.LeafletEventHandlerFn);

        map.on('draw:deleted', ((e: any) => handleMapEvent({
          type: 'geofenceDeleted',
          detail: {
            layers: (e as { layers: L.LayerGroup }).layers
          }
        })) as L.LeafletEventHandlerFn);
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  });

  onDestroy(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watching = false;
    }
  });
</script>

<svelte:head>
  <title>Geofencing PWA</title>
  <meta name="description" content="A Progressive Web App for geofencing" />
</svelte:head>

<div class="h-screen flex flex-col">
  <div class="flex-1 relative">
    <Map bind:map bind:mapElement bind:drawnItems />
    
    <div class="absolute top-4 left-4 z-[1000] space-y-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        on:click={requestPermissions}
      >
        Enable Notifications & Location
      </button>
      <GeofenceControls
        {watching}
        {selectedGeofence}
        {geofenceName}
        {status}
        on:startMonitoring={startMonitoring}
        on:stopMonitoring={stopMonitoring}
        on:saveGeofence={handleSaveGeofence}
        on:deleteGeofence={handleDeleteGeofence}
      />
      
      {#if selectedGeofence}
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <GeofenceRename
            {selectedGeofence}
            {geofenceName}
            onRename={handleRename}
          />
        </div>
      {/if}
      
      <GeofenceList
        {geofences}
        {selectedGeofence}
        {insideGeofences}
        {outsideGeofences}
        onSelect={handleGeofenceSelect}
        onDelete={handleGeofenceDelete}
      />
    </div>
  </div>

  <Notifications {status} {notificationPermission} />
</div>
