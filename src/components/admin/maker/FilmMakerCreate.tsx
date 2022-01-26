import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Alert, Button, Stack, TextField, Typography} from "@mui/material";

type FilmMakerRequest = {
    id: number,
    firstName: string,
    lastName: string,
    patronymic: string | undefined | null
}


export default function FilmMakerCreate() {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [id, setId] = useState<number>();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [patronymic, setPatronymic] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const toPreviousPage = () => {
        navigate(-1);
    }

    async function save() {
        setLoaded(false);
        try {
            await $api.post(`/filmmakers/create`, JSON.stringify({
                id: id,
                firstName: firstName,
                lastName: lastName,
                patronymic: patronymic
            } as FilmMakerRequest));
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
                <TextField fullWidth value={lastName} label='Фамилия'
                           onChange={event => setLastName(event.target.value)}/>
                <TextField fullWidth value={firstName} label='Имя'
                           onChange={event => setFirstName(event.target.value)}/>
                <TextField fullWidth value={patronymic} label='Отчество'
                           onChange={event => setPatronymic(event.target.value)}/>
                {(success) &&
                    <Alert severity='success'>Создано</Alert>
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