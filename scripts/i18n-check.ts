import fs from 'node:fs/promises';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');

function flatten(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, p));
    } else {
      out[p] = String(v ?? '');
    }
  }
  return out;
}

async function loadJson(file: string) {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const files = await fs.readdir(localesDir);
  const localeFiles = files.filter(f => f.endsWith('.json'));
  if (!localeFiles.includes('en.json')) {
    console.error('Missing src/locales/en.json');
    process.exit(1);
  }
  const en = await loadJson(path.join(localesDir, 'en.json'));
  const enFlat = flatten(en);

  let hadMissing = false;

  for (const file of localeFiles) {
    if (file === 'en.json') {
      continue;
    }
    const loc = path.basename(file, '.json');
    const data = await loadJson(path.join(localesDir, file));
    const flat = flatten(data);

    const missing = Object.keys(enFlat).filter(k => !(k in flat));
    const extra = Object.keys(flat).filter(k => !(k in enFlat));

    if (missing.length === 0 && extra.length === 0) {
      console.log(`[${loc}] ✅ Up to date`);
      continue;
    }

    hadMissing = hadMissing || missing.length > 0;
    if (missing.length > 0) {
      console.log(`[${loc}] Missing keys (${missing.length}):`);
      for (const k of missing) {
        console.log(` - ${k}`);
      }
    }
    if (extra.length > 0) {
      console.log(`[${loc}] Extra keys not in en.json (${extra.length}):`);
      for (const k of extra) {
        console.log(` - ${k}`);
      }
    }
  }

  if (hadMissing) {
    process.exitCode = 2;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
