import React, {FormEvent, useContext, useState} from "react";
import {Alert, Button, ButtonGroup, Stack, TextField, ToggleButton, Typography} from "@mui/material";
import {Context} from "../../index";
import {observer} from "mobx-react-lite"
import {useNavigate} from "react-router-dom";

interface ILoginPage {
    onLogin?(x?: Event): void,

    redirectUrl?: string
}

function LoginPage(props: ILoginPage) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const {store} = useContext(Context)

    const [isAuth, setIsAuth] = useState<boolean>(store.isAuth);
    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(true);

    const navigate = useNavigate();

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setLoaded(false);
        try {
            await store.login(username, password);
        } catch (e) {
            setError(error);
        } finally {
            setLoaded(true);
        }
    }

    if (store.isAuth)
        navigate(-1);

    return (
        <Stack direction='column' alignItems='center' justifyContent='center' style={{minHeight: '100vh'}}>
            <form onSubmit={submitHandler} onChange={e => setError(false)}>
                <Stack alignItems='center' spacing={2}>
                    <Typography color='primary' variant='h2'>Авторизация</Typography>
                    <TextField variant='outlined' type='tel' value={username}
                               onChange={e => setUsername(e.target.value)}/>
                    <TextField variant='outlined' type='password' value={password}
                               onChange={e => setPassword(e.target.value)}/>
                    <ButtonGroup disabled={!loaded}>
                        <Button type='reset' color='secondary'>Отмена</Button>
                        <Button type='submit' color='primary'>Войти</Button>
                    </ButtonGroup>
                    {error &&
                        <Alert severity='error'>Неверный логин или пароль</Alert>
                    }
                </Stack>
            </form>

        </Stack>
    );
}

export default observer(LoginPage)