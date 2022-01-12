import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Alert, Button, Stack, TextField, Typography} from "@mui/material";
import {CountryType} from "../../../models/response/CountryTypes";

type CountryRequest = {
    id: string,
    shortName: string,
    fullName: string
}


export default function CountryCreate() {
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

    async function save() {
        setLoaded(false);
        try {
            const response = await $api.post<CountryType>(`/countries/create`, JSON.stringify({
                id: id,
                shortName: shortName,
                fullName: fullName
            } as CountryRequest));
            setSuccess(false);
            setSuccess(true);
            setError(false);
        } catch (e) {
            setError(true);
            setSuccess(false);
        } finally {
            setLoaded(true);
        }
    }

    const cancel = () => {
        toPreviousPage();
    }

    useEffect(() => {
        setLoaded(true);
    }, [])


    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack alignItems='center' minHeight='100vh'>
            {error && <Alert severity='error'>Ошибка</Alert>}
            <Stack style={{maxWidth: 768}} spacing={2}>
                <Typography variant='h3' padding={2}>Создание</Typography>
                <TextField fullWidth value={id} label='ISO' onChange={event => setId(event.target.value)}/>
                <TextField fullWidth value={shortName} label='Краткое название'
                           onChange={event => setShortName(event.target.value)}/>
                <TextField fullWidth value={fullName} label='Полное название'
                           onChange={event => setFullName(event.target.value)}/>
                {(success) &&
                    <Alert severity='success'>Изменено</Alert>
                }
                <Stack direction='row' spacing={2} justifyContent='center'>
                    <Button color='inherit' variant='outlined' onClick={() => cancel()}>
                        Назад
                    </Button>
                    <Button color='primary' variant='outlined' onClick={() => save()}>
                        Готов
                    </Button>
                </Stack>
            </Stack>

        </Stack>
    )
}