import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Alert, Button, Stack, TextField, Typography} from "@mui/material";
import {CountryType} from "../../types/CountryTypes";

type CountryRequest = {
    id: string,
    shortName: string,
    fullName: string
}


export default function CountryEdit() {
    const params = useParams();
    const countryId = params.id;

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [id, setId] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toPreviousPage = () => {
        navigate(-1);
    }

    const save = () => {
        setLoaded(false);
        $api.post<any>(`/admin/countries/${id}`, JSON.stringify({
            id: id,
            shortName: shortName,
            fullName: fullName
        } as CountryRequest))
            .then((response) => {
                if (response.status !== 200)
                    throw new Error();
                setSuccess(true);
                setError(false);
            })
            .catch(() => {
                setError(true);
                setSuccess(false);
            })
            .finally(() => setLoaded(true))
    }

    const cancel = () => {
        toPreviousPage();
    }

    const del = () => {
        setLoaded(false);
        $api.delete(`/admin/countries/${id}`)
            .then(() => navigate(-1))
            .catch(() => setError(true))
            .finally(() => setLoaded(true));
    }

    useEffect(() => {
        setLoaded(false);
        $api.get<CountryType>(`/countries/${countryId}`)
            .then(response => response.data)
            .then(data => {
                setId(data.id);
                setShortName(data.shortName);
                setFullName(data.fullName);
            })
            .catch(error => {
                setError(error)
            })
            .finally(() => {
                setLoaded(true);
            })
    }, [])


    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack alignItems='center' minHeight='100vh'>
            {error && <Alert severity='error'>Ошибка</Alert>}
            <Stack style={{maxWidth: 768}} spacing={2}>
                <Typography variant='h3' padding={2}>Редактирование</Typography>
                <TextField fullWidth value={id} label='ISO' disabled/>
                <TextField fullWidth value={shortName} label='Краткое название'
                           onChange={event => setShortName(event.target.value)}/>
                <TextField fullWidth value={fullName} label='Полное название'
                           onChange={event => setFullName(event.target.value)}/>
                {(loaded && success) &&
                    <Alert severity='success'>Изменено</Alert>
                }
                <Stack direction='row' spacing={2} justifyContent='center'>
                    <Button color='inherit' variant='outlined' onClick={() => cancel()}>
                        Назад
                    </Button>
                    <Button color='warning' variant='outlined' onClick={() => del()}>
                        Удалить
                    </Button>
                    <Button color='primary' variant='outlined' onClick={() => save()}>
                        Готов
                    </Button>
                </Stack>
            </Stack>

        </Stack>
    )
}