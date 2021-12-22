import {DataGrid, GridColDef, GridSortDirection, GridSortModel} from '@mui/x-data-grid';
import React, {useEffect, useState} from "react";

import {Alert, Button, Stack} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {Add, Block, Done} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {ScreeningType} from "../../types/ScreeningTypes";


type ScreeningListState = {
    loaded: boolean,
    error: boolean,
    data: IPage<ScreeningType>,
    sort: GridSortModel
}

type ScreeningPageProps = {
    navigation?: NavigationType
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {field: 'date', headerName: 'Дата', minWidth: 200},
    {field: 'price', headerName: 'Цена', minWidth: 100},
    {
        field: 'active',
        headerName: 'Активен',
        minWidth: 80,
        sortable: false,
        align: 'center',
        renderCell: (params) => (params.value ? <Done color='success'/> : <Block color='error'/>)
    },
    {
        field: 'hall',
        headerName: 'Зал',
        minWidth: 100,
        renderCell: params => <Link to={`/halls/${params.value.id}`}>{params.value.name}</Link>
    },
    {
        field: '',
        headerName: 'Билеты',
        minWidth: 100,
        renderCell: params => (
            <Button color='secondary' variant='outlined' href={`/tickets?screening=${params.id}`}>Билеты...</Button>)
    }
]

const order: GridSortDirection[] = [
    "asc",
    "desc"
]

export default function FilmScreeningList(props: ScreeningPageProps) {
    let [searchParams, setSearchParams] = useSearchParams();
    const filmId = searchParams.get("film");

    const navigate = useNavigate();

    const [state, setState] = useState<ScreeningListState>({
        loaded: false,
        error: false,
        data: {
            size: 5,
            number: 0
        } as IPage<ScreeningType>,
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


    function getAll(requestState: ScreeningListState) {
        $api.get<IPage<ScreeningType>>(`/screenings?film=${filmId}&size=${requestState.data.size}&page=${requestState.data.number}` +
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
                    data: {} as IPage<ScreeningType>,
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
            <Button style={{margin: 20}} variant='outlined' color='warning' href={`/screenings/create?film=${filmId}`}>
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
                          navigate(`/screenings/${params.getValue(params.id, 'id')}?film=${filmId}`)
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