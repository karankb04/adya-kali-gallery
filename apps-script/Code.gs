/**
 * Maa Adya Kali Gallery — digital-asset metadata backend (Google Apps Script).
 *
 * This script turns a Google Sheet into the SINGLE SOURCE OF TRUTH for every
 * image's metadata + SEO fields, and serves it to the Next.js site as JSON.
 *
 * SETUP (see docs/GOOGLE-SHEET-SETUP.md):
 *   1. Create a Google Sheet with a tab named "Images" and the header row below.
 *   2. Extensions > Apps Script, paste this file, Save.
 *   3. Deploy > New deployment > Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the /exec URL → set it as IMAGES_API_URL in the site's env vars.
 *
 * The Next.js site reads this every ~60s (ISR), so Sheet edits go live within a
 * minute with no redeploy.
 */

// ---- configuration ----
var SHEET_NAME = 'Images';
var R2_BASE_URL = 'https://pub-e4d48761fb3344af9a75e599e68d03f1.r2.dev';

// Column headers (row 1 of the sheet). Order does not matter — looked up by name.
var HEADERS = [
  'id', 'r2Key', 'active',
  'nameDevanagari', 'transliteration', 'form', 'teachingCaption', 'isAI',
  'altText', 'slug', 'description', 'tags',
  'creditText', 'creator', 'license', 'acquireLicensePage',
  'dateCreated', 'order', 'width', 'height', 'dominantColor'
];

var BOOL_FIELDS = ['isAI', 'active'];
var NUM_FIELDS = ['order', 'width', 'height'];

// =====================================================================
//  Web App entry point — serves the image list as JSON
// =====================================================================
function doGet(e) {
  try {
    var images = readImages_();
    return json_({ images: images, count: images.length, updated: new Date().toISOString() });
  } catch (err) {
    return json_({ error: String(err), images: [] });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================================
//  Read + map the sheet into clean objects
// =====================================================================
function readImages_() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet tab "' + SHEET_NAME + '" not found');

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  var header = values[0].map(function (h) { return String(h).trim(); });
  var idx = {};
  header.forEach(function (h, i) { idx[h] = i; });

  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var get = function (field) {
      return idx[field] === undefined ? '' : row[idx[field]];
    };

    var r2Key = String(get('r2Key')).trim();
    if (!r2Key) continue; // skip empty rows

    // "active" defaults to TRUE unless explicitly set to a falsey value
    var activeRaw = get('active');
    var active = activeRaw === '' ? true : toBool_(activeRaw);
    if (!active) continue;

    var obj = {};
    HEADERS.forEach(function (field) {
      if (field === 'active') return; // internal only, not exported
      var val = get(field);
      if (BOOL_FIELDS.indexOf(field) >= 0) {
        obj[field] = toBool_(val);
      } else if (NUM_FIELDS.indexOf(field) >= 0) {
        var n = Number(val);
        if (val !== '' && !isNaN(n)) obj[field] = n;
      } else if (field === 'dateCreated' && val instanceof Date) {
        obj[field] = Utilities.formatDate(val, 'UTC', "yyyy-MM-dd");
      } else {
        var s = String(val).trim();
        if (s) obj[field] = s;
      }
    });

    out.push(obj);
  }
  return out;
}

function toBool_(v) {
  if (v === true) return true;
  if (v === false || v === '' || v === null || v === undefined) return false;
  var s = String(v).trim().toLowerCase();
  return s === 'true' || s === 'yes' || s === 'y' || s === '1' || s === 'ai';
}

function r2url_(key) {
  return R2_BASE_URL + '/' + String(key).split('/').map(encodeURIComponent).join('/');
}

// =====================================================================
//  Spreadsheet menu — helper utilities
// =====================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Adya Kali')
    .addItem('Fill missing slugs', 'fillSlugs')
    .addItem('Fetch image dimensions (selected/all)', 'fetchDimensions')
    .addItem('Validate rows', 'validateRows')
    .addToUi();
}

function colIndex_(sheet, name) {
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim(); });
  var i = header.indexOf(name);
  return i < 0 ? -1 : i + 1; // 1-based, -1 if missing
}

function slugify_(s) {
  return String(s || '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

function fillSlugs() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  var slugCol = colIndex_(sheet, 'slug');
  var trCol = colIndex_(sheet, 'transliteration');
  var formCol = colIndex_(sheet, 'form');
  if (slugCol < 0) { alert_('No "slug" column found.'); return; }

  var last = sheet.getLastRow();
  var count = 0;
  for (var r = 2; r <= last; r++) {
    var current = sheet.getRange(r, slugCol).getValue();
    if (String(current).trim()) continue;
    var tr = trCol > 0 ? sheet.getRange(r, trCol).getValue() : '';
    var form = formCol > 0 ? sheet.getRange(r, formCol).getValue() : '';
    var slug = slugify_(tr + '-' + form);
    if (slug) { sheet.getRange(r, slugCol).setValue(slug); count++; }
  }
  alert_('Filled ' + count + ' slug(s).');
}

function validateRows() {
  var images = readImages_();
  var problems = [];
  var ids = {};
  images.forEach(function (p, i) {
    var label = p.id || ('row ' + (i + 2));
    if (!p.id) problems.push(label + ': missing id');
    if (p.id && ids[p.id]) problems.push(p.id + ': duplicate id');
    ids[p.id] = true;
    if (!p.r2Key) problems.push(label + ': missing r2Key');
    if (!p.transliteration) problems.push(label + ': missing transliteration');
    if (!p.form) problems.push(label + ': missing form');
  });
  alert_(problems.length ? ('Issues:\n- ' + problems.join('\n- ')) : 'All ' + images.length + ' active rows look good.');
}

/**
 * Fetches each image (first 256KB via Range) and writes width/height back.
 * Parses PNG and JPEG headers natively. Runs on the selected rows, or all rows
 * if only the header is selected.
 */
function fetchDimensions() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  var r2Col = colIndex_(sheet, 'r2Key');
  var wCol = colIndex_(sheet, 'width');
  var hCol = colIndex_(sheet, 'height');
  if (r2Col < 0 || wCol < 0 || hCol < 0) { alert_('Need r2Key, width, height columns.'); return; }

  var sel = sheet.getActiveRange();
  var startRow = Math.max(2, sel.getRow());
  var endRow = sel.getRow() === 1 ? sheet.getLastRow() : sel.getLastRow();
  if (startRow > endRow) endRow = sheet.getLastRow();

  var done = 0, failed = 0;
  for (var r = startRow; r <= endRow; r++) {
    var key = String(sheet.getRange(r, r2Col).getValue()).trim();
    if (!key) continue;
    try {
      var resp = UrlFetchApp.fetch(r2url_(key), {
        muteHttpExceptions: true,
        headers: { Range: 'bytes=0-262143' }
      });
      var bytes = resp.getContent();
      var size = imageSize_(bytes);
      if (size) {
        sheet.getRange(r, wCol).setValue(size.w);
        sheet.getRange(r, hCol).setValue(size.h);
        done++;
      } else { failed++; }
    } catch (err) { failed++; }
  }
  alert_('Dimensions updated: ' + done + '  •  failed/unknown: ' + failed);
}

/** Parse PNG / JPEG dimensions from raw bytes (signed byte[] from Apps Script). */
function imageSize_(bytes) {
  function u(i) { return bytes[i] & 0xff; }
  // PNG: 89 50 4E 47 ... IHDR width@16, height@20 (big-endian)
  if (bytes.length > 24 && u(0) === 0x89 && u(1) === 0x50 && u(2) === 0x4E && u(3) === 0x47) {
    return {
      w: (u(16) << 24) | (u(17) << 16) | (u(18) << 8) | u(19),
      h: (u(20) << 24) | (u(21) << 16) | (u(22) << 8) | u(23)
    };
  }
  // JPEG: scan SOF markers
  if (bytes.length > 4 && u(0) === 0xFF && u(1) === 0xD8) {
    var i = 2;
    while (i < bytes.length - 8) {
      if (u(i) !== 0xFF) { i++; continue; }
      var marker = u(i + 1);
      // SOF0-SOF15 (excluding DHT C4, JPG C8, DAC CC)
      if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
        return { h: (u(i + 5) << 8) | u(i + 6), w: (u(i + 7) << 8) | u(i + 8) };
      }
      var len = (u(i + 2) << 8) | u(i + 3);
      if (len <= 0) break;
      i += 2 + len;
    }
  }
  return null;
}

function alert_(msg) { SpreadsheetApp.getUi().alert(msg); }
