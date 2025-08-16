import React from 'react';
import { WindIcon, CompassIcon, NavigationArrowIcon } from './icons/WeatherIcons';

interface WindCardProps {
    speed: number;
    direction: number;
}

const getWindDirectionAbbreviation = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
};

const WindCard: React.FC<WindCardProps> = ({ speed, direction }) => {
    const directionAbbr = getWindDirectionAbbreviation(direction);

    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-between transition-colors hover:border-cyan-400/50">
             <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-lg font-medium">Wiatr</span>
                <div className="w-8 h-8"><WindIcon /></div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div>
                     <div className="flex items-end space-x-2">
                        <span className="text-5xl font-bold text-white">{speed.toFixed(1)}</span>
                        <span className="text-xl text-slate-300 pb-1">km/h</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 mt-1">
                        <CompassIcon className="w-5 h-5"/>
                        <span>{directionAbbr} ({direction}°)</span>
                    </div>
                </div>
                <div className="flex-shrink-0 w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center">
                    <NavigationArrowIcon
                        className="w-10 h-10 text-cyan-400 transition-transform duration-500"
                        style={{ transform: `rotate(${direction}deg)` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(WindCard);
