import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import $api from "../../../http/config";
import {FilmType} from "../../types/FilmTypes";
import LoadingPage from "../../LoadingPage";
import {
    Alert,
    Autocomplete,
    Button,
    Divider,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DatePicker} from '@mui/lab';
import {AgeLimitType} from "../../types/AgeLimitTypes";
import {CountryType} from "../../types/CountryTypes";
import FilmMakerBlock from "./FilmMakerBlock";
import PurchaseFilmStatComponent from "./PurchaseFilmStatComponent";

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


export default function FilmEdit() {
    const params = useParams();
    const filmId = params.id;

    const [duration, setDuration] = useState<number>(0)
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [plot, setPlot] = useState<string>('');
    const [localPremiere, setLocalPremiere] = useState<Date>(new Date());
    const [worldPremiere, setWorldPremiere] = useState<Date>(new Date());
    const [ageLimit, setAgeLimit] = useState<AgeLimitType>({} as AgeLimitType)
    const [ageLimits, setAgeLimits] = useState<Array<AgeLimitType>>([]);
    const [ageLimitsLoaded, setAgeLimitsLoaded] = useState<boolean>(true);
    const [countries, setCountries] = useState<Array<CountryType>>([]);
    const [countryList, setCountryList] = useState<Array<CountryType>>([]);
    const [countryListLoaded, setCountryListLoaded] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const location = useLocation();
    const navigate = useNavigate();

    const toPreviousPage = () => {
        navigate(-1);
    }
    const save = () => {
        setLoaded(false);
        $api.post<any>(`/films/${id}`, JSON.stringify({
            id: id,
            name: name,
            plot: plot,
            localPremiere: localPremiere,
            worldPremiere: worldPremiere,
            ageLimitId: ageLimit.id,
            countriesId: countries.map(x => x.id),
            isActive: isActive,
            duration: duration
        } as FilmRequest))
            .then((response) => {
                if (response.status !== 200)
                    throw new Error();
                setSuccess(true)
                setError(false);
            })
            .catch(() => {
                setError(true)
                setSuccess(false)
            })
            .finally(() => setLoaded(true))
    }

    const cancel = () => {
        toPreviousPage();
    }

    const del = () => {
        setLoaded(false);
        $api.delete(`/films/${id}`)
            .then(() => navigate(-1))
            .catch(() => setError(true))
            .finally(() => setLoaded(true));
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
        setLoaded(false);
        $api.get<FilmType>(`/films/${filmId}?anystatus`)
            .then(response => response.data)
            .then(data => {
                setId(data.id);
                setName(data.name);
                setLocalPremiere(data.localPremiere);
                setWorldPremiere(data.worldPremiere);
                setAgeLimit(data.ageLimit);
                setAgeLimits([data.ageLimit])
                setCountries(data.countries);
                setPlot(data.plot);
                setIsActive(data.active);
                setDuration(data.duration);
            })
            .catch(error => {
                console.log(error);
                setError(error)
            })
            .finally(() => {
                setLoaded(true);
            })
        getAgeLimits();
        getCountries();
    }, [])


    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack alignItems='center' minHeight='100vh'>
            <PurchaseFilmStatComponent film={{
                id: id,
                name: name,
                localPremiere: localPremiere,
                worldPremiere: worldPremiere,
                ageLimit: ageLimit,
                plot: plot,
                active: isActive,
                duration: duration
            } as FilmType}/>
            {(error && !success) &&
                <Alert severity='error'>Ошибка</Alert>
            }
            <Stack style={{maxWidth: 768}} spacing={2}>
                <Typography variant='h4' fontWeight={'bolder'} color={'primary'} padding={2}>{name}</Typography>
                <TextField fullWidth value={id} label='ID' disabled/>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isActive} color={(isActive) ? 'success' : 'warning'}
                                                       onChange={() => setIsActive(!isActive)}/>}
                                      label={(isActive) ? 'Включен' : 'Отключен'}/>
                </FormGroup>
                <TextField fullWidth value={name} label='Название'
                           onChange={event => setName(event.target.value)}/>
                <TextField fullWidth value={plot} label='Сюжет' multiline
                           onChange={event => setPlot(event.target.value)}/>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={localPremiere}
                        label='Местная премьера'
                        onChange={(date, selectionState) => setLocalPremiere((date) ? date : new Date())}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={worldPremiere}
                        label='Глобальная премьера'
                        onChange={(date, selectionState) => setWorldPremiere((date) ? date : new Date())}
                        renderInput={(params) => <TextField {...params}/>}/>
                </LocalizationProvider>
                <TextField type='number' inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}} value={duration}
                           onChange={event => {
                               setDuration(+event.target.value)
                           }}/>
                <Autocomplete
                    options={ageLimits}
                    loading={!ageLimitsLoaded}
                    defaultValue={ageLimit}
                    onChange={(event, value) => {
                        if (value !== null) {
                            setAgeLimit(value)
                        }
                    }}
                    onOpen={event => {
                        getAgeLimits()
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
                <Divider/>
                <FilmMakerBlock filmId={Number(filmId)}/>
                {(!error && success) &&
                    <Alert severity='success'>Изменено</Alert>
                }
                <Stack direction='row' spacing={2} justifyContent='center'>
                    <Button color='inherit' variant='outlined' onClick={() => cancel()}>
                        Назад
                    </Button>
                    <Button color='warning' variant='outlined' onClick={() => del()}>
                        Удалить
                    </Button>
                    <Button color='primary' variant='outlined' onClick={() => save()}>
                        Готов
                    </Button>
                </Stack>
            </Stack>

        </Stack>
    )
}