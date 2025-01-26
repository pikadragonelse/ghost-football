import clsx from "clsx";
import { PassingTech } from "../model/passing-tech";

export type Player = {
    id: number;
    name: string;
    number: number;
    defenseScore: number;
    passingTechs: PassingTech[];
    isDefense?: boolean;
    isHolding?: boolean;
    ratingScore?: number;
    defenseIndex?: number;
    passingTechSuccessfulScore?: number;
    isDefensedInRound?: boolean;
    isOutRound?: boolean;
};
export const Player = ({
    name,
    number,
    defenseScore,
    passingTechs,
    isDefense,
}: Player) => {
    return (
        <div
            className={clsx("text-center", {
                "bg-green-600 text-white": isDefense,
            })}
        >
            <div className="">
                <p className="text-lg">{name}</p>
                <p className="font-medium">{number}</p>
            </div>
            <div className="">
                <p>Defense Score: {defenseScore}</p>
                <ul className="text-left mt-2">
                    <h2 className="font-medium">Technique:</h2>
                    {passingTechs.map((tech, index) => (
                        <li key={index}>
                            {tech.name}-{tech.techniqueScore}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
