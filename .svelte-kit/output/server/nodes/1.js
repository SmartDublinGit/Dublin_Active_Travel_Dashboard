

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.9cff8010.js","_app/immutable/chunks/scheduler.ebeace2f.js","_app/immutable/chunks/index.42fb1a3d.js","_app/immutable/chunks/singletons.790f87c6.js","_app/immutable/chunks/index.e813bca0.js"];
export const stylesheets = [];
export const fonts = [];
