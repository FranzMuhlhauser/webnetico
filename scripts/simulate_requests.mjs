import handler from '../api/contact.js';

function makeRes(name){
  return {
    _status: 200,
    headers: {},
    setHeader(k,v){ this.headers[k]=v },
    status(code){ this._status = code; return this },
    end(){ console.log(`${name} ended with status ${this._status}`); },
    json(obj){ console.log(`${name} json response:`, obj); }
  }
}

global.fetch = async function(url, opts){
  return {
    status: 400,
    statusText: 'Bad Request',
    ok: false,
    text: async ()=>'ERROR: invalid payload or rate limit exceeded',
    headers: { get: ()=> 'text/plain' }
  }
}

async function run(){
  console.log('--- OPTIONS ---');
  const res1 = makeRes('OPTIONS');
  await handler({ method: 'OPTIONS', headers: {}, body: null }, res1);

  console.log('\n--- POST ---');
  const res2 = makeRes('POST');
  await handler({ method: 'POST', headers: { 'content-type': 'application/json' }, body: { name:'T', email:'t@t', subject:'s', urgency:'alta', message:'hola' } }, res2);
}

run().catch(e=>console.error('SIM ERROR',e));
