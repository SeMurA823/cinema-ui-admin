import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {
    Alert,
    Autocomplete,
    Button,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DateTimePicker} from '@mui/lab';
import {HallType} from "../../../models/response/HallTypes";
import {IPage} from "../../../models/response/IPage";
import moment, {Moment} from "moment";
import {ruMoment} from "../../../App";
import {ScheduleScreenings} from "./ScheduleScreenings";
import {FilmType} from "../../../models/response/FilmTypes";

type FilmScreeningRequest = {
    date: string,
    price: number
    hallId: number,
    active: boolean,
    filmId: number
}


export default function FilmScreeningCreate() {
    let [searchParams, setSearchParams] = useSearchParams();
    const filmId = (searchParams.get("film")) ? searchParams.get("film") : -1;

    const [film, setFilm] = useState<FilmType>({} as FilmType)
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [date, setDate] = useState<Moment>(ruMoment(new Date()));
    const [price, setPrice] = useState<number>(0);
    const [hall, setHall] = useState<HallType>({} as HallType);
    const [hallList, setHallList] = useState<Array<HallType>>([]);
    const [hallListLoaded, setHallListLoaded] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toPreviousPage = () => {
        navigate(-1);
    }

    const save = () => {
        setSuccess(false);
        setError(false);
        setLoaded(false);
        $api.post<any>(`/screenings/create`, JSON.stringify({
            date: date.toISOString(),
            price: price,
            hallId: Number(hall.id),
            active: isActive,
            filmId: Number(filmId)
        } as FilmScreeningRequest))
            .then(() => setSuccess(true))
            .catch(() => setError(true))
            .finally(() => setLoaded(true))
    }

    const cancel = () => {
        toPreviousPage();
    }

    const getHallList = (search: string) => {
        $api.get<IPage<HallType>>(`/halls?search=${search}`)
            .then(response => response.data.content)
            .then(data => {
                setHallList(data);
            })
            .catch(err => {
                setHallList([])
            })
            .finally(() => {
                setHallListLoaded(true);
            })
    }

    useEffect(() => {
        setLoaded(false);
        const asyncFoo = async () => {
            try {
                let response = await $api.get<FilmType>(`/films/${filmId}?anystatus`);
                setFilm(response.data);
            } finally {
                setLoaded(true);
            }
        }
        asyncFoo()
    }, [])


    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack alignItems='center' minHeight='100vh'>
            {error && <Alert severity='error'>Зал занят</Alert>}
            <Stack style={{maxWidth: 768}} spacing={2}>
                <Typography variant='h3' padding={2}>{film.name}</Typography>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isActive} color={(isActive) ? 'success' : 'warning'}
                                                       onChange={() => setIsActive(!isActive)}/>}
                                      label={(isActive) ? 'Включен' : 'Отключен'}/>
                </FormGroup>
                <TextField fullWidth value={(price === 0) ? '' : price} label='Цена' type='number'
                           onChange={event => {
                               if (!Number.isNaN(event.target.value))
                                   setPrice(Number.parseFloat(event.target.value))
                           }}/>
                <LocalizationProvider dateAdapter={AdapterMoment} locale={'ru'}>
                    <DateTimePicker
                        value={date}
                        minDateTime={moment()}
                        disableMaskedInput
                        label='Начало'
                        onChange={(date, selectionState) => setDate((date) ? date : ruMoment(new Date()))}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterMoment} locale={'ru'}>
                    <DateTimePicker
                        readOnly
                        value={ruMoment(date.toDate()).add(film.duration, 'minute')}
                        disableMaskedInput
                        label='Конец'
                        onChange={(date, selectionState) => setDate((date) ? date : ruMoment(new Date()))}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <Autocomplete
                    options={hallList}
                    value={hall.id ? hall : null}
                    loading={!hallListLoaded}
                    onOpen={event => {
                        if (hallList.length === 0) setHallListLoaded(true)
                    }}
                    onChange={(event, value) => {
                        if (value) {
                            setHall(value)
                        }
                    }}
                    getOptionDisabled={(option) => hall === option}
                    getOptionLabel={(option) => option?.name?.toString()}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            onChange={event => {
                                setHallListLoaded(false);
                                getHallList(event.target.value);
                            }}
                            label='Зал'/>
                    )}
                />

                {hall.id &&
                    <ScheduleScreenings hallId={hall.id} date={ruMoment(date.toDate())}/>
                }
                {(loaded && success) &&
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
