import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';
import { Link } from 'react-router-dom';

const SignUpForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('Male');
    const [error, setError] = useState('');
    const { setUser, user } = useUser();
    const navigate = useNavigate();
    const { connectSocket } = useSocket();

    useEffect(() => {
        if (user) {
            connectSocket(user);
            navigate('/chat');
        }
    }, [user, connectSocket, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !username || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:3030/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, username, password, confirmPassword, gender }),
            });

            if (!response.ok) {
                setError('Sign up failed. Please try again.');
                return;
            }

            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error('Error during sign up:', error);
            setError('Error during sign up. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex w-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <div className="flex items-center">
                        <label className="mr-4">Gender:</label>
                        <div className="mr-4">
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="Male"
                                checked={gender === 'Male'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-1"
                            />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div className="mr-4">
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="Female"
                                checked={gender === 'Female'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-1"
                            />
                            <label htmlFor="female">Female</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="other"
                                name="gender"
                                value="Other"
                                checked={gender === 'Other'}
                                onChange={(e) => setGender(e.target.value)}
                                className="mr-1"
                            />
                            <label htmlFor="other">Other</label>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
