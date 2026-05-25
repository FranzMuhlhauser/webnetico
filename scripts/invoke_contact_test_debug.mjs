// Test script to invoke handler with DEBUG=1
import handler from '../api/contact.js';

process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 'DUMMY';
process.env.DEBUG = '1';

global.fetch = async function (url, opts) {
  return {
    status: 400,
    statusText: 'Bad Request',
    ok: false,
    text: async () => 'ERROR: invalid payload or rate limit exceeded',
    headers: { get: (h) => 'text/plain' },
  };
};

const req = { method: 'POST', body: { name: 'T', email: 't@t', subject: 's', urgency: 'alta', message: 'm' } };
const res = { _status: 200, status(code) { this._status = code; return this; }, json(obj) { console.log('[HANDLER_OUTPUT_JSON]', JSON.stringify({ status: this._status, body: obj })); } };

handler(req, res).catch(e=>console.error(e));
