import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    FaUser, FaUsers, FaPhone, FaBookmark, FaCog,
    FaUserPlus, FaQuestionCircle, FaMoon, FaSun,
    FaChevronDown, FaChevronUp, FaPlus, FaCheck, FaSignOutAlt
} from 'react-icons/fa';

const NavigationDrawer = ({ isOpen, onClose, onOpenProfile, onNewGroup }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [isAccountsExpanded, setIsAccountsExpanded] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-80 h-full bg-white dark:bg-dark-panel shadow-2xl flex flex-col animate-slide-in-left">
                {/* Header */}
                <div className="bg-[#5b7cb2] dark:bg-[#233138] p-5 text-white">
                    <div className="flex justify-between items-start mb-4">
                        <img
                            src={user?.avatar || 'https://via.placeholder.com/150'}
                            alt={user?.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white"
                        />
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10">
                            {isDark ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                        </button>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-semibold text-lg">{user?.name}</h3>
                            <p className="text-sm opacity-80">{user?.phone || '+91 8777847695'}</p>
                        </div>
                        <button
                            onClick={() => setIsAccountsExpanded(!isAccountsExpanded)}
                            className={`p-2 transition-transform duration-200 ${isAccountsExpanded ? 'rotate-180' : ''}`}
                        >
                            <FaChevronDown />
                        </button>
                    </div>
                </div>

                {/* Account List (Collapsible) */}
                <div className={`overflow-hidden transition-all duration-300 bg-gray-50 dark:bg-[#182229] ${isAccountsExpanded ? 'max-h-48' : 'max-h-0'}`}>
                    <div className="p-2 space-y-1">
                        {/* Current Account */}
                        <div className="flex items-center gap-3 p-2 rounded hover:bg-black/5 cursor-pointer">
                            <div className="relative">
                                <img
                                    src={user?.avatar || 'https://via.placeholder.com/40'}
                                    className="w-8 h-8 rounded-full opacity-50"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border border-white">
                                    <FaCheck size={8} className="text-white" />
                                </div>
                            </div>
                            <span className="flex-1 text-sm font-medium">{user?.name}</span>
                        </div>

                        {/* Dummy Account - Vedant */}
                        <div className="flex items-center gap-3 p-2 rounded hover:bg-black/5 cursor-pointer opacity-70">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                                V
                            </div>
                            <span className="flex-1 text-sm font-medium">Vedant</span>
                        </div>

                        {/* Add Account */}
                        <div
                            className="flex items-center gap-3 p-2 rounded hover:bg-black/5 cursor-pointer text-primary"
                            onClick={() => {
                                alert('Add Account feature coming soon! You can logout to switch accounts.');
                                logout();
                            }}
                        >
                            <div className="w-8 h-8 rounded-full border border-dashed border-primary flex items-center justify-center">
                                <FaPlus />
                            </div>
                            <span className="flex-1 text-sm font-medium">Add Account</span>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-2">
                    <MenuItem
                        icon={<FaUser />}
                        label="My Profile"
                        onClick={() => {
                            onClose();
                            onOpenProfile();
                        }}
                    />
                    <div className="border-b border-gray-100 dark:border-white/5 my-1"></div>

                    <MenuItem
                        icon={<FaUsers />}
                        label="New Group"
                        onClick={() => {
                            onClose();
                            if (onNewGroup) onNewGroup();
                        }}
                    />
                    <MenuItem icon={<FaUser />} label="Contacts" />
                    <MenuItem icon={<FaPhone />} label="Calls" />
                    <MenuItem icon={<FaBookmark />} label="Saved Messages" />
                    <MenuItem icon={<FaCog />} label="Settings" />

                    <div className="border-b border-gray-100 dark:border-white/5 my-1"></div>

                    <MenuItem icon={<FaUserPlus />} label="Invite Friends" />
                    <MenuItem
                        icon={<FaSignOutAlt />}
                        label="Logout"
                        onClick={async () => {
                            await logout();
                            onClose();
                        }}
                    />
                </div>

                <div className="p-4 text-center text-xs text-gray-400">
                    ChatGo v1.0
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-6 px-6 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
    >
        <span className="text-xl opacity-70 w-6 flex justify-center">{icon}</span>
        <span className="font-medium text-[15px]">{label}</span>
    </button>
);

export default NavigationDrawer;
