import fs from 'fs';
import path from 'path';

// FFXI Slot Bitmask definitions found in your data
const SLOT_MAP = {
  1: "main",
  2: "sub",
  4: "range",
  8: "ammo",
  16: "head",
  32: "body",
  64: "hands",
  128: "legs",
  256: "feet",
  512: "neck",
  1024: "waist",
  2048: "ear1",
  4096: "ear2",
  8192: "ring1",
  16384: "ring2",
  32768: "back"
};

function processGear() {
  console.log("Starting gear processing...");

  try {
    // 1. Load your raw data files
    const armor = JSON.parse(fs.readFileSync('./armor_accessories.json', 'utf8'));
    const weapons = JSON.parse(fs.readFileSync('./weapon.json', 'utf8'));
    
    const allItems = [...armor, ...weapons];
    const categorized = {};

    // 2. Map items to their respective slots
    allItems.forEach(item => {
      Object.entries(SLOT_MAP).forEach(([bit, slotName]) => {
        if (item.slots & parseInt(bit)) {
          if (!categorized[slotName]) categorized[slotName] = [];
          
          // Use 'en' for English name
          categorized[slotName].push(item.en);
          
          // Ensure items that fit in one earring/ring slot appear in both
          if (slotName === "ear1") (categorized["ear2"] = categorized["ear2"] || []).push(item.en);
          if (slotName === "ring1") (categorized["ring2"] = categorized["ring2"] || []).push(item.en);
        }
      });
    });

    // 3. Clean up: Remove duplicates and sort alphabetically
    for (const slot in categorized) {
      categorized[slot] = [...new Set(categorized[slot])].sort();
      console.log(`Processed ${categorized[slot].length} items for ${slot}`);
    }

    // 4. Save the optimized file to your data folder
    const outputPath = './src/data/items.json';
    
    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(outputPath, JSON.stringify(categorized, null, 2));
    console.log(`\nSuccess! Optimized data saved to ${outputPath}`);

  } catch (error) {
    console.error("Error processing gear:", error.message);
    console.log("\nMake sure armor_accessories.json and weapon.json are in your project root.");
  }
}

processGear();