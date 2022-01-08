import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Alert, Button, Stack, TextField, Typography} from "@mui/material";
import {FilmMakerType} from "../../types/FilmMakerType";

type FilmMakerRequest = {
    id: number,
    firstName: string,
    lastName: string,
    patronymic: string | undefined | null
}


export default function FilmMakerEdit() {
    const makerId = useParams().id;


    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [id, setId] = useState<number>();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [patronymic, setPatronymic] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();


    useEffect(() => {
        const asyncFoo = async () => {
            try {
                setLoaded(false);
                const response = await $api.get<FilmMakerType>(`/filmmakers/${makerId}?anystatus`);
                const data = response.data;
                setId(data.id);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setPatronymic(data.patronymic);
                setLoaded(true);
            } catch (e) {
                navigate(-1);
            }
        };
        asyncFoo();
    }, [])

    async function save() {
        setLoaded(false);
        try {
            await $api.post(`/filmmakers/${makerId}`, JSON.stringify({
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
        navigate(-1);
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
                <Typography variant='h3' padding={2}>Редактирование</Typography>
                <TextField fullWidth disabled value={id} label='ID'/>
                <TextField fullWidth value={lastName} label='Фамилия'
                           onChange={event => setLastName(event.target.value)}/>
                <TextField fullWidth value={firstName} label='Имя'
                           onChange={event => setFirstName(event.target.value)}/>
                <TextField fullWidth value={patronymic} label='Отчество'
                           onChange={event => setPatronymic(event.target.value)}/>
                {(success) &&
                    <Alert severity='success'>Созданно</Alert>
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