"use client"; 

const ThemeWrapper = ({ children }) => {
    return (
        <div className="bg-white text-black dark:bg-gray-900 dark:text-white">
            {children}
        </div>
    );
};

export default ThemeWrapper;