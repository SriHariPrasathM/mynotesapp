import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/auth/me', { withCredentials : true });
            setUser(response.data);
        } catch (error) {
            setUser(null);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const login = async (userData) => {
        try{
            const response = await axios.post("http://localhost:5000/api/v1/auth/login", userData, { withCredentials : true });
            if(response.data.message === 'Login successful'){
                fetchUser();
                return true;
            }
            return false;
        } catch (error){
            setUser(null);
            console.log(error);
        }
    }

    const logout = async () => {
        try{
            const response = await axios.post("http://localhost:5000/api/v1/auth/logout", {}, { withCredentials : true });
            setUser(null);
        } catch (error){
            setUser(null);
            console.log("Logout Error : ", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}