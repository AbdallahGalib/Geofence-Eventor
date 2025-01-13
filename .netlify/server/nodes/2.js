

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DAx29-_a.js","_app/immutable/chunks/scheduler.BK9sRIuk.js","_app/immutable/chunks/index.GVzcZWz8.js","_app/immutable/chunks/leaflet.draw.DF9MwhQm.js"];
export const stylesheets = ["_app/immutable/assets/2.B-B3Vo7K.css","_app/immutable/assets/leaflet.BqL3r-Y5.css"];
export const fonts = [];
