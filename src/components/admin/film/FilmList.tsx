import {DataGrid, GridColDef, GridSortDirection, GridSortModel} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Stack} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {FilmType} from "../../pages/FilmTypes";
import {Link, useNavigate} from "react-router-dom";
import {Add, Block, Done} from "@mui/icons-material";
import {CountryType} from "../../pages/CountryTypes";
import {Context} from '../../..';
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';


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
    {field: 'localPremiere', headerName: 'Местная премьера', minWidth: 100},
    {field: 'worldPremiere', headerName: 'Мировая премьера', minWidth: 100},
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
        renderCell: params => <Link to={`/age/${params.value.id}`}>{params.value.value}</Link>
    },
    {
        field: 'countries', headerName: 'Страны', minWidth: 300, renderCell: params => {
            const countries: CountryType[] = params.value;
            return (<Stack direction='row' spacing={1}>
                {countries.map(c => (<Button key={c.id} href={`/countries/${c.id}`} size='small' variant='outlined'
                                             color='secondary'>{c.shortName}</Button>))}
            </Stack>)
        }
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


    function getAll(requestState: FilmListState) {
        console.log(requestState);
        $api.get<IPage<FilmType>>(`/admin/films?size=${requestState.data.size}&page=${requestState.data.number}` +
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
        <>
            <Button style={{margin: 20}} variant='outlined' color='warning' href={`/films/add`}>
                <Stack direction='row' alignItems='center'>
                    <Add/>
                    <span>Добавить</span>
                </Stack>
            </Button>
            <DataGrid pageSize={state.data.size}
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
        </>

    );
}