const NodeCast = require('nodecast-js');
const express = require('express');
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer({ prependPath: false, secure: false, changeOrigin: true });
const { networkInterfaces } = require('os');

let fetch; import('node-fetch').then(r => console.log('f', fetch = r.default));
var parseUrl = require('parseurl');

const app = express();
const port = process.env.PORT || 8001;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

apiProxy.on('proxyReq', function (pr, req, res, opt) {
	if (opt._headers) {
		for (var header in opt._headers) {
			pr.setHeader(header, opt._headers[header])
		}
	}
});

apiProxy.on('error', (err, req, res) => {
	try {
		console.warn(err);
		res.status(500).end();
	} catch (e) {
	}
})

app.get('/captions.vtt', function (req, res) {
	res.header('content-type', 'text/vtt').send('WEBVTT\n\n');
})

app.post('/devices', function (req, res) {
	res.status(200).json(nodeCast.getList());
});

app.post('/play', function (req, res) {
	console.log('ext req', req);

	let url = req.query.url;
	let headers = {};
	try {
		headers = JSON.parse(req.query.headers);
	} catch (e) { }

	const nets = networkInterfaces();
	const localHost = Object.values(nets).flat().find(s => !s.internal && s.family == 'IPv4').address

	const metadata = {
	        title: req.query.title || '',
	        creator: '',
	        type: 'video',
	}

	let proxyUrl = 'http://' + localHost + ':' + port +'/?' + new URLSearchParams({ t: url, h: JSON.stringify(headers) });

	let device = nodeCast.getList().find(d => d.host == req.query.device)

	device.play(proxyUrl, timestamp, { contentType: 'video/x-matroska', metadata, protocolInfo: metadata.protocolInfo, dlnaFeatures: 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000' });

	res.status(200).json({});
})

app.use(function (req, res, next) {
	res.header('transferMode.dlna.org', 'Streaming');
	res.header('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000')
	res.header('realTimeInfo.dlna.org', 'DLNA.ORG_TLAG=*');	

	let target = '' + new URL(req.url, 'http://example.com').searchParams.get('t');
	let headers = {}
	try {
		headers = JSON.parse(new URL(req.url, 'http://example.com').searchParams.get('h'));
	} catch (e) { }

	console.log('proxy test', target, headers);

	req.url = req.originalUrl = target;
	parseUrl(req);

	req._headers = headers;

	// console.log('testy test', req);

	if (!target) return res.status(400).json({ success: false });

	if (req.method == 'HEAD') {
		fetch(target, { method: 'GET', size: 1 }).then(s => {
			res.status(200).set(Object.fromEntries(s.headers.entries())).send();
		});
		return;
	}

	apiProxy.web(req, res, { target, _headers: headers });
});

app.listen(port);

const url = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4';

const timestamp = 0; // in seconds
const nodeCast = new NodeCast();

nodeCast.onDevice(device => {
    device.onError(err => {
	console.log(err);
    });

    // console.log(nodeCast.getList()); // list of currently discovered devices

    if (device.host == '192.168.1.100') {

	global.targetDevice = device;
    }
});

nodeCast.start();

setTimeout(() => {
    nodeCast.destroy(); // destroy nodecast
}, 200000);
