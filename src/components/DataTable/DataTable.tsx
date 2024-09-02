import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Data } from '../../types/Data';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const HOST = 'https://test.v5.pryaniky.com';

const DataTable: React.FC<{ token: string }> = ({ token }) => {
    const [data, setData] = useState<Data[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<Data | null>(null);
    const [formData, setFormData] = useState({
        companySigDate: '',
        companySignatureName: '',
        documentName: '',
        documentStatus: '',
        documentType: '',
        employeeNumber: '',
        employeeSigDate: '',
        employeeSignatureName: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${HOST}/ru/data/v3/testmethods/docs/userdocs/get`, {
                    headers: { 'x-auth': token },
                });
                setData(response.data.data);
            } catch (err) {
                setError('Ошибка загрузки данных');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.post(`${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${id}`, {}, {
                headers: { 'x-auth': token },
            });
            if (response.data.error_code === 0) {
                setData(data.filter(item => item.id !== id));
            }
        } catch (err) {
            setError('Ошибка удаления записи');
            setSnackbarOpen(true);
        }
    };

    const handleOpenDialog = (record: Data | null) => {
        setCurrentRecord(record);
        setEditMode(!!record);
        setFormData(record ? {
            companySigDate: record.companySigDate,
            companySignatureName: record.companySignatureName,
            documentName: record.documentName,
            documentStatus: record.documentStatus,
            documentType: record.documentType,
            employeeNumber: record.employeeNumber,
            employeeSigDate: record.employeeSigDate,
            employeeSignatureName: record.employeeSignatureName,
        } : {
            companySigDate: '',
            companySignatureName: '',
            documentName: '',
            documentStatus: '',
            documentType: '',
            employeeNumber: '',
            employeeSigDate: '',
            employeeSignatureName: '',
        });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSubmit = async () => {
        try {
            let response: AxiosResponse<any, any>;
            if (editMode && currentRecord) {
                response = await axios.post(`${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${currentRecord.id}`, formData, {
                    headers: { 'x-auth': token },
                });
            } else {
                response = await axios.post(`${HOST}/ru/data/v3/testmethods/docs/userdocs/create`, formData, {
                    headers: { 'x-auth': token },
                });
            }
            if (response.data.error_code === 0) {
                if (editMode) {
                    setData(data.map(item => (item.id === currentRecord!.id ? response.data.data : item)));
                } else {
                    setData([...data, response.data.data]);
                }
                handleCloseDialog();
            }
        } catch (err) {
            setError('Ошибка сохранения записи');
            setSnackbarOpen(true);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>Добавить запись</Button>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата подписи компании</TableCell>
                            <TableCell>Имя подписи компании</TableCell>
                            <TableCell>Название документа</TableCell>
                            <TableCell>Статус документа</TableCell>
                            <TableCell>Тип документа</TableCell>
                            <TableCell>Номер сотрудника</TableCell>
                            <TableCell>Дата подписи сотрудника</TableCell>
                            <TableCell>Имя подписи сотрудника</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.companySigDate}</TableCell>
                                <TableCell>{item.companySignatureName}</TableCell>
                                <TableCell>{item.documentName}</TableCell>
                                <TableCell>{item.documentStatus}</TableCell>
                                <TableCell>{item.documentType}</TableCell>
                                <TableCell>{item.employeeNumber}</TableCell>
                                <TableCell>{item.employeeSigDate}</TableCell>
                                <TableCell>{item.employeeSignatureName}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenDialog(item)}>Изменить</Button>
                                    <Button onClick={() => handleDelete(item.id)}>Удалить</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={error} />
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{editMode ? "Изменить запись" : "Добавить запись"}</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Дата подписи компании" 
                        type="datetime-local" 
                        value={formData.companySigDate} 
                        onChange={(e) => setFormData({ ...formData, companySigDate: e.target.value })} 
                        fullWidth
                        InputLabelProps={{ shrink: true }} 
                    />
                    <TextField 
                        label="Имя подписи компании" 
                        value={formData.companySignatureName} 
                        onChange={(e) => setFormData({ ...formData, companySignatureName: e.target.value })} 
                        fullWidth
                    />
                    <TextField 
                        label="Название документа" 
                        value={formData.documentName} 
                        onChange={(e) => setFormData({ ...formData, documentName: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Статус документа" 
                        value={formData.documentStatus} 
                        onChange={(e) => setFormData({ ...formData, documentStatus: e.target.value })} 
                        fullWidth
                    />
                    <TextField 
                        label="Тип документа" 
                        value={formData.documentType} 
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Номер сотрудника" 
                        value={formData.employeeNumber} 
                        onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })} 
                        fullWidth 
                    />
                    <TextField 
                        label="Дата подписи сотрудника" 
                        type="datetime-local" 
                        value={formData.employeeSigDate} 
                        onChange={(e) => setFormData({ ...formData, employeeSigDate: e.target.value })} 
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField 
                        label="Имя подписи сотрудника" 
                        value={formData.employeeSignatureName} 
                        onChange={(e) => setFormData({ ...formData, employeeSignatureName: e.target.value })} 
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSubmit}>{editMode ? "Сохранить" : "Добавить"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DataTable;