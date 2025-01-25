import React from "react";
import { PassingTech } from "./model/passing-tech";

export type Player = {
    name: string;
    number: number;
    defenseScore: number;
    passingTechs: PassingTech[];
};
export const Player = ({
    name,
    number,
    defenseScore,
    passingTechs,
}: Player) => {
    return (
        <div className="text-center">
            <div className="">
                <p className="text-lg">{name}</p>
                <p className="font-medium">{number}</p>
            </div>
            <div className="">
                <p>Defense Score: {defenseScore}</p>
                <ul>
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
