import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Alert, Button, Stack, TextField, Typography} from "@mui/material";
import {HallType} from "../../../models/response/HallTypes";

type CountryRequest = {
    id: string,
    name: string,
    fullName: string
}


export default function HallEdit() {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [id, setId] = useState<number>(-1);
    const [name, setName] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    const hallId = useParams().id;

    const toPreviousPage = () => {
        navigate(-1);
    }

    async function save() {
        setLoaded(false);
        try {
            const response = await $api.post<HallType>(`/halls/${hallId}`, JSON.stringify({
                id: id,
                name: name,
            }));
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
        setLoaded(false);
        $api.get<HallType>(`/halls/${hallId}?anystatus`)
            .then(response => response.data)
            .then(data => {
                setId(data.id);
                setName(data.name);
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
                <TextField fullWidth value={id} label='ID' disabled/>
                <TextField fullWidth value={name} label='Название'
                           onChange={event => setName(event.target.value)}/>
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