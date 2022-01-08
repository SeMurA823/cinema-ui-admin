import React, {useState} from "react";
import {Stack, TextField} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import {DatePicker} from "@mui/lab";
import {ruMoment} from "../../../App";
import {FilmCountryStat} from "./FilmCountryStat";
import FilmAgeLimitStat from "./FilmAgeLimitStat";
import {Moment} from "moment";

export const FilmsStat = () => {

    const [start, setStart] = useState<Moment>(ruMoment(new Date()).add(-1, 'month').startOf('day'));
    const [end, setEnd] = useState<Moment>(ruMoment(new Date()));

    return (
        <Stack spacing={2}>
            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                <LocalizationProvider dateAdapter={DateAdapter} locale={'ru'}>
                    <DatePicker
                        mask={'__.__.____'}
                        value={start}
                        maxDate={end}
                        label='От'
                        onChange={(date, selectionState) => setStart((date) ? ruMoment(date.toDate()) : ruMoment(new Date()).add(-1, 'month').startOf('day'))}
                        renderInput={(params) => <TextField color={'primary'} {...params}/>}/>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={DateAdapter} locale={'ru'}>
                    <DatePicker
                        mask={'__.__.____'}
                        value={end}
                        minDate={start}
                        label='До'
                        onChange={(date, selectionState) => setEnd((date) ? ruMoment(date.toDate()) : ruMoment(new Date()))}
                        renderInput={(params) => <TextField color={'primary'} {...params}/>}/>
                </LocalizationProvider>
            </Stack>
            <FilmCountryStat start={start} end={end}/>
            <FilmAgeLimitStat start={start} end={end}/>
        </Stack>
    )
}