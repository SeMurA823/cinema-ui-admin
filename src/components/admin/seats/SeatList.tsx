import {GridSortDirection} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Stack, ToggleButton, Typography} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {Context} from '../../..';
import {SeatType} from "../../types/HallTypes";
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
            await getAll(state);
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

    function getAll(requestState: Array<Array<SeatType>>) {
        console.log(requestState);
        $api.get<Array<Array<SeatType>>>(`/admin/halls/${hallId}/seats`)
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

    const addItem = (row: number) => {
        state[row - 1].push({
            number: (state[row - 1].length + 1),
            row: row,
            unUsed: false
        })
        setState([...state]);
    }

    const deleteSelectedItems = () => {
        clickList.forEach((value, index) => {
            state.forEach((arr) => {
                if (arr.includes(value)) {
                    arr.splice(arr.indexOf(value), 1);
                }
            })
        });
        clickList.splice(0, clickList.length);
        state.forEach((arr, arrIndex) => {
            arr.forEach((value, index) => value.number = (index + 1));
        })
        setState(state.filter(x => x.length > 0));
    }

    const disableSelectedItems = () => {
        clickList.forEach((value, index) => {
            state.forEach((arr) => {
                if (arr.includes(value)) {
                    arr[arr.indexOf(value)].unUsed = true;
                }
            })
        });
        clickList.splice(0, clickList.length);
        state.forEach((arr) => {
            arr.forEach((value, index) => value.number = (index + 1));
        })
        setState([...state]);
    }

    const enableSelectedItems = () => {
        clickList.forEach((value, index) => {
            state.forEach((arr) => {
                if (arr.includes(value)) {
                    arr[arr.indexOf(value)].unUsed = false;
                }
            })
        });
        clickList.splice(0, clickList.length);
        state.forEach((arr) => {
            arr.forEach((value, index) => value.number = (index + 1));
        })
        setState([...state]);
    }

    const x = () => {

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

    console.log(clickList);
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
                        <Button color='inherit' variant={'contained'}>
                            Отмена
                        </Button>
                        <Button color='success' variant={'contained'}>
                            Готово
                        </Button>
                    </Stack>
                </Stack>


            </Stack>
        </>

    );
}