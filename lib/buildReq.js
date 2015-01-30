var MockReq = require('mock-req');
var defaultsDeep = require('merge-defaults');

module.exports = function buildReq(_req) {
	_req = _req || {};

	var req;

	if(typeof _req === 'object' && _req.read) {
		req = _req;
	} else {
		// TODO: need to check for undefined or non-string headers ?
		
		var req = new MockReq({
			method: (_req.method && typeof _req.method === 'string') ? _req.method : 'GET',
			headers: (_req.headers)
		});

		if(req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'DELETE') {
			if(req.body) {
				req.write(req.body);
			}

			req.end();
		}
	}

	req = defaultsDeep(req, {
		params: [],
		query: (_req && _req.query) || {},
		body: (_req && _req.body) || {},
		param: function(paramName, defaultValue) {

			var key, params = {};
			for (key in (req.params || {}) ) {
				params[key] = params[key] || req.params[key];
			}
			for (key in (req.query || {}) ) {
				params[key] = params[key] || req.query[key];
			}
			for (key in (req.body || {}) ) {
				params[key] = params[key] || req.body[key];
			}

			// Grab the value of the parameter from the appropriate place
			// and return it
			return params[paramName] || defaultValue;
		},
		wantsJSON: (_req && _req.wantsJSON) || true,
		method: 'GET'
	}, _req||{});

	return req;
};