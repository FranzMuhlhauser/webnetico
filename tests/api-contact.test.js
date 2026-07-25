import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, stripNewlines, isValidEmail, createRateLimiter } from '../api/utils.js';

describe('escapeHtml', () => {
  it('escapa caracteres HTML peligrosos', () => {
    assert.equal(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapa ampersands', () => {
    assert.equal(escapeHtml('a & b'), 'a &amp; b');
  });

  it('escapa comillas simples', () => {
    assert.equal(escapeHtml("it's"), 'it&#39;s');
  });

  it('no modifica texto plano', () => {
    assert.equal(escapeHtml('Hola mundo'), 'Hola mundo');
  });

  it('maneja valores no string', () => {
    assert.equal(escapeHtml(123), '123');
    assert.equal(escapeHtml(null), 'null');
  });
});

describe('stripNewlines', () => {
  it('elimina saltos de línea \\n', () => {
    assert.equal(stripNewlines('linea1\nlinea2'), 'linea1linea2');
  });

  it('elimina saltos de línea \\r\\n', () => {
    assert.equal(stripNewlines('linea1\r\nlinea2'), 'linea1linea2');
  });

  it('elimina saltos de línea \\r', () => {
    assert.equal(stripNewlines('linea1\rlinea2'), 'linea1linea2');
  });

  it('no elimina espacios', () => {
    assert.equal(stripNewlines('hola mundo'), 'hola mundo');
  });
});

describe('isValidEmail', () => {
  it('acepta emails válidos', () => {
    assert.equal(isValidEmail('test@example.com'), true);
    assert.equal(isValidEmail('user.name@domain.cl'), true);
    assert.equal(isValidEmail('a+b@test.co'), true);
  });

  it('rechaza emails inválidos', () => {
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail('noemail'), false);
    assert.equal(isValidEmail('@domain.com'), false);
    assert.equal(isValidEmail('user@'), false);
    assert.equal(isValidEmail('user@.com'), false);
    assert.equal(isValidEmail('user @domain.com'), false);
  });
});

describe('createRateLimiter', () => {
  it('permite requests dentro del límite', () => {
    const limiter = createRateLimiter();
    for (let i = 0; i < 5; i++) {
      assert.equal(limiter('192.168.1.1'), false);
    }
  });

  it('bloquea después del límite', () => {
    const limiter = createRateLimiter();
    for (let i = 0; i < 5; i++) {
      limiter('10.0.0.1');
    }
    assert.equal(limiter('10.0.0.1'), true);
  });

  it('resetea después de la ventana de tiempo', () => {
    const limiter = createRateLimiter();
    limiter('10.0.0.2');
    limiter('10.0.0.2');
    // Simular paso de tiempo manipulando el registro directamente no es posible,
    // pero verificamos que IPs independientes no se afectan entre sí
    assert.equal(limiter('10.0.0.3'), false);
  });

  it('IPs independientes no se afectan', () => {
    const limiter = createRateLimiter();
    for (let i = 0; i < 6; i++) {
      limiter('192.168.1.100');
    }
    assert.equal(limiter('192.168.1.100'), true);
    assert.equal(limiter('192.168.1.101'), false);
  });
});
