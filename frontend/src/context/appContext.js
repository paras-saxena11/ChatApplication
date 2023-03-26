import { io } from "socket.io-client";
import React from 'react';
// const SOCKET_URL = "http://localhost:5001";
const SOCKET_URL = "https://chatappbackend-i75j.onrender.com";

export const socket = io(SOCKET_URL);

export const AppContext = React.createContext();