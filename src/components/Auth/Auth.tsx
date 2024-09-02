import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const HOST = 'https://test.v5.pryaniky.com';

const Auth: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${HOST}/ru/data/v3/testmethods/docs/login`, {
                username: username.trim(),
                password: password.trim(),
            });
            
            if (response.data.error_code === 0) {
                onLogin(response.data.data.token);
            } else {
                setError('Ошибка авторизации. Проверьте логин и пароль.');
            }
        } catch (err) {
            setError('Ошибка авторизации. Проверьте логин и пароль.');
        }
    };

    return (
        <Box>
            <Typography variant="h4">Авторизация</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TextField label="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={handleLogin}>Войти</Button>
        </Box>
    );
};

export default Auth;