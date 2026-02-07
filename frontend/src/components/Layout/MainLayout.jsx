import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import { createChat } from '../../services/chatService';
import ChatList from '../Chat/ChatList';
import ChatWindow from '../Chat/ChatWindow';
import Sidebar from '../Sidebar/Sidebar';
import StatusSidebar from '../Status/StatusSidebar';
import NavigationDrawer from '../Sidebar/NavigationDrawer';
import StatusViewer from '../Status/StatusViewer';
import VideoCall from '../VideoCall/VideoCall';
import IncomingCallModal from '../VideoCall/IncomingCallModal';
import NewGroupModal from '../Chat/NewGroupModal';
import { useWebRTC } from '../../hooks/useWebRTC';
import { CALL_STATUS } from '../../utils/constants';
import { FaSun, FaMoon } from 'react-icons/fa';

const MainLayout = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showStatusSidebar, setShowStatusSidebar] = useState(false);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [viewingStatusGroup, setViewingStatusGroup] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null);

    const { user } = useAuth();
    const { socket } = useSocket();
    const { isDark, toggleTheme } = useTheme();

    const webRTC = useWebRTC(socket, user?._id);

    useEffect(() => {
        if (!socket) return;

        // Listen for incoming calls
        socket.on('call:incoming', async ({ from, offer }) => {
            if (!from) {
                console.error('Incoming call with NO Caller ID!');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/users/${from}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch caller data');
                }

                const callerData = await response.json();

                setIncomingCall({
                    caller: callerData,
                    offer: offer,
                    from: from
                });
            } catch (error) {
                console.error('Error fetching caller data:', error);

                // Fallback
                setIncomingCall({
                    caller: { name: 'Unknown User', _id: from },
                    offer: offer,
                    from: from
                });
            }
        });

        return () => {
            socket.off('call:incoming');
        };
    }, [socket]);

    const handleAcceptCall = async () => {
        if (incomingCall) {
            console.log('Accepting call with caller data:', incomingCall.caller);
            await webRTC.answerCall(incomingCall.offer, incomingCall.caller);
            setIncomingCall(null);
        }
    };

    const handleRejectCall = () => {
        if (incomingCall) {
            webRTC.rejectCall();
            setIncomingCall(null);
        }
    };

    const handleSelectChat = async (chat, newUser = null) => {
        if (newUser) {
            // Create new chat with user
            try {
                const newChat = await createChat(newUser._id);
                setSelectedChat(newChat);
                if (socket) {
                    socket.emit('chat:join', newChat._id);
                }
            } catch (error) {
                console.error('Error creating chat:', error);
            }
        } else {
            setSelectedChat(chat);
            if (socket && chat) {
                socket.emit('chat:join', chat._id);
            }
        }
    };

    return (
        <div className="flex h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
            {/* Sidebar (Profile) */}
            {showSidebar && (
                <div className="fixed inset-0 z-50 lg:relative lg:z-0 lg:w-auto">
                    <div
                        className="absolute inset-0 bg-black/50 lg:hidden"
                        onClick={() => setShowSidebar(false)}
                    ></div>
                    <div className="relative h-full">
                        <Sidebar onClose={() => setShowSidebar(false)} />
                    </div>
                </div>
            )}

            {/* Status Sidebar */}
            {showStatusSidebar && (
                <div className="fixed inset-0 z-50 lg:relative lg:z-0 lg:w-auto">
                    {/* On mobile, cover fully. On Desktop, replace ChatList */}
                    <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowStatusSidebar(false)}></div>
                    <div className="relative h-full flex bg-white dark:bg-dark-panel">
                        <StatusSidebar
                            onClose={() => setShowStatusSidebar(false)}
                            onViewStatus={(group) => setViewingStatusGroup(group)}
                        />
                    </div>
                </div>
            )}

            {/* Chat List (Hidden if Status Sidebar is open on Desktop) */}
            {!showStatusSidebar && (
                <div className="w-full lg:w-96 border-r border-light-border dark:border-dark-border flex-shrink-0">
                    <ChatList
                        onSelectChat={handleSelectChat}
                        selectedChatId={selectedChat?._id}
                        onOpenProfile={() => setShowSidebar(true)}
                        onOpenStatus={() => setShowStatusSidebar(true)}
                        onOpenDrawer={() => setShowDrawer(true)}
                    />
                </div>
            )}

            {/* Navigation Drawer */}
            <NavigationDrawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                onOpenProfile={() => setShowSidebar(true)}
                onNewGroup={() => setShowNewGroupModal(true)}
            />

            {/* Chat Window */}
            <div className="flex-1 flex flex-col relative">
                {selectedChat ? (
                    <ChatWindow
                        chat={selectedChat}
                        onOpenSidebar={() => setShowSidebar(true)}
                        onStartCall={(recipientId, recipientData) => {
                            webRTC.startCall(recipientId, recipientData);
                        }}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-light-panel dark:bg-dark-panel">
                        <div className="text-center">
                            <div className="mb-4">
                                <img
                                    src="https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png"
                                    alt="WhatsApp"
                                    className="w-64 mx-auto opacity-50"
                                />
                            </div>
                            <h2 className="text-3xl font-light text-gray-800 dark:text-gray-200 mb-2">
                                ChatGo
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Send and receive messages without keeping your phone online.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Select a chat to start messaging
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Video Call Overlay */}
            {webRTC.callStatus !== CALL_STATUS.IDLE && (
                <VideoCall webRTC={webRTC} />
            )}

            {/* Incoming Call Modal */}
            {incomingCall && (
                <IncomingCallModal
                    caller={incomingCall.caller}
                    onAccept={handleAcceptCall}
                    onReject={handleRejectCall}
                />
            )}

            {/* Status Viewer Overlay */}
            {viewingStatusGroup && (
                <StatusViewer
                    statusGroup={viewingStatusGroup}
                    onClose={() => setViewingStatusGroup(null)}
                />
            )}

            {/* New Group Modal */}
            <NewGroupModal
                isOpen={showNewGroupModal}
                onClose={() => setShowNewGroupModal(false)}
                onGroupCreated={(group) => {
                    setSelectedChat(group);
                    setShowNewGroupModal(false);
                }}
            />
        </div>
    );
};

export default MainLayout;
