export const checkPassing = (techniqueScore: number, defenseScore: number) => {
    const defensiveRatio = defenseScore / (techniqueScore + defenseScore);
    return Math.random() < defensiveRatio ? 0 : 1;
};
