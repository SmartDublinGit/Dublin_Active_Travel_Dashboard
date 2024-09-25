import * as server from '../entries/pages/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.39f797e3.js","_app/immutable/chunks/scheduler.ebeace2f.js","_app/immutable/chunks/index.42fb1a3d.js","_app/immutable/chunks/index.e813bca0.js"];
export const stylesheets = ["_app/immutable/assets/2.c5d83044.css"];
export const fonts = [];
