export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","census_data_total.geojson","census_data_total.json","divisions.geojson","segregated_lanes.geojson","sums.json"]),
	mimeTypes: {".geojson":"application/geo+json",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.2bf8a05c.js","app":"_app/immutable/entry/app.2afefeaa.js","imports":["_app/immutable/entry/start.2bf8a05c.js","_app/immutable/chunks/scheduler.ebeace2f.js","_app/immutable/chunks/singletons.790f87c6.js","_app/immutable/chunks/index.e813bca0.js","_app/immutable/entry/app.2afefeaa.js","_app/immutable/chunks/scheduler.ebeace2f.js","_app/immutable/chunks/index.42fb1a3d.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api",
				pattern: /^\/api\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/_server.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
