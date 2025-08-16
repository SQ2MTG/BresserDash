import React from 'react';

interface WeatherCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    unit: string;
    children?: React.ReactNode;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ icon, title, value, unit, children }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-between transition-colors hover:border-cyan-400/50">
            <div>
                <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-lg font-medium">{title}</span>
                    <div className="w-8 h-8">{icon}</div>
                </div>
                <div className="flex items-end space-x-2">
                    <span className="text-5xl font-bold text-white">{value}</span>
                    <span className="text-xl text-slate-300 pb-1">{unit}</span>
                </div>
            </div>
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
};

export default React.memo(WeatherCard);
