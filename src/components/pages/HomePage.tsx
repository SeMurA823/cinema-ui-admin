import React, {useContext} from "react";
import {Context} from "../../index";
import {Button, Stack, Typography} from "@mui/material";


export default function HomePage() {
    const {store} = useContext(Context)

    return (
        <>
            <Stack padding={3}>
                <Typography color='primary' variant='h3' fontWeight='bolder' align='center'>Панель
                    управления</Typography>
                <Stack flexWrap='wrap' padding={3} direction='row' justifyContent='center'>
                    <Button style={{minWidth: 200, maxWidth: '25%', height: 200, width: '100%', margin: 20}}
                            href='/films'
                            variant='outlined'>
                        Фильмы
                    </Button>
                    <Button style={{minWidth: 200, maxWidth: '25%', height: 200, width: '100%', margin: 20}}
                            href='/countries'
                            variant='outlined'>
                        Страны
                    </Button>
                    <Button style={{minWidth: 200, maxWidth: '25%', height: 200, width: '100%', margin: 20}}
                            href='/users'
                            variant='outlined'>
                        Пользователи
                    </Button>
                    <Button style={{minWidth: 200, maxWidth: '25%', height: 200, width: '100%', margin: 20}}
                            href='/posters'
                            variant='outlined'>
                        Постеры
                    </Button>
                    <Button style={{minWidth: 200, maxWidth: '25%', height: 200, width: '100%', margin: 20}}
                            variant='outlined'>
                        Залы
                    </Button>

                </Stack>
            </Stack>
        </>
    )
}
