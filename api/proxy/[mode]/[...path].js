export default async function handler(req, res) {
  const mode = req.query.mode === 'internal' ? 'internal' : 'external';
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path || ''];
  const base = mode === 'internal'
    ? 'http://192.168.12.102/api/tp/online'
    : 'http://tgjblad.dyndns.org:1975/api/tp/online';

  const target = new URL(base.replace(/\/$/, '') + '/' + pathParts.filter(Boolean).join('/'));
  const params = new URLSearchParams();
  Object.entries(req.query).forEach(([key, value]) => {
    if (key === 'mode' || key === 'path') return;
    if (Array.isArray(value)) value.forEach(v => params.append(key, v));
    else if (value != null) params.append(key, value);
  });
  if ([...params.keys()].length) target.search = params.toString();

  const headers = {};
  if (req.headers.authorization) headers['authorization'] = req.headers.authorization;
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];

  const method = req.method || 'GET';
  const hasBody = !['GET', 'HEAD'].includes(method);
  const body = hasBody
    ? (typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? req.body
        : JSON.stringify(req.body || {}))
    : undefined;

  try {
    const upstream = await fetch(target.toString(), { method, headers, body });
    const text = await upstream.text();
    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.send(text);
  } catch (err) {
    res.status(502).send('Upstream request failed');
  }
}
