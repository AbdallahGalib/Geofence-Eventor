import { c as create_ssr_component, o as onDestroy, a as add_attribute, h as createEventDispatcher, e as escape, b as each, v as validate_component } from "../../chunks/ssr.js";
import L from "leaflet";
/* empty css                        */
import "leaflet-draw";
const css$1 = {
  code: ".leaflet-container{background-color:#f5f5f5}.leaflet-control-attribution{background-color:rgba(255, 255, 255, 0.8) !important}.leaflet-draw-toolbar a{background-color:white !important;border:2px solid rgba(0, 0, 0, 0.2) !important}.leaflet-draw-toolbar a:hover{background-color:#f4f4f4 !important}",
  map: '{"version":3,"file":"Map.svelte","sources":["Map.svelte"],"sourcesContent":["<!-- Map.svelte -->\\n<script lang=\\"ts\\">import { onMount, onDestroy } from \\"svelte\\";\\nimport L from \\"leaflet\\";\\nimport \\"leaflet/dist/leaflet.css\\";\\nimport \\"leaflet-draw/dist/leaflet.draw.css\\";\\nexport let map = null;\\nexport let mapElement;\\nexport let drawnItems;\\nonMount(() => {\\n  map = L.map(mapElement).setView([0, 0], 2);\\n  L.Icon.Default.mergeOptions({\\n    iconRetinaUrl: \\"/images/leaflet/marker-icon-2x.png\\",\\n    iconUrl: \\"/images/leaflet/marker-icon.png\\",\\n    shadowUrl: \\"/images/leaflet/marker-shadow.png\\"\\n  });\\n  L.tileLayer(\\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\\", {\\n    attribution: \\" OpenStreetMap contributors\\"\\n  }).addTo(map);\\n  drawnItems = new L.FeatureGroup();\\n  map.addLayer(drawnItems);\\n  const drawControl = new L.Control.Draw({\\n    draw: {\\n      polygon: true,\\n      circle: true,\\n      rectangle: true,\\n      polyline: false,\\n      circlemarker: false,\\n      marker: false\\n    },\\n    edit: {\\n      featureGroup: drawnItems,\\n      remove: true\\n    }\\n  });\\n  map.addControl(drawControl);\\n});\\nonDestroy(() => {\\n  if (map) {\\n    map.remove();\\n    map = null;\\n  }\\n});\\n<\/script>\\n\\n<div bind:this={mapElement} class=\\"w-full h-[500px] rounded-lg shadow-lg\\"></div>\\n\\n<style>\\n  :global(.leaflet-container) {\\n    background-color: #f5f5f5;\\n  }\\n\\n  :global(.leaflet-control-attribution) {\\n    background-color: rgba(255, 255, 255, 0.8) !important;\\n  }\\n\\n  :global(.leaflet-draw-toolbar a) {\\n    background-color: white !important;\\n    border: 2px solid rgba(0, 0, 0, 0.2) !important;\\n  }\\n\\n  :global(.leaflet-draw-toolbar a:hover) {\\n    background-color: #f4f4f4 !important;\\n  }\\n</style>\\n"],"names":[],"mappings":"AA+CU,kBAAoB,CAC1B,gBAAgB,CAAE,OACpB,CAEQ,4BAA8B,CACpC,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,UAC7C,CAEQ,uBAAyB,CAC/B,gBAAgB,CAAE,KAAK,CAAC,UAAU,CAClC,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,UACvC,CAEQ,6BAA+B,CACrC,gBAAgB,CAAE,OAAO,CAAC,UAC5B"}'
};
const Map = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { map = null } = $$props;
  let { mapElement } = $$props;
  let { drawnItems } = $$props;
  onDestroy(() => {
    if (map) {
      map.remove();
      map = null;
    }
  });
  if ($$props.map === void 0 && $$bindings.map && map !== void 0) $$bindings.map(map);
  if ($$props.mapElement === void 0 && $$bindings.mapElement && mapElement !== void 0) $$bindings.mapElement(mapElement);
  if ($$props.drawnItems === void 0 && $$bindings.drawnItems && drawnItems !== void 0) $$bindings.drawnItems(drawnItems);
  $$result.css.add(css$1);
  return `  <div class="w-full h-[500px] rounded-lg shadow-lg"${add_attribute("this", mapElement, 0)}></div>`;
});
const GeofenceControls = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { watching = false } = $$props;
  let { selectedGeofence = null } = $$props;
  let { geofenceName } = $$props;
  let { status } = $$props;
  createEventDispatcher();
  if ($$props.watching === void 0 && $$bindings.watching && watching !== void 0) $$bindings.watching(watching);
  if ($$props.selectedGeofence === void 0 && $$bindings.selectedGeofence && selectedGeofence !== void 0) $$bindings.selectedGeofence(selectedGeofence);
  if ($$props.geofenceName === void 0 && $$bindings.geofenceName && geofenceName !== void 0) $$bindings.geofenceName(geofenceName);
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  return `  <div class="bg-white p-4 rounded-lg shadow-lg space-y-4"><div class="flex items-center gap-4">${!watching ? `<button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors" data-svelte-h="svelte-1yxiepo">Start Monitoring</button>` : `<button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" data-svelte-h="svelte-1n357rs">Stop Monitoring</button>`}</div> ${selectedGeofence ? `<div class="flex items-center gap-4"><button ${!geofenceName ? "disabled" : ""} class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Save Geofence</button> <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors" data-svelte-h="svelte-efrp62">Delete Geofence</button></div>` : ``} ${status ? `<div class="flex justify-between items-center"><span class="text-gray-600">${escape(status)}</span></div>` : ``}</div>`;
});
const css = {
  code: ".selected.svelte-zdfnc6{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);--tw-ring-opacity:1;--tw-ring-color:rgb(34 197 94 / var(--tw-ring-opacity, 1))\n}",
  map: `{"version":3,"file":"GeofenceList.svelte","sources":["GeofenceList.svelte"],"sourcesContent":["<!-- GeofenceList.svelte -->\\n<script lang=\\"ts\\">export let geofences;\\nexport let selectedGeofence;\\nexport let insideGeofences = [];\\nexport let outsideGeofences = [];\\nexport let onSelect;\\nexport let onDelete;\\n<\/script>\\n\\n<div class=\\"bg-white p-4 rounded-lg shadow-lg space-y-4\\">\\n  <div>\\n    <h3 class=\\"text-lg font-semibold mb-2\\">Inside Geofences</h3>\\n    {#if insideGeofences.length === 0}\\n      <p class=\\"text-gray-500 italic\\">No geofences currently inside</p>\\n    {:else}\\n      <ul class=\\"space-y-1\\">\\n        {#each insideGeofences as name}\\n          <li>\\n            <button\\n              class=\\"px-3 py-2 bg-green-100 text-green-800 rounded cursor-pointer hover:bg-green-200 transition-colors w-full flex justify-between items-center\\"\\n              class:selected={selectedGeofence === name}\\n              on:click={() => onSelect(name)}\\n              on:keydown={(e) => {\\n                if (e.key === 'Enter' || e.key === ' ') {\\n                  onSelect(name);\\n                }\\n              }}\\n              aria-label=\\"Select geofence {name}\\"\\n            >\\n              <span>{name}</span>\\n              <button\\n                class=\\"text-red-600 hover:text-red-800 ml-2\\"\\n                on:click|stopPropagation={() => onDelete(name)}\\n                on:keydown={(e) => {\\n                  if (e.key === 'Enter' || e.key === ' ') {\\n                    e.stopPropagation();\\n                    onDelete(name);\\n                  }\\n                }}\\n                aria-label=\\"Delete geofence {name}\\"\\n              >\\n                Delete\\n              </button>\\n            </button>\\n          </li>\\n        {/each}\\n      </ul>\\n    {/if}\\n  </div>\\n\\n  <div>\\n    <h3 class=\\"text-lg font-semibold mb-2\\">Outside Geofences</h3>\\n    {#if outsideGeofences.length === 0}\\n      <p class=\\"text-gray-500 italic\\">No geofences currently outside</p>\\n    {:else}\\n      <ul class=\\"space-y-1\\">\\n        {#each outsideGeofences as name}\\n          <li>\\n            <button\\n              class=\\"px-3 py-2 bg-gray-100 text-gray-800 rounded cursor-pointer hover:bg-gray-200 transition-colors w-full flex justify-between items-center\\"\\n              class:selected={selectedGeofence === name}\\n              on:click={() => onSelect(name)}\\n              on:keydown={(e) => {\\n                if (e.key === 'Enter' || e.key === ' ') {\\n                  onSelect(name);\\n                }\\n              }}\\n              aria-label=\\"Select geofence {name}\\"\\n            >\\n              <span>{name}</span>\\n              <button\\n                class=\\"text-red-600 hover:text-red-800 ml-2\\"\\n                on:click|stopPropagation={() => onDelete(name)}\\n                on:keydown={(e) => {\\n                  if (e.key === 'Enter' || e.key === ' ') {\\n                    e.stopPropagation();\\n                    onDelete(name);\\n                  }\\n                }}\\n                aria-label=\\"Delete geofence {name}\\"\\n              >\\n                Delete\\n              </button>\\n            </button>\\n          </li>\\n        {/each}\\n      </ul>\\n    {/if}\\n  </div>\\n</div>\\n\\n<style>\\n  .selected {\\n    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\\n    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\\n    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\\n    --tw-ring-opacity: 1;\\n    --tw-ring-color: rgb(34 197 94 / var(--tw-ring-opacity, 1))\\n}\\n</style>\\n"],"names":[],"mappings":"AA4FE,uBAAU,CACR,uBAAuB,CAAE,kFAAkF,CAC3G,gBAAgB,CAAE,uFAAuF,CACzG,UAAU,CAAE,IAAI,uBAAuB,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,IAAI,WAAW,CAAC,UAAU,CAAC,CAC5F,iBAAiB,CAAE,CAAC,CACpB,eAAe,CAAE;AACrB"}`
};
const GeofenceList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { geofences } = $$props;
  let { selectedGeofence } = $$props;
  let { insideGeofences = [] } = $$props;
  let { outsideGeofences = [] } = $$props;
  let { onSelect } = $$props;
  let { onDelete } = $$props;
  if ($$props.geofences === void 0 && $$bindings.geofences && geofences !== void 0) $$bindings.geofences(geofences);
  if ($$props.selectedGeofence === void 0 && $$bindings.selectedGeofence && selectedGeofence !== void 0) $$bindings.selectedGeofence(selectedGeofence);
  if ($$props.insideGeofences === void 0 && $$bindings.insideGeofences && insideGeofences !== void 0) $$bindings.insideGeofences(insideGeofences);
  if ($$props.outsideGeofences === void 0 && $$bindings.outsideGeofences && outsideGeofences !== void 0) $$bindings.outsideGeofences(outsideGeofences);
  if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0) $$bindings.onSelect(onSelect);
  if ($$props.onDelete === void 0 && $$bindings.onDelete && onDelete !== void 0) $$bindings.onDelete(onDelete);
  $$result.css.add(css);
  return `  <div class="bg-white p-4 rounded-lg shadow-lg space-y-4"><div><h3 class="text-lg font-semibold mb-2" data-svelte-h="svelte-x6gjsu">Inside Geofences</h3> ${insideGeofences.length === 0 ? `<p class="text-gray-500 italic" data-svelte-h="svelte-ybcspa">No geofences currently inside</p>` : `<ul class="space-y-1">${each(insideGeofences, (name) => {
    return `<li><button class="${[
      "px-3 py-2 bg-green-100 text-green-800 rounded cursor-pointer hover:bg-green-200 transition-colors w-full flex justify-between items-center svelte-zdfnc6",
      selectedGeofence === name ? "selected" : ""
    ].join(" ").trim()}" aria-label="${"Select geofence " + escape(name, true)}"><span>${escape(name)}</span> <button class="text-red-600 hover:text-red-800 ml-2" aria-label="${"Delete geofence " + escape(name, true)}">Delete
              </button></button> </li>`;
  })}</ul>`}</div> <div><h3 class="text-lg font-semibold mb-2" data-svelte-h="svelte-1u7umat">Outside Geofences</h3> ${outsideGeofences.length === 0 ? `<p class="text-gray-500 italic" data-svelte-h="svelte-11698vd">No geofences currently outside</p>` : `<ul class="space-y-1">${each(outsideGeofences, (name) => {
    return `<li><button class="${[
      "px-3 py-2 bg-gray-100 text-gray-800 rounded cursor-pointer hover:bg-gray-200 transition-colors w-full flex justify-between items-center svelte-zdfnc6",
      selectedGeofence === name ? "selected" : ""
    ].join(" ").trim()}" aria-label="${"Select geofence " + escape(name, true)}"><span>${escape(name)}</span> <button class="text-red-600 hover:text-red-800 ml-2" aria-label="${"Delete geofence " + escape(name, true)}">Delete
              </button></button> </li>`;
  })}</ul>`}</div> </div>`;
});
const Notifications = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status = "" } = $$props;
  let { notificationPermission: notificationPermission2 = "default" } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
  if ($$props.notificationPermission === void 0 && $$bindings.notificationPermission && notificationPermission2 !== void 0) $$bindings.notificationPermission(notificationPermission2);
  return `<div class="fixed bottom-4 right-4 space-y-2">${status ? `<div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg">${escape(status)}</div>` : ``} ${notificationPermission2 === "default" ? `<button class="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg shadow-lg transition-colors" data-svelte-h="svelte-ycjfg1">Enable Notifications</button>` : `${notificationPermission2 === "denied" ? `<div class="bg-red-500 text-white p-4 rounded-lg shadow-lg" data-svelte-h="svelte-1ky7f5h">Notifications are blocked. Please enable them in your browser settings.</div>` : ``}`}</div>`;
});
const GeofenceRename = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { selectedGeofence = null } = $$props;
  let { geofenceName = "" } = $$props;
  let { onRename } = $$props;
  if ($$props.selectedGeofence === void 0 && $$bindings.selectedGeofence && selectedGeofence !== void 0) $$bindings.selectedGeofence(selectedGeofence);
  if ($$props.geofenceName === void 0 && $$bindings.geofenceName && geofenceName !== void 0) $$bindings.geofenceName(geofenceName);
  if ($$props.onRename === void 0 && $$bindings.onRename && onRename !== void 0) $$bindings.onRename(onRename);
  return `<div class="flex items-center gap-2">${`<span class="font-medium">${escape(geofenceName)}</span> <button class="px-2 py-1 text-blue-500 hover:text-blue-600 transition-colors" ${!selectedGeofence ? "disabled" : ""}>Rename</button>`}</div>`;
});
let notificationPermission = "default";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png"
  });
  let map = null;
  let mapElement;
  let drawnItems = new L.FeatureGroup();
  let geofences = {};
  let selectedGeofence = null;
  let geofenceName = "";
  let status = "";
  let insideGeofences = [];
  let outsideGeofences = [];
  let watching = false;
  L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  function handleRename(newName) {
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
  function handleGeofenceSelect(name) {
    selectedGeofence = name;
  }
  function handleGeofenceDelete(name) {
    if (geofences[name]) {
      delete geofences[name];
      geofences = { ...geofences };
      insideGeofences = insideGeofences.filter((g) => g !== name);
      outsideGeofences = outsideGeofences.filter((g) => g !== name);
      if (selectedGeofence === name) {
        selectedGeofence = null;
      }
    }
  }
  onDestroy(() => {
  });
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1ps6v8r_START -->${$$result.title = `<title>Geofencing PWA</title>`, ""}<meta name="description" content="A Progressive Web App for geofencing"><!-- HEAD_svelte-1ps6v8r_END -->`, ""} <div class="h-screen flex flex-col"><div class="flex-1 relative">${validate_component(Map, "Map").$$render(
      $$result,
      { map, mapElement, drawnItems },
      {
        map: ($$value) => {
          map = $$value;
          $$settled = false;
        },
        mapElement: ($$value) => {
          mapElement = $$value;
          $$settled = false;
        },
        drawnItems: ($$value) => {
          drawnItems = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="absolute top-4 left-4 z-[1000] space-y-4"><button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" data-svelte-h="svelte-1ooop70">Enable Notifications &amp; Location</button> ${validate_component(GeofenceControls, "GeofenceControls").$$render(
      $$result,
      {
        watching,
        selectedGeofence,
        geofenceName,
        status
      },
      {},
      {}
    )} ${selectedGeofence ? `<div class="bg-white p-4 rounded-lg shadow-lg">${validate_component(GeofenceRename, "GeofenceRename").$$render(
      $$result,
      {
        selectedGeofence,
        geofenceName,
        onRename: handleRename
      },
      {},
      {}
    )}</div>` : ``} ${validate_component(GeofenceList, "GeofenceList").$$render(
      $$result,
      {
        geofences,
        selectedGeofence,
        insideGeofences,
        outsideGeofences,
        onSelect: handleGeofenceSelect,
        onDelete: handleGeofenceDelete
      },
      {},
      {}
    )}</div></div> ${validate_component(Notifications, "Notifications").$$render($$result, { status, notificationPermission }, {}, {})}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
