import React, {useEffect, useState} from "react";
import $api from "../../../http/config";
import {Chip, Stack, TextField, Typography} from "@mui/material";
import {ruMoment} from "../../../App";
import {Moment} from "moment";
import LoadingPage from "../../LoadingPage";
import {FilmType} from "../../../models/response/FilmTypes";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from '@mui/lab/AdapterMoment';
import {DatePicker} from "@mui/lab";

const startDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
}

const endDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

type Props = {
    film: FilmType
}

export default function PurchaseFilmStatComponent(props: Props) {
    const [start, setStart] = useState<Moment>(ruMoment(startDate()));
    const [end, setEnd] = useState<Moment>(ruMoment(endDate()));
    const [averageCount, setAverageCount] = useState<number>(0);
    const [occupancyFilm, setOccupancyFilm] = useState<number>(0)
    const [countTickets, setCountTickets] = useState<number>(0)
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const asyncFoo = async () => {
            try {
                const avgTicketCountResponse = await $api.get<number>((`/stat/averageticketcount?film=${props.film.id}&start=${encodeURIComponent(start.toISOString(false))}&end=${encodeURIComponent(end.toISOString(false))}`));
                setAverageCount(avgTicketCountResponse.data)
                let occupancyFilmResponse = await $api.get<number>((`/stat/occupancyfilm?film=${props.film.id}&start=${encodeURIComponent(start.toISOString(false))}&end=${encodeURIComponent(end.toISOString(false))}`));
                setOccupancyFilm(occupancyFilmResponse.data);
                let countTicketsResponse = await $api.get<number>((`/stat/amounttickets?film=${props.film.id}&start=${encodeURIComponent(start.toISOString(false))}&end=${encodeURIComponent(end.toISOString(false))}`));
                setCountTickets(countTicketsResponse.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoaded(true);
            }
        }
        asyncFoo();
    }, [start, end])

    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <Typography variant='h4' fontWeight='bolder' color={'primary'}>Статистика</Typography>
                {/*<Chip color={'primary'} label={<Typography fontSize={12} fontWeight={'bold'}>{start.format('LL')} - {end.format('LL')}</Typography>}/>*/}
            </Stack>
            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                <LocalizationProvider dateAdapter={DateAdapter} locale={'ru'}>
                    <DatePicker
                        mask={'__.__.____'}
                        value={start}
                        maxDate={end}
                        label='От'
                        onChange={(date, selectionState) => setStart((date) ? ruMoment(date.toDate()).startOf('day') : ruMoment(new Date()).add(-1, 'month').startOf('day'))}
                        renderInput={(params) => <TextField color={'primary'} {...params}/>}/>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={DateAdapter} locale={'ru'}>
                    <DatePicker
                        mask={'__.__.____'}
                        value={end}
                        minDate={start}
                        label='До'
                        onChange={(date, selectionState) => setEnd((date) ? ruMoment(date.toDate()).endOf('day') : ruMoment(new Date()).endOf('day'))}
                        renderInput={(params) => <TextField color={'primary'} {...params}/>}/>
                </LocalizationProvider>
            </Stack>
            <Stack direction={'row'} spacing={1}>
                <Typography variant='h5'>В среднем в заказе - билетов</Typography>
                <Chip label={<Typography variant={'h3'} fontWeight={'bold'}>{Math.floor(averageCount)}</Typography>}/>
                <Typography variant='h5'>шт.</Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
                <Typography variant='h5'>Средняя заполняемость зала</Typography>
                <Chip label={<Typography variant={'h3'}
                                         fontWeight={'bold'}>{Math.round(occupancyFilm * 1000) / 10}</Typography>}/>
                <Typography variant='h5'>%</Typography>
            </Stack>
            <Stack direction={'row'} spacing={1}>
                <Typography variant='h5'>Купленных билетов</Typography>
                <Chip label={<Typography variant={'h3'}
                                         fontWeight={'bold'}>{Math.round(countTickets)}</Typography>}/>
                <Typography variant='h5'>шт.</Typography>
            </Stack>
        </Stack>
    )
}