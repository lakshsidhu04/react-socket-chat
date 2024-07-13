import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const PendingFriendRequests = () => {
    const { user } = useUser();
    const [requests, setRequests] = useState([]);
    console.log('user:', user);
    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch('http://localhost:3030/api/users/pending-requests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setRequests(data.requests);
                } else {
                    console.error('Failed to fetch pending requests');
                }
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleAcceptRequest = async (userId) => {
        try {
            const response = await fetch('http://localhost:3030/api/users/accept-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ sourceId : userId, targetId: user._id})
            });

            if (response.ok) {
                console.log('Friend request accepted');
                setRequests(requests.filter(request => request._id !== userId));
            } else {
                console.error('Failed to accept friend request');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    return (
        <div className="p-4 bg-white">
            <Link to="/chat" className="block text-blue-500 mb-4">Back to Chat</Link>
            <h1 className="text-2xl font-bold mb-4">Pending Friend Requests</h1>
            <ul>
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <li key={request._id} className="flex items-center justify-between p-2 border-b">
                            <span>{request.username}</span>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => handleAcceptRequest(request._id)}
                            >
                                Accept
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="text-center text-gray-600">No pending friend requests</li>
                )}
            </ul>
        </div>
    );
};

export default PendingFriendRequests;
