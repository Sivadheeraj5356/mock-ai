"use client"; 

import { useTheme } from "next-themes";

const ThemeWrapper = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className={`bg-white text-black dark:text-white ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
            {children}
        </div>
    );
};

export default ThemeWrapper;