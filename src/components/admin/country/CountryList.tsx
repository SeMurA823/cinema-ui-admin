import {DataGrid, GridColDef, GridSortDirection, GridSortModel} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Stack} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {useNavigate} from "react-router-dom";
import {Add} from "@mui/icons-material";
import {CountryType} from "../../types/CountryTypes";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {Context} from '../../..';


type CountryListState = {
    loaded: boolean,
    error: boolean,
    data: IPage<CountryType>,
    sort: GridSortModel
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {field: 'fullName', headerName: 'Полное название', minWidth: 200},
    {field: 'shortName', headerName: 'Краткое название', minWidth: 100}
]

const order: GridSortDirection[] = [
    "asc",
    "desc"
]

export default function CountryList() {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const [state, setState] = useState<CountryListState>({
        loaded: false,
        error: false,
        data: {
            size: 5,
            number: 0
        } as IPage<CountryType>,
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


    function getAll(requestState: CountryListState) {
        console.log(requestState);
        $api.get<IPage<CountryType>>(`/countries?size=${requestState.data.size}&page=${requestState.data.number}` +
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
                    data: {} as IPage<CountryType>,
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
            <Button style={{margin: 20}} variant='outlined' color='warning' href={`/countries/add`}>
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
                          navigate(`/countries/${params.getValue(params.id, 'id')}`)
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