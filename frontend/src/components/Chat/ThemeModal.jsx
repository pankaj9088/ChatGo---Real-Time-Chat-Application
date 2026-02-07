import { FaTimes } from 'react-icons/fa';

const ThemeModal = ({ isOpen, onClose, onSelectTheme }) => {
    if (!isOpen) return null;

    const themes = [
        { name: 'Default', color: '#e5ddd5', darkColor: '#0b141a' },
        { name: 'Blue', color: '#D1E4F3', darkColor: '#1A2633' },
        { name: 'Green', color: '#D4EBDB', darkColor: '#1F2C24' },
        { name: 'Pink', color: '#F3D1E4', darkColor: '#331A26' },
        { name: 'Yellow', color: '#F3EBD1', darkColor: '#332E1A' },
        { name: 'Dark', color: '#1A1A1A', darkColor: '#000000' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 max-w-sm p-4 animate-scale-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Theme</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <FaTimes />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {themes.map((theme) => (
                        <button
                            key={theme.name}
                            onClick={() => {
                                onSelectTheme(theme);
                                onClose();
                            }}
                            className="flex flex-col items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <div
                                className="w-full h-16 rounded border shadow-sm"
                                style={{ backgroundColor: theme.color }}
                            ></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{theme.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeModal;
