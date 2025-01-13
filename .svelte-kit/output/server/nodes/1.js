

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BAoySYyV.js","_app/immutable/chunks/scheduler.BK9sRIuk.js","_app/immutable/chunks/index.GVzcZWz8.js","_app/immutable/chunks/entry.1JRC292q.js"];
export const stylesheets = [];
export const fonts = [];
