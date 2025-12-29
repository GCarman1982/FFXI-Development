export interface GearSet {
  [slot: string]: string;
}

export interface AllSets {
  [setName: string]: GearSet;
}

export interface ImportLog {
  status: 'success' | 'warning' | 'error';
  message: string;
  path?: string;
}

export interface ParseResult {
  sets: AllSets;
  logs: ImportLog[];
}

export const parseLuaToSets = (luaText: string): ParseResult => {
  const sets: AllSets = {};
  const logs: ImportLog[] = [];

  // 1. Remove comments but keep lines intact to preserve character positions
  const cleanLua = luaText.replace(/--.*$/gm, (match) => " ".repeat(match.length));

  const instructions: Record<string, { type: 'table' | 'pointer', data: any, base?: string }> = {};

  try {
    // This regex identifies the path (sets.etc) and the assignment
    const setStartRegex = /sets(?:\.[\w\d_]+|(?:\s*\[\s*['"][^'"]+['"]\s*\]))+\s*=\s*/g;

    let match;
    while ((match = setStartRegex.exec(cleanLua)) !== null) {
      const fullMatch = match[0].replace(/\s*=\s*$/, '').trim();
      const path = fullMatch.replace(/^sets\s*\.\s*/, '').replace(/^sets/, '').trim();
      const startIndex = setStartRegex.lastIndex;
      const remainingText = cleanLua.substring(startIndex).trim();

      // Check for pointers (e.g., sets.A = sets.B)
      const pointerMatch = remainingText.match(/^sets(?:\.[\w\d_]+|(?:\s*\[\s*['"][^'"]+['"]\s*\]))+(?!\s*\(?\s*\{)/);
      if (pointerMatch && !pointerMatch[0].includes('{')) {
        const sourcePath = pointerMatch[0].replace(/^sets\s*\.\s*/, '').replace(/^sets/, '').trim();
        instructions[path] = { type: 'pointer', data: sourcePath };
        setStartRegex.lastIndex = startIndex + pointerMatch[0].length;
        continue;
      }

      // Find the specific { ... } block for THIS assignment
      const braceStartIndex = cleanLua.indexOf('{', startIndex);
      if (braceStartIndex !== -1) {
        let depth = 0;
        let braceEndIndex = -1;
        for (let i = braceStartIndex; i < cleanLua.length; i++) {
          if (cleanLua[i] === '{') depth++;
          else if (cleanLua[i] === '}') depth--;
          if (depth === 0) {
            braceEndIndex = i;
            break;
          }
        }

        if (braceEndIndex !== -1) {
          // CAPTURE ONLY WHAT IS INSIDE THESE SPECIFIC BRACES
          const setContent = cleanLua.substring(braceStartIndex + 1, braceEndIndex);
          
          // Check for explicit set_combine
          const combineMatch = cleanLua.substring(startIndex, braceStartIndex).match(/set_combine\s*\(\s*(sets(?:\.[\w\d_]+|(?:\s*\[\s*['"][^'"]+['"]\s*\]))+)\s*,\s*/);
          const basePath = combineMatch ? combineMatch[1].replace(/^sets\s*\.\s*/, '').replace(/^sets/, '').trim() : undefined;

          instructions[path] = { type: 'table', data: setContent, base: basePath };
          setStartRegex.lastIndex = braceEndIndex;
        }
      }
    }

    const resolveGear = (path: string, visited = new Set<string>()): GearSet => {
      if (visited.has(path)) return {};
      visited.add(path);

      const instr = instructions[path];
      if (!instr) return {};
      if (instr.type === 'pointer') return resolveGear(instr.data, visited);

      // NO AUTOMATIC INHERITANCE. 
      // Only merge if set_combine was written in the Lua for this specific set.
      let gear: GearSet = {};
      if (instr.base) {
        gear = { ...resolveGear(instr.base, visited) };
      }

      // Strictly find "slot = item" patterns
      // Support for: slot="Item", slot='Item', slot={name="Item"}, slot=empty
      const slotRegex = /([\w\d_]+)\s*=\s*(?:\{[^}]*?name\s*=\s*(["'])(.*?)\2|(["'])(.*?)\4|([\w\d\._\-\+]+))/g;
      
      const slotMap: Record<string, string> = {
        left_ear: "ear1", right_ear: "ear2",
        left_ring: "ring1", right_ring: "ring2"
      };

      let itemMatch;
      while ((itemMatch = slotRegex.exec(instr.data)) !== null) {
        const rawSlot = itemMatch[1].toLowerCase();
        // Skip 'name' because it's part of the Gearswap {name="Item"} syntax, not a slot
        if (rawSlot === 'name') continue;

        const slot = slotMap[rawSlot] || rawSlot;
        const itemName = itemMatch[3] || itemMatch[5] || itemMatch[6];

        if (slot && itemName) {
          const finalItem = itemName.trim();
          if (finalItem === 'empty' || finalItem === 'nil') {
            delete gear[slot];
          } else {
            // Apostrophes in itemMatch[3] and [5] are preserved exactly
            gear[slot] = finalItem;
          }
        }
      }
      return gear;
    };

    Object.keys(instructions).forEach(path => {
      sets[path] = resolveGear(path);
    });

  } catch (err: any) {
    logs.push({ status: 'error', message: err.message });
  }

  return { sets, logs };
};