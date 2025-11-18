import React from 'react';
import { ElementData } from '../types';

interface BohrDiagramProps {
  element: ElementData;
}

const BohrDiagram: React.FC<BohrDiagramProps> = ({ element }) => {
  const SIZE = 500;
  const CENTER = SIZE / 2;
  const NUCLEUS_RADIUS = Math.max(30, element.atomicNumber / 3.5);
  const SHELL_SPACING = (CENTER - NUCLEUS_RADIUS - 20) / Math.max(1, element.shells.length);
  const ELECTRON_RADIUS = 5;

  const NUCLEUS_FADE_IN_DELAY = 100;
  const SHELL_DRAW_DURATION = 800;
  const SHELL_DRAW_STAGGER = 250;
  const ELECTRON_FADE_DELAY_OFFSET = SHELL_DRAW_DURATION - 200; // Start fading in before shell is fully drawn
  const ELECTRON_FADE_STAGGER = 40;
  const TEXT_FADE_IN_DELAY = NUCLEUS_FADE_IN_DELAY + (element.shells.length * SHELL_DRAW_STAGGER);


  return (
    <div className="w-full max-w-lg aspect-square">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label={`Bohr diagram for ${element.name}`}>
            {/* Shells */}
            {element.shells.map((_, i) => {
                const radius = NUCLEUS_RADIUS + SHELL_SPACING * (i + 1);
                const circumference = 2 * Math.PI * radius;
                return (
                    <circle
                        key={`shell-${i}`}
                        cx={CENTER}
                        cy={CENTER}
                        r={radius}
                        fill="none"
                        className="stroke-gray-300 dark:stroke-gray-600 shell-draw-anim"
                        strokeWidth="1"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        style={{ animationDelay: `${NUCLEUS_FADE_IN_DELAY + (i * SHELL_DRAW_STAGGER)}ms` }}
                    />
                );
            })}

            {/* Electrons */}
            {element.shells.map((electronCount, shellIndex) => {
                const shellRadius = NUCLEUS_RADIUS + SHELL_SPACING * (shellIndex + 1);
                const electrons = [];
                const electronAnimationBaseDelay = NUCLEUS_FADE_IN_DELAY + (shellIndex * SHELL_DRAW_STAGGER) + ELECTRON_FADE_DELAY_OFFSET;

                for (let i = 0; i < electronCount; i++) {
                    const angle = (2 * Math.PI / electronCount) * i;
                    const cx = CENTER + shellRadius * Math.cos(angle);
                    const cy = CENTER + shellRadius * Math.sin(angle);
                    electrons.push(
                        <circle
                            key={`electron-${shellIndex}-${i}`}
                            cx={cx}
                            cy={cy}
                            r={ELECTRON_RADIUS}
                            className="fill-blue-500 dark:fill-blue-400 fade-in-anim"
                            style={{ animationDelay: `${electronAnimationBaseDelay + (i * ELECTRON_FADE_STAGGER)}ms` }}
                        />
                    );
                }
                return <g key={`shell-group-${shellIndex}`}>{electrons}</g>;
            })}

            {/* Nucleus */}
             <g className="fade-in-anim" style={{ animationDelay: `${NUCLEUS_FADE_IN_DELAY}ms`}}>
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={NUCLEUS_RADIUS}
                    className="fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500"
                    strokeWidth="2"
                />
                <text
                    x={CENTER}
                    y={CENTER}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-gray-900 dark:fill-gray-100 select-none"
                    style={{ fontSize: Math.max(16, NUCLEUS_RADIUS / 2) }}
                    fontWeight="bold"
                >
                    {element.symbol}
                </text>
                <text
                    x={CENTER}
                    y={CENTER + NUCLEUS_RADIUS * 0.5 + 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-gray-700 dark:fill-gray-300 select-none"
                    style={{ fontSize: Math.max(10, NUCLEUS_RADIUS / 3.5)}}
                >
                    P: {element.atomicNumber}
                </text>
            </g>
        </svg>
        <h2 
            className="text-center text-3xl font-bold mt-4 text-gray-900 dark:text-white fade-in-anim"
            style={{ animationDelay: `${TEXT_FADE_IN_DELAY}ms` }}
        >
            {element.name}
        </h2>
        <p 
            className="text-center text-md text-gray-600 dark:text-gray-400 mt-1 fade-in-anim"
            style={{ animationDelay: `${TEXT_FADE_IN_DELAY + 150}ms` }}
        >
            Shells ({element.shells.length}): {element.shells.join(' - ')}
        </p>
    </div>
  );
};

export default BohrDiagram;