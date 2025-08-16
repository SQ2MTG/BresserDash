import React from 'react';

export const ThermometerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9l4 0" />
    </svg>
);

export const DropletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.8 11a6 6 0 1 0 10.396 0l-5.197 -8l-5.197 8z" />
    </svg>
);

export const WindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h8.5a2.5 2.5 0 1 0 -2.34 -3.24" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h15.5a2.5 2.5 0 1 1 -2.34 3.24" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h5.5a2.5 2.5 0 1 1 -2.34 3.24" />
    </svg>
);

export const GaugeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.41 10.59l2.59 -2.59" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12a5 5 0 0 1 5 -5" />
    </svg>
);

export const UmbrellaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 13v2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13v2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19v1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19v1.5" />
    </svg>
);

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m-6.364-2.636l1.591-1.591M5.636 5.636l1.591 1.591M18.364 18.364l-1.591-1.591M18.364 5.636l-1.591 1.591M9 12h6" />
    </svg>
);

export const NavigationArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
    </svg>
);
