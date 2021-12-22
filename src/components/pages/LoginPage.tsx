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
    const [edited, setEdited] = useState<boolean>(true);

    const navigate = useNavigate();

    const submitHandler = (e: FormEvent): void => {
        e.preventDefault();
        store.login(username, password, rememberMe)
            .then(x => {
                setIsAuth(store.isAuth);
                setEdited(false)
                if (store.isAuth) {
                    navigate(-1);
                }
            })
    }

    if (store.isAuth)
        navigate(-1);

    return (
        <Stack direction='column' alignItems='center' justifyContent='center' style={{minHeight: '100vh'}}>
            <form onSubmit={submitHandler} onChange={e => setEdited(true)}>
                <Stack alignItems='center' spacing={2}>
                    <Typography color='primary' variant='h2'>Авторизация</Typography>
                    <TextField variant='outlined' type='tel' value={username}
                               onChange={e => setUsername(e.target.value)}/>
                    <TextField variant='outlined' type='password' value={password}
                               onChange={e => setPassword(e.target.value)}/>
                    <ToggleButton selected={rememberMe} onChange={e => setRememberMe(!rememberMe)} value='checked'
                                  color='primary'>
                        Запомнить меня
                    </ToggleButton>
                    <ButtonGroup>
                        <Button type='reset' color='secondary'>Отмена</Button>
                        <Button type='submit' color='primary'>Войти</Button>
                    </ButtonGroup>
                    {!edited &&
                        <Alert severity='error'>Неверный логин или пароль</Alert>
                    }
                </Stack>
            </form>

        </Stack>
    );
}

export default observer(LoginPage)