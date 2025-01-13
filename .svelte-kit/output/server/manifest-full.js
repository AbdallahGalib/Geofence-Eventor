export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico","favicon.png","manifest.json","_redirects","service-worker.js"]),
	mimeTypes: {".png":"image/png",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.BgAVODna.js","app":"_app/immutable/entry/app.DgQEkxXp.js","imports":["_app/immutable/entry/start.BgAVODna.js","_app/immutable/chunks/entry.1JRC292q.js","_app/immutable/chunks/scheduler.BK9sRIuk.js","_app/immutable/entry/app.DgQEkxXp.js","_app/immutable/chunks/scheduler.BK9sRIuk.js","_app/immutable/chunks/index.GVzcZWz8.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
