import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Auth from '../Auth/Auth';
import DataTable from '../DataTable/DataTable';


const App: React.FC = () => {
    const { token, setToken } = useAuth();

    return (
        <Router>
            <Container>
                <Routes>
                    <Route path="/login" element={<Auth onLogin={setToken} />} />
                    <Route path="/" element={token ? <DataTable token={token} /> : <Auth onLogin={setToken} />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;