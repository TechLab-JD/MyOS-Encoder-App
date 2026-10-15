// MyOS Encoders — Base64 / URL / Hex / HTML-entity encode & decode. Pure static.
(function () {
  var inEl = document.getElementById('en-in');
  if (!inEl) return;
  var outEl = document.getElementById('en-out');
  var modeEl = document.getElementById('en-mode');
  var msg = document.getElementById('en-msg');

  function note(t, err) { msg.textContent = t || ''; msg.className = err ? 'err' : ''; }

  var te = new TextEncoder();
  var td = new TextDecoder();

  function b64enc(s) {
    var bytes = te.encode(s), bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64dec(s) {
    var bin = atob(s.replace(/\s+/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return td.decode(bytes);
  }
  function hexenc(s) {
    var bytes = te.encode(s), out = '';
    for (var i = 0; i < bytes.length; i++) out += ('0' + bytes[i].toString(16)).slice(-2);
    return out;
  }
  function hexdec(s) {
    var h = s.replace(/[^0-9a-fA-F]/g, '');
    if (h.length % 2) throw new Error('odd hex length');
    var bytes = new Uint8Array(h.length / 2);
    for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(h.substr(i * 2, 2), 16);
    return td.decode(bytes);
  }
  var HMAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function htmlenc(s) { return s.replace(/[&<>"']/g, function (c) { return HMAP[c]; }); }
  function htmldec(s) {
    var ta = document.createElement('textarea'); ta.innerHTML = s; return ta.value;
  }

  var ENC = { base64: b64enc, url: encodeURIComponent, hex: hexenc, html: htmlenc };
  var DEC = { base64: b64dec, url: decodeURIComponent, hex: hexdec, html: htmldec };

  function run(enc) {
    var m = modeEl.value;
    try {
      outEl.value = (enc ? ENC[m] : DEC[m])(inEl.value);
      note((enc ? 'Encoded' : 'Decoded') + ' as ' + m + ' • ' + outEl.value.length + ' chars');
    } catch (e) {
      outEl.value = '';
      note('Could not ' + (enc ? 'encode' : 'decode') + ' as ' + m + ' — check the input.', true);
    }
  }

  document.getElementById('en-enc').onclick = function () { run(true); };
  document.getElementById('en-dec').onclick = function () { run(false); };
  document.getElementById('en-swap').onclick = function () {
    inEl.value = outEl.value; outEl.value = ''; note('Output moved to input.'); inEl.focus();
  };
  document.getElementById('en-copy').onclick = function () {
    if (!outEl.value) return;
    outEl.select();
    try { if (navigator.clipboard) navigator.clipboard.writeText(outEl.value); else document.execCommand('copy'); note('Copied to clipboard.'); }
    catch (e) { document.execCommand('copy'); note('Copied.'); }
  };
})();
