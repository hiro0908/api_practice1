import { typeChart } from "@/src/domain/pokemon/typeChart";
function getMultiplier(attack: string, defend: string): number {
  const e = typeChart[attack];
  if (!e) return 1;
  if (e.superEffective.includes(defend)) return 2;
  if (e.notVeryEffective.includes(defend)) return 0.5;
  if (e.noEffect.includes(defend)) return 0;
  return 1;
}

export function calculateTypeEffectiveness(defenderTypes: string[]) {
  const allTypes = Object.keys(typeChart);
  const result: {
    x4: string[];
    x2: string[];
    x0_5: string[];
    x0_25: string[];
    x0: string[];
  } = { x4: [], x2: [], x0_5: [], x0_25: [], x0: [] };
  for (const attack of allTypes) {
    const multiplier = defenderTypes.reduce(
      (acc, d) => acc * getMultiplier(attack, d),
      1,
    );
    if (multiplier === 4) result.x4.push(attack);
    else if (multiplier === 2) result.x2.push(attack);
    else if (multiplier === 0.5) result.x0_5.push(attack);
    else if (multiplier === 0.25) result.x0_25.push(attack);
    else if (multiplier === 0) result.x0.push(attack);
  }
  return result;
}
