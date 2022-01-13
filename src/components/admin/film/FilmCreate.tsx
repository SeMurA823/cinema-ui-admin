import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
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
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DatePicker} from '@mui/lab';
import {AgeLimitType} from "../../../models/response/AgeLimitTypes";
import {CountryType} from "../../../models/response/CountryTypes";
import DateAdapter from "@mui/lab/AdapterMoment";
import {ruMoment} from "../../../App";
import moment, {Moment} from "moment";


type FilmRequest = {
    id: number,
    name: string,
    localPremiere: Date,
    worldPremiere: Date,
    plot: string,
    countriesId: string[],
    ageLimitId: string,
    isActive: boolean,
    duration: number
}


export default function FilmCreate() {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [plot, setPlot] = useState<string>('');
    const [localPremiere, setLocalPremiere] = useState<Moment>(ruMoment(new Date()));
    const [worldPremiere, setWorldPremiere] = useState<Moment>(ruMoment(new Date()));
    const [duration, setDuration] = useState<number>(0)
    const [ageLimit, setAgeLimit] = useState<AgeLimitType>({} as AgeLimitType)
    const [ageLimits, setAgeLimits] = useState<Array<AgeLimitType>>([]);
    const [ageLimitsLoaded, setAgeLimitsLoaded] = useState<boolean>(true);
    const [countries, setCountries] = useState<Array<CountryType>>([]);
    const [countryList, setCountryList] = useState<Array<CountryType>>([]);
    const [countryListLoaded, setCountryListLoaded] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    const toPreviousPage = () => {
        navigate(-1);
    }

    const save = () => {
        setSuccess(false);
        setError(false);
        setLoaded(false);
        $api.post<any>(`/films/create`, JSON.stringify({
            name: name,
            plot: plot,
            localPremiere: localPremiere.format(),
            worldPremiere: worldPremiere.format(),
            ageLimitId: ageLimit.id,
            countriesId: countries.map(x => x.id),
            isActive: isActive,
            duration: duration
        }))
            .then(() => setSuccess(true))
            .catch(() => setError(true))
            .finally(() => setLoaded(true))
    }

    const cancel = () => {
        toPreviousPage();
    }

    const getAgeLimits = () => {
        $api.get<Array<AgeLimitType>>(`/age`)
            .then(response => response.data)
            .then(data => {
                setAgeLimits(data);
            })
            .catch(err => {
                setAgeLimits([])
            })
            .finally(() => {
                setAgeLimitsLoaded(true);
            })
    }

    const getCountries = () => {
        setCountryListLoaded(false);
        $api.get<Array<CountryType>>(`/countries`)
            .then(response => response.data)
            .then(data => {
                setCountryList(data);
            })
            .catch(err => {
                setCountryList([]);
            })
            .finally(() => setCountryListLoaded(true))
    }
    useEffect(() => {
        setLoaded(true);
        getAgeLimits();
        getCountries();
    }, [])


    if (!loaded)
        return (<LoadingPage/>)

    if (loaded && error)
        return (<Alert severity='error'>Ошибка</Alert>);

    return (
        <Stack alignItems='center' minHeight='100vh'>
            {error && <Alert severity='error'>Ошибка</Alert>}
            <Stack style={{maxWidth: 768}} spacing={2}>
                <Typography variant='h3' padding={2}>Создание</Typography>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isActive} color={(isActive) ? 'success' : 'warning'}
                                                       onChange={() => setIsActive(!isActive)}/>}
                                      label={(isActive) ? 'Включен' : 'Отключен'}/>
                </FormGroup>
                <TextField fullWidth value={name} label='Название'
                           onChange={event => setName(event.target.value)}/>
                <TextField fullWidth value={plot} label='Сюжет' multiline
                           onChange={event => setPlot(event.target.value)}/>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                        value={localPremiere}
                        label='Местная премьера'
                        onChange={date => setLocalPremiere(date?date:moment())}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={DateAdapter}>
                    <DatePicker
                        value={worldPremiere}
                        label='Глобальная премьера'
                        onChange={(date, selectionState) => setWorldPremiere(date?date:moment())}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <TextField inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}} value={duration}
                           label='Продолжительность (мин)' onChange={event => {
                    setDuration(+event.target.value);
                }}/>
                <Autocomplete
                    options={ageLimits}
                    loading={!ageLimitsLoaded}
                    onChange={(event, value) => {
                        if (value !== null) {
                            setAgeLimit(value)
                        }
                    }}
                    getOptionDisabled={(option) => ageLimit === option}
                    getOptionLabel={(option) => option.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            label='Возрастные ограничения'/>
                    )}
                />
                <Autocomplete
                    multiple
                    isOptionEqualToValue={(option, value) => {
                        console.log(option);
                        console.log(value);
                        return countries.includes(option)
                    }}
                    value={countries}
                    loading={!countryListLoaded}
                    loadingText={<span>Загрузка...</span>}
                    options={countryList}
                    onChange={(event, value) => setCountries(value)}
                    getOptionDisabled={(option) => countries.map(x => x.id).includes(option.id)}
                    getOptionLabel={(option) => option.shortName}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            label='Страны'/>
                    )}
                />
                {(loaded && success) &&
                    <Alert severity='success'>Создано</Alert>
                }
                <Stack direction='row' spacing={2} justifyContent='center'>
                    <Button color='inherit' variant='outlined' onClick={() => cancel()}>
                        Назад
                    </Button>
                    <Button color='primary' variant='outlined' onClick={() => save()}>
                        Готово
                    </Button>
                </Stack>
            </Stack>

        </Stack>
    )
}
