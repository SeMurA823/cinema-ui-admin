import {DataGrid, GridColDef, GridSortDirection, GridSortModel} from '@mui/x-data-grid';
import * as duration from 'duration-fns'
import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Container, Stack, Typography} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {FilmType} from "../../types/FilmTypes";
import {Link, useNavigate} from "react-router-dom";
import {Add, Block, Done} from "@mui/icons-material";
import {CountryType} from "../../types/CountryTypes";
import {Context} from '../../..';
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {ruMoment} from "../../../App";
import {FilmsStat} from "./FilmsStat";


type FilmListState = {
    loaded: boolean,
    error: boolean,
    data: IPage<FilmType>,
    sort: GridSortModel
}

type FilmPageProps = {
    navigation?: NavigationType
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {field: 'name', headerName: 'Название', minWidth: 150},
    {
        field: 'localPremiere', headerName: 'Местная премьера', minWidth: 125, renderCell: params =>
            (<p>{ruMoment(new Date(params.row.localPremiere)).format('l')}</p>)
    },
    {
        field: 'worldPremiere', headerName: 'Мировая премьера', minWidth: 125, renderCell: params =>
            (<p>{ruMoment(new Date(params.row.worldPremiere)).format('l')}</p>)
    },
    {field: 'plot', headerName: 'Сюжет', minWidth: 250},
    {
        field: 'active',
        headerName: 'Активен',
        minWidth: 80,
        sortable: false,
        align: 'center',
        renderCell: (params) => (params.value ? <Done color='success'/> : <Block color='error'/>)
    },
    {
        field: 'ageLimit',
        headerName: 'Возврастные ограничения',
        minWidth: 100,
        renderCell: params => <Link to={`/age/${params.value.id}`}>{params.value.id}</Link>
    },
    {
        field: 'countries', headerName: 'Страны', minWidth: 300, renderCell: params => {
            const countries: CountryType[] = params.value;
            return (<Stack direction='row' spacing={1}>
                {countries.map(c => (<Button key={c.id} href={`/countries/${c.id}`} size='small' variant='outlined'
                                             color='secondary'>{c.shortName}</Button>))}
            </Stack>)
        }
    },
    {
        field: 'posters', headerName: 'Постеры', minWidth: 150, renderCell: params => (
            <Button color='secondary' href={`/posters?film=${params.id}`}>Постеры...</Button>
        )
    },
    {
        field: 'с', headerName: 'Кинопоказы', minWidth: 150, renderCell: params => (
            <Button color='secondary' href={`/screenings?film=${params.id}`}>Кинопоказы...</Button>
        )
    },
    {
        field: 'duration', headerName: 'Продолжительность', minWidth: 150, renderCell: params => (
            <p>{params.getValue(params.id, 'duration')} мин</p>
        )
    }
]

const order: GridSortDirection[] = [
    "asc",
    "desc"
]

export default function FilmList(props: FilmPageProps) {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const [state, setState] = useState<FilmListState>({
        loaded: false,
        error: false,
        data: {
            size: 5,
            number: 0
        } as IPage<FilmType>,
        sort: [
            {
                field: 'id',
                sort: 'asc'
            }
        ]
    });

    useEffect(() => {
        getAll(state);
    }, [])

    console.log(duration.toMinutes('PT1H3M'));

    function getAll(requestState: FilmListState) {
        $api.get<IPage<FilmType>>(`/films?size=${requestState.data.size}&page=${requestState.data.number}&anystatus` +
            `&sort=${requestState.sort.filter(x => x.sort === 'asc').map(x => x.field)},asc&sort=${requestState.sort.filter(x => x.sort === 'desc').map(x => x.field)},desc`)
            .then(response => response.data)
            .then(data => {
                setState({
                    loaded: true,
                    error: false,
                    data: data,
                    sort: requestState.sort
                })
            })
            .catch(error => {
                setState({
                    loaded: true,
                    error: true,
                    data: {} as IPage<FilmType>,
                    sort: requestState.sort
                })
            });
    }


    function setOrderSort(model: GridSortModel) {
        const orderState = {
            ...state,
            sort: model
        };
        getAll(orderState);
    }

    function setPage(page: number) {
        const pageState = {
            ...state
        }
        pageState.data.number = page;
        getAll(pageState);
    }

    function setPageSize(pageSize: number) {
        const pageState = {
            ...state
        }
        pageState.data.size = pageSize;
        pageState.data.number = 0;
        getAll(pageState);
    }

    if (state.loaded && state.error)
        return (
            <Alert severity='error'>Ошибка</Alert>
        )

    if (!state.loaded)
        return (
            <LoadingPage/>
        )

    return (
        <Container>
            <Typography variant='h2' fontWeight='bold' color={'blue'}>Фильмы</Typography>
            <Stack spacing={2} alignItems={'center'}>
                <FilmsStat/>
            </Stack>
            <Button style={{margin: 20}} variant='outlined' color='warning' href={`/films/add`}>
                <Stack direction='row' alignItems='center'>
                    <Add/>
                    <span>Добавить</span>
                </Stack>
            </Button>
            <DataGrid pageSize={state.data.size}
                      autoHeight
                      isRowSelectable={() => false}
                      editMode='row'
                      columns={columns}
                      onRowDoubleClick={(params, event, details) => {
                          navigate(`/films/${params.getValue(params.id, 'id')}`)
                      }}
                      onSortModelChange={(model, details) => {
                          setOrderSort(model)
                      }}
                      onPageChange={(page, details) => {
                          setPage(page);
                      }}
                      onPageSizeChange={(pageSize, details) => {
                          setPageSize(pageSize);
                      }}
                      rowsPerPageOptions={[5, 20, 50]}
                      pagination
                      rowCount={state.data.totalElements}
                      paginationMode='server'
                      page={state.data.number}
                      rows={state.data.content}/>
        </Container>

    );
}