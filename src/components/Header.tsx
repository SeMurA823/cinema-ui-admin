import React, {useContext} from "react";
import {AppBar, Avatar, Badge, Box, Button, CircularProgress, Container, Toolbar, Typography} from "@mui/material";
import {Context} from "../index";
import {observer} from "mobx-react-lite"
import {useNavigate} from "react-router-dom";

function stringToColor(str: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < str.length; i += 1) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

function Header() {
    const {store} = useContext(Context);
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="fixed" color='primary'>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Button onClick={() => navigate('/')}>
                            <Badge badgeContent={'admin'} color='error' component='div'
                                   sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}>

                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{my: 2, color: 'white', display: 'block'}}>
                                    Cinema
                                </Typography>
                            </Badge>
                        </Button>
                        <Box sx={{flexGrow: 5, display: {xs: 'none', md: 'flex'}}}>
                            {/*<Button*/}
                            {/*    sx={{my: 2, color: 'white', display: 'block'}}*/}
                            {/*>*/}

                            {/*</Button>*/}
                        </Box>
                        <Box sx={{flexGrow: 0, display: {xs: 'none', md: 'flex'}}}>
                            {(!store.isAuth && store.loaded) &&
                                <Button
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                    href='/sign-in'
                                >
                                    Войти
                                </Button>
                            }
                            {!store.loaded &&
                                <CircularProgress color='info'/>
                            }
                            {(store.isAuth && store.loaded) &&
                                <>
                                    <Avatar {...stringAvatar(store.user.firstName + ' ' + store.user.lastName)} />
                                    <Button onClick={e => store.logout()} sx={{color: 'white'}}>
                                        Выйти
                                    </Button>
                                </>
                            }

                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

export default observer(Header)