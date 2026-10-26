import assert from 'node:assert/strict';
import test from 'node:test';
import {
  InvalidRequestEncodingError,
  RequestTooLargeError,
  readBoundedRequestText,
} from '../src/lib/bounded-request.mjs';

const encoder = new TextEncoder();
function body(chunks, headers = {}) {
  let cancelled = false;
  let reads = 0;
  const stream = new ReadableStream({
    pull(controller) {
      reads++;
      if (chunks.length) controller.enqueue(chunks.shift());
      else controller.close();
    },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  return { request: { headers: new Headers(headers), body: stream }, state: () => ({ cancelled, reads }) };
}

test('accepts valid JSON up to the exact byte boundary', async () => {
  const data = body([encoder.encode('{"message":"hola"}')]);
  assert.equal(await readBoundedRequestText(data.request, 18), '{"message":"hola"}');
});

test('handles UTF-8 characters split across byte chunks', async () => {
  const encoded = encoder.encode('¡Hola 🌎!');
  const data = body([encoded.subarray(0, 7), encoded.subarray(7, 9), encoded.subarray(9)]);
  assert.equal(await readBoundedRequestText(data.request, encoded.length), '¡Hola 🌎!');
});

test('rejects oversized streamed bodies even with a forged Content-Length', async () => {
  const data = body([encoder.encode('1234'), encoder.encode('5678'), encoder.encode('9'), encoder.encode('never read')], { 'content-length': '1' });
  await assert.rejects(readBoundedRequestText(data.request, 8), RequestTooLargeError);
  assert.equal(data.state().cancelled, true);
  assert.equal(data.state().reads, 3);
});

test('rejects oversized declared Content-Length before reading', async () => {
  const data = body([encoder.encode('x')], { 'content-length': '999999' });
  await assert.rejects(readBoundedRequestText(data.request, 8), RequestTooLargeError);
  assert.equal(data.state().reads, 0);
});

test('rejects invalid UTF-8 and cancels remaining stream', async () => {
  const data = body([Uint8Array.from([0xc3, 0x28]), encoder.encode('ignored')]);
  await assert.rejects(readBoundedRequestText(data.request), InvalidRequestEncodingError);
  assert.equal(data.state().cancelled, true);
});

test('rejects truncated UTF-8 sequences at end of stream', async () => {
  const data = body([Uint8Array.from([0xe2, 0x82])]);
  await assert.rejects(readBoundedRequestText(data.request), InvalidRequestEncodingError);
});

test('handles empty bodies and rejects invalid limits', async () => {
  assert.equal(await readBoundedRequestText({ body: null, headers: new Headers() }), '');
  await assert.rejects(readBoundedRequestText({ body: null }, 0), RangeError);
});
