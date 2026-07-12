/**
 * rtf-to-html.js
 *
 * Converts a limited subset of RTF to HTML.
 *
 * Supports: \pard \qc \qj \ql \qr \fi \fs \line \par \page \pagebb
 *           \b \i \ul \ulnone \strike \super \sub \nosupersub \scaps
 *           \'hh hex escapes, \uN unicode escapes, \~ \- \_ \\ \{ \}
 *           skips font table / stylesheet / doc-info destination groups
 *
 * Does NOT support: tables, lists, colors, multiple fonts per run,
 * embedded images/objects, revision marks, or other destination groups
 * not listed in SKIP_DESTINATIONS below.
 *
 * Usage:
 *   // Browser (script tag, no bundler):
 *   //   <script src="rtf-to-html.js"></script>
 *   //   const html = rtfToHtml(rtfString);
 *
 *   // ES module:
 *   //   import { rtfToHtml } from './rtf-to-html.js';
 *
 *   // Node / CommonJS:
 *   //   const { rtfToHtml } = require('./rtf-to-html.js');
 */

function rtfToHtml(rtf) {
  let i = 0;
  const n = rtf.length;
  const SKIP_DESTINATIONS = new Set([
    'fonttbl','stylesheet','colortbl','info','generator','footnote','header','headerl','headerr','headerf',
    'footer','footerl','footerr','footerf','pict','object','filetbl','listtable','listoverridetable','revtbl',
    'rsidtbl','xmlnstbl','themedata','colorschememapping','latentstyles','panose','datastore','template',
    'operator','author','title','subject','keywords','doccomm','comment','company','category','manager','creatim','revtim'
  ]);

  function freshState() {
    return { align:'left', indent:0, fontSize:null, bold:false, italic:false, underline:false,
             superscript:false, subscript:false, strike:false, smallcaps:false, skip:false };
  }

  let stack = [];
  let cur = freshState();
  let html = '';
  let paraOpen = false;

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function wrapInline(text) {
    let t = escapeHtml(text);
    if (cur.superscript) t = `<sup>${t}</sup>`;
    if (cur.subscript) t = `<sub>${t}</sub>`;
    if (cur.strike) t = `<s>${t}</s>`;
    if (cur.underline) t = `<u>${t}</u>`;
    if (cur.italic) t = `<i>${t}</i>`;
    if (cur.bold) t = `<b>${t}</b>`;
    if (cur.smallcaps) t = `<span style="font-variant:small-caps">${t}</span>`;
    return t;
  }

  function openParagraph() {
    if (paraOpen) return;
    const styles = [`text-align:${cur.align}`];
    if (cur.indent) styles.push(`margin-left:${cur.indent}px`);
    if (cur.fontSize) styles.push(`font-size:${cur.fontSize}`);
    html += `<p style="${styles.join(';')}">`;
    paraOpen = true;
  }

  function closeParagraph() {
    if (paraOpen) { html += '</p>\n'; paraOpen = false; }
  }

  function emitText(text) {
    if (cur.skip || !text) return;
    openParagraph();
    html += wrapInline(text);
  }

  function handleControlWord(word, param) {
    switch (word) {
      case 'par': closeParagraph(); break;
      case 'line': if (!cur.skip) { openParagraph(); html += '<br>'; } break;
      case 'page': case 'pagebb':
        closeParagraph();
        if (!cur.skip) html += '<hr class="page-break">';
        break;
      case 'pard': cur.align = 'left'; cur.indent = 0; cur.fontSize = null; break;
      case 'qc': cur.align = 'center'; break;
      case 'qj': cur.align = 'justify'; break;
      case 'ql': cur.align = 'left'; break;
      case 'qr': cur.align = 'right'; break;
      case 'fi': cur.indent = param ? Math.round(param/15) : 0; break;
      case 'fs': cur.fontSize = param ? (param/2)+'pt' : null; break;
      case 'b': cur.bold = (param === undefined || param !== 0); break;
      case 'i': cur.italic = (param === undefined || param !== 0); break;
      case 'ul': cur.underline = true; break;
      case 'ulnone': cur.underline = false; break;
      case 'super': cur.superscript = true; cur.subscript = false; break;
      case 'sub': cur.subscript = true; cur.superscript = false; break;
      case 'nosupersub': cur.superscript = false; cur.subscript = false; break;
      case 'strike': cur.strike = (param === undefined || param !== 0); break;
      case 'scaps': cur.smallcaps = (param === undefined || param !== 0); break;
      case 'u': {
        if (!cur.skip && param !== undefined) {
          const cp = param < 0 ? 65536 + param : param;
          emitText(String.fromCodePoint(cp));
        }
        break; // note: does not consume the ASCII fallback char that normally follows \uN
      }
      default: break; // ansi, deff, widowctrl, hyphpar, sa, sb, ansicpg, etc. are ignored
    }
  }

  function handleControlSymbol(sym) {
    if (cur.skip) return;
    if (sym === '~') emitText('\u00A0');
    else if (sym === '-') emitText('\u00AD');
    else if (sym === '_') emitText('\u2011');
    else if (sym === '\\') emitText('\\');
    else if (sym === '{') emitText('{');
    else if (sym === '}') emitText('}');
  }

  while (i < n) {
    const ch = rtf[i];

    if (ch === '{') {
      stack.push(cur);
      cur = Object.assign({}, cur);
      i++;
      let j = i, star = false;
      if (rtf[j] === '\\' && rtf[j+1] === '*') { star = true; j += 2; }
      const wm = /^\\([a-zA-Z]+)/.exec(rtf.slice(j));
      if (star || (wm && SKIP_DESTINATIONS.has(wm[1]))) cur.skip = true;
      continue;
    }
    if (ch === '}') {
      cur = stack.pop() || cur;
      i++;
      continue;
    }
    if (ch === '\\') {
      if (rtf[i+1] === "'") {
        const hex = rtf.substr(i+2, 2);
        const code = parseInt(hex, 16);
        if (!isNaN(code)) emitText(String.fromCharCode(code));
        i += 4;
        continue;
      }
      const rest = rtf.slice(i+1);
      const m = /^([a-zA-Z]+)(-?\d+)?(\s)?/.exec(rest);
      if (m && m[1]) {
        const word = m[1];
        const param = m[2] !== undefined ? parseInt(m[2], 10) : undefined;
        i += 1 + m[0].length;
        handleControlWord(word, param);
      } else {
        const sym = rest[0];
        i += 2;
        handleControlSymbol(sym);
      }
      continue;
    }
    if (ch === '\r' || ch === '\n' || ch === '\t') { i++; continue; }

    let j = i;
    while (j < n && rtf[j] !== '\\' && rtf[j] !== '{' && rtf[j] !== '}' && rtf[j] !== '\r' && rtf[j] !== '\n') j++;
    emitText(rtf.slice(i, j));
    i = j;
  }

  closeParagraph();
  return html;
}

// Support both browser global usage and module usage.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rtfToHtml };
}
if (typeof window !== 'undefined') {
  window.rtfToHtml = rtfToHtml;
}