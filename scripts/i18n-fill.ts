import fs from 'node:fs/promises';
import path from 'node:path';

const localesDir = path.join(process.cwd(), 'src', 'locales');

function isObject(v: any): v is Record<string, any> {
  return v && typeof v === 'object' && !Array.isArray(v);
}

async function loadJson(file: string) {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
}

async function saveJson(file: string, data: any) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(file, content, 'utf8');
}

function fillMissing(en: any, target: any): { filled: any; added: string[] } {
  const added: string[] = [];
  function walk(e: any, t: any, pathParts: string[] = []) {
    for (const key of Object.keys(e)) {
      const p = [...pathParts, key];
      if (isObject(e[key])) {
        t[key] = isObject(t[key]) ? t[key] : {};
        walk(e[key], t[key], p);
      } else {
        if (!(key in t)) {
          t[key] = String(e[key]); // copy English string
          added.push(p.join('.'));
        }
      }
    }
  }
  const clone = isObject(target) ? JSON.parse(JSON.stringify(target)) : {};
  walk(en, clone);
  return { filled: clone, added };
}

async function main() {
  const files = await fs.readdir(localesDir);
  const localeFiles = files.filter(f => f.endsWith('.json'));
  if (!localeFiles.includes('en.json')) {
    console.error('Missing src/locales/en.json');
    process.exit(1);
  }

  const en = await loadJson(path.join(localesDir, 'en.json'));

  for (const file of localeFiles) {
    if (file === 'en.json') {
      continue;
    }
    const loc = path.basename(file, '.json');
    const current = await loadJson(path.join(localesDir, file));
    const { filled, added } = fillMissing(en, current);
    if (added.length > 0) {
      await saveJson(path.join(localesDir, file), filled);
      console.log(`[${loc}] Added ${added.length} placeholders:`);
      for (const k of added) {
        console.log(` - ${k}`);
      }
    } else {
      console.log(`[${loc}] ✅ No missing keys`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
