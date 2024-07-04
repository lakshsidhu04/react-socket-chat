import io from 'socket.io-client';

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io('http://localhost:3030', { withCredentials: true });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        console.log('Socket initialized');
    }
    return socket;
};

export const startChat = ({ fromUserId, toUserId }) => {
    if (socket) {
        const roomName = [fromUserId, toUserId].sort().join('_');
        socket.emit('joinRoom', { roomName });
        console.log(`Emitted joinRoom event: ${roomName}`);
    } else {
        console.log('Socket not initialized');
    }
};
