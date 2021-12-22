import React, {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
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
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DateTimePicker} from '@mui/lab';
import {HallType} from "../../types/HallTypes";
import {IPage} from "../../../models/response/IPage";

type FilmScreeningRequest = {
    date: Date,
    price: number
    hallId: number,
    active: boolean,
    filmId: number,
    id: number
}


export default function FilmScreeningEdit() {
    let [searchParams, setSearchParams] = useSearchParams();
    const filmId = (searchParams.get("film")) ? searchParams.get("film") : -1;

    const params = useParams();
    const screeningId = params.id ? Number.parseInt(params.id) : -1;
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [id, setId] = useState<number>(screeningId);
    const [date, setDate] = useState<Date>(new Date());
    const [price, setPrice] = useState<number>(0);
    const [hall, setHall] = useState<HallType>({} as HallType);
    const [hallList, setHallList] = useState<Array<HallType>>([]);
    const [hallListLoaded, setHallListLoaded] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();


    const save = async () => {
        setLoaded(false);
        try {
            const response = await $api.post<any>(`/screenings/${screeningId}`, JSON.stringify({
                date: date,
                price: price,
                hallId: hall.id,
                active: isActive,
                filmId: filmId,
                id: id
            } as FilmScreeningRequest));
            setSuccess(true);
            setError(false);
        } catch (e) {
            setError(true);
            setSuccess(false);
        } finally {
            setLoaded(true)
        }


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
        const asyncFoo = async () => {
            setLoaded(false);
            try {
                const response = await $api.get(`/screenings/${id}`);
                const data = response.data;
                setHall(data.hall);
                setDate(data.date);
                setPrice(data.price);
                setId(data.id);
                setIsActive(data.active);
                setHallList([data.hall])
            } catch (e) {
                setError(true);
                setSuccess(false);
            } finally {
                setLoaded(true);
            }
        }
        asyncFoo();
    }, [])


    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack alignItems='center' minHeight='100vh'>
            {error && <Alert severity='error'>Ошибка</Alert>}
            <Stack style={{maxWidth: 768}} spacing={2}>
                <Typography variant='h3' padding={2}>Редактирование</Typography>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isActive} color={(isActive) ? 'success' : 'warning'}
                                                       onChange={() => setIsActive(!isActive)}/>}
                                      label={(isActive) ? 'Включен' : 'Отключен'}/>
                </FormGroup>
                <TextField fullWidth value={price} label='Цена' type='number'
                           onChange={event => setPrice(Number.parseFloat(event.target.value))}/>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        value={date}
                        label='Дата'
                        onChange={(date, selectionState) => setDate((date) ? date : new Date())}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <Autocomplete
                    options={hallList}
                    value={hall ? hall : null}
                    loading={!hallListLoaded}
                    onChange={(event, value) => {
                        if (value !== null) {
                            setHall(value)
                        }
                    }}
                    getOptionDisabled={(option) => hall === option}
                    getOptionLabel={(option) => option.name?.toString()}
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
                {(loaded && success) &&
                    <Alert severity='success'>Изменено</Alert>
                }
                <Stack direction='row' spacing={2} justifyContent='center'>
                    <Button color='inherit' variant='outlined' onClick={() => navigate(-1)}>
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