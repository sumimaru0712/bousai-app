export type GrowthSpecies =
  | "tori"
  | "neko"
  | "sakana"
  | "inu"
  | "ryu"
  | "saru";

export interface GrowthStage {
  level: number;
  name: string;
  emoji: string;
  minPoints: number;
}

export interface GrowthSpeciesDef {
  id: GrowthSpecies;
  label: string;
  description: string;
  icon: string;
  stages: GrowthStage[];
}

export const GROWTH_SPECIES_LIST: GrowthSpeciesDef[] = [
  {
    id: "tori",
    label: "とり",
    description: "たまごから、でんせつの鳥に育ちます",
    icon: "🥚",
    stages: [
      { level: 1, name: "たまご", emoji: "🥚", minPoints: 0 },
      { level: 2, name: "ひよこ", emoji: "🐣", minPoints: 10 },
      { level: 3, name: "わかどり", emoji: "🐤", minPoints: 30 },
      { level: 4, name: "おとなどり", emoji: "🐓", minPoints: 60 },
      { level: 5, name: "でんせつのぼうさい鳥", emoji: "🦅", minPoints: 100 },
    ],
  },
  {
    id: "neko",
    label: "ねこ",
    description: "こねこから、たのもしいねこに育ちます",
    icon: "🐱",
    stages: [
      { level: 1, name: "こねこ", emoji: "🐱", minPoints: 0 },
      { level: 2, name: "げんきなねこ", emoji: "😺", minPoints: 10 },
      { level: 3, name: "たのもしいねこ", emoji: "😼", minPoints: 30 },
      { level: 4, name: "ぼうさいねこ", emoji: "🐈", minPoints: 60 },
      { level: 5, name: "でんせつのぼうさいねこ", emoji: "🐯", minPoints: 100 },
    ],
  },
  {
    id: "sakana",
    label: "さかな",
    description: "小さな魚から、大きな魚に育ちます",
    icon: "🐟",
    stages: [
      { level: 1, name: "ちいさいさかな", emoji: "🐟", minPoints: 0 },
      { level: 2, name: "げんきなさかな", emoji: "🐠", minPoints: 10 },
      { level: 3, name: "たくましいさかな", emoji: "🐡", minPoints: 30 },
      { level: 4, name: "ぼうさいザメ", emoji: "🦈", minPoints: 60 },
      { level: 5, name: "でんせつのくじら", emoji: "🐳", minPoints: 100 },
    ],
  },
  {
    id: "inu",
    label: "いぬ",
    description: "こいぬから、たのもしい番犬に育ちます",
    icon: "🐶",
    stages: [
      { level: 1, name: "こいぬ", emoji: "🐶", minPoints: 0 },
      { level: 2, name: "げんきないぬ", emoji: "🐕", minPoints: 10 },
      { level: 3, name: "たよれるいぬ", emoji: "🦮", minPoints: 30 },
      { level: 4, name: "ぼうさいいぬ", emoji: "🐕‍🦺", minPoints: 60 },
      { level: 5, name: "でんせつのぼうさいいぬ", emoji: "🐺", minPoints: 100 },
    ],
  },
  {
    id: "ryu",
    label: "りゅう",
    description: "たまごから、でんせつのりゅうに育ちます",
    icon: "🦎",
    stages: [
      { level: 1, name: "とかげのたまご", emoji: "🥚", minPoints: 0 },
      { level: 2, name: "ちいさいとかげ", emoji: "🦎", minPoints: 10 },
      { level: 3, name: "わに", emoji: "🐊", minPoints: 30 },
      { level: 4, name: "きょうりゅう", emoji: "🦖", minPoints: 60 },
      { level: 5, name: "でんせつのりゅう", emoji: "🐉", minPoints: 100 },
    ],
  },
  {
    id: "saru",
    label: "さる",
    description: "こざるから、たのもしいなかまに育ちます",
    icon: "🐵",
    stages: [
      { level: 1, name: "こざる", emoji: "🐵", minPoints: 0 },
      { level: 2, name: "げんきなさる", emoji: "🙈", minPoints: 10 },
      { level: 3, name: "ちからもちのさる", emoji: "🙉", minPoints: 30 },
      { level: 4, name: "たのもしいさる", emoji: "🙊", minPoints: 60 },
      { level: 5, name: "でんせつのゴリラ", emoji: "🦍", minPoints: 100 },
    ],
  },
];

export function getSpeciesDef(species: GrowthSpecies): GrowthSpeciesDef {
  return (
    GROWTH_SPECIES_LIST.find((entry) => entry.id === species) ??
    GROWTH_SPECIES_LIST[0]
  );
}

export function getGrowthStage(
  species: GrowthSpecies,
  points: number
): GrowthStage {
  const stages = getSpeciesDef(species).stages;
  let current = stages[0];
  for (const stage of stages) {
    if (points >= stage.minPoints) current = stage;
  }
  return current;
}

export function getNextGrowthStage(
  species: GrowthSpecies,
  points: number
): GrowthStage | null {
  const current = getGrowthStage(species, points);
  const stages = getSpeciesDef(species).stages;
  return stages.find((stage) => stage.level === current.level + 1) ?? null;
}
