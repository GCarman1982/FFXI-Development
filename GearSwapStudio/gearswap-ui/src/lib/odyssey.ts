export const ODYSSEY_WHITELIST = {
  A1: ["hesperiidae", "epitaph", "neo animator", "coiste bodhar"],
  A2: ["acrontica", "beithir ring", "tsuru", "schere earring", "tellen belt", "obstinate sash"],
  A3: ["ikenga", "kunimitsu", "gleti", "gekkei", "sakpata", "agwu", "bunzi", "mpaca"],
  A4: ["nyame"]
} as const;

export const ALL_PATH_ITEMS = Object.values(ODYSSEY_WHITELIST).flat();

export const isOdysseyItem = (name: string) =>
  ALL_PATH_ITEMS.some(item => name.toLowerCase().includes(item));