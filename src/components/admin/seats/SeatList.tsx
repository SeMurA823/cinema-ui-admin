import {GridSortDirection} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Stack, ToggleButton, Typography} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {Context} from '../../..';
import {SeatType} from "../../../models/response/HallTypes";
import {Add, Delete} from "@mui/icons-material";

const order: GridSortDirection[] = [
    "asc",
    "desc"
]

export default function SeatList() {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    let [searchParams, setSearchParams] = useSearchParams();
    const hallId = searchParams.get("hall");

    const [loaded, setLoaded] = useState<boolean>();
    const [error, setError] = useState<boolean>();

    const [clickList, setClickList] = useState<Array<SeatType>>([]);
    const [state, setState] = useState<Array<Array<SeatType>>>([]);

    useEffect(() => {
        let mounted = true;
        const asyncFoo = async () => {
            await getAll();
        }
        if (mounted)
            asyncFoo();
        return () => {
            mounted = false
        }
    }, []);

    if ((loaded && error) || hallId === null)
        return (
            <Alert severity='error'>Ошибка</Alert>
        )

    function getAll() {
        $api.get<Array<Array<SeatType>>>(`/halls/${hallId}/seats?anystatus`)
            .then(response => response.data)
            .then(data => {
                setState(data);
                setLoaded(true);
                setError(false);
            })
            .catch(error => {
                setError(true);
                setLoaded(true);
            });
    }

    const addRow = (): void => {
        setState(state.filter(x => x.length > 0).concat([[]] as SeatType[][]));
    }

    const addItem = async (row: number) => {
        try {
            await $api.post(`/admin/halls/${hallId}/seats/create?row=${row}`, {});
            getAll();
        } catch (e) {
            setError(true);
        }
    }

    const deleteSelectedItems = async () => {
        try {
            await $api.delete(`/admin/halls/${hallId}/seats?id=${clickList.map(x => x.id)}`);
            clickList.splice(0, clickList.length);
            getAll();
        } catch (e) {
            setError(true);
        }
    }

    const disableSelectedItems = async () => {
        try {
            await $api.post(`/admin/halls/${hallId}/seats?id=${clickList.map(x => x.id)}&used=false`)
            clickList.splice(0, clickList.length);
            getAll();
        } catch (e) {
            setError(true);
        }
    }

    const enableSelectedItems = async () => {
        try {
            await $api.post(`/admin/halls/${hallId}/seats?id=${clickList.map(x => x.id)}&used=true`)
            clickList.splice(0, clickList.length);
            getAll();
        } catch (e) {
            setError(true);
        }
    }

    if (!loaded)
        return (
            <LoadingPage/>
        )
    const seats = state.map((x, index) => (
        <Stack direction='row' justifyContent={'center'} key={index} spacing={2}>
            {x.map(y => (
                <ToggleButton key={y.number} value={`cell${y.id}`} selected={clickList.includes(y)} color='warning'
                              onChange={() => {
                                  if (clickList.includes(y))
                                      clickList.splice(clickList.indexOf(y), 1);
                                  else
                                      clickList.push(y);
                                  setClickList([...clickList]);
                              }} style={(y.unUsed) ? {textDecoration: 'line-through'} : {}}>
                    {y.number}
                </ToggleButton>
            ))}
            <Button variant='outlined' onClick={x => addItem(index + 1)}>
                <Add/>
            </Button>
        </Stack>
    ));
    return (
        <>
            <Stack padding={2}>
                <Typography variant='h2'>Hall id: {hallId}</Typography>
                <Stack direction='row' spacing={2}>
                    <p>Выбрано: {clickList.length}</p>
                    <Button color='error' onClick={() => deleteSelectedItems()}>
                        <Delete/>
                    </Button>
                    <Button color='warning' onClick={() => disableSelectedItems()}>
                        Не использовать
                    </Button>
                    <Button color='success' onClick={() => enableSelectedItems()}>
                        Использовать
                    </Button>
                </Stack>
                <Stack spacing={2}>
                    <Button fullWidth variant='contained'>Экран</Button>
                    <Stack spacing={2}>
                        {seats}
                        <Button variant='outlined' onClick={() => addRow()}>
                            <Add/>
                        </Button>
                    </Stack>
                    <Stack direction='row' justifyContent='center' spacing={2}>
                        <Button color='success' variant={'contained'} onClick={() => navigate(-1)}>
                            Готово
                        </Button>
                    </Stack>
                </Stack>


            </Stack>
        </>

    );
}