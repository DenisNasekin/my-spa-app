import { useState, useEffect } from 'react';
import axios from 'axios';
import { Data } from '../types/Data';

export const useData = (token: string) => {
    const [data, setData] = useState<Data[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/data', { headers: { Authorization: `Bearer ${token}` } });
                setData(response.data);
            } catch (err) {
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    return { data, loading, error };
};