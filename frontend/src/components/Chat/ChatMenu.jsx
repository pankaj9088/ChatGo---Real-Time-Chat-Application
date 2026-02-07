import { useState, useEffect, useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const ChatMenu = ({ isOpen, onClose, onAction, position }) => {
    const [showMoreSubmenu, setShowMoreSubmenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const menuItems = [
        { label: 'New group', danger: false },
        { label: 'View contact', danger: false },
        { label: 'Search', danger: false },
        { label: 'Media, links, and docs', danger: false },
        { label: 'Mute notifications', danger: false },
        { label: 'Disappearing messages', danger: false },
        { label: 'Chat theme', danger: false },
        { label: 'More', hasSubmenu: true, danger: false },
    ];

    const moreSubmenuItems = [
        { label: 'Block', danger: true },
        { label: 'Clear chat', danger: true },
        { label: 'Export chat', danger: false },
        { label: 'Add shortcut', danger: false },
    ];

    const handleItemClick = (label, hasSubmenu) => {
        if (hasSubmenu) {
            setShowMoreSubmenu(true);
        } else {
            onAction(label);
            onClose();
        }
    };

    return (
        <div
            ref={menuRef}
            className="absolute z-50 w-56 bg-white dark:bg-[#233138] rounded-md shadow-lg py-2 right-0 top-12 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in"
        >
            {!showMoreSubmenu ? (
                <div className="flex flex-col">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors"
                            onClick={() => handleItemClick(item.label, item.hasSubmenu)}
                        >
                            <span className="text-[15px] text-[#3b4a54] dark:text-[#d1d7db] font-normal">
                                {item.label}
                            </span>
                            {item.hasSubmenu && (
                                <FaChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col animate-fade-in">
                    {moreSubmenuItems.map((item, index) => (
                        <button
                            key={index}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors"
                            onClick={() => handleItemClick(item.label)}
                        >
                            <span className={`text-[15px] font-normal ${item.danger ? 'text-red-500' : 'text-[#3b4a54] dark:text-[#d1d7db]'}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatMenu;
