import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import React, {useCallback, useEffect, useState} from "react";

import {Alert, Button, Stack} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {useNavigate, useSearchParams} from "react-router-dom";
import {Add, Block, Delete, Done} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {IUser} from "../../../models/response/IUser";
import {FilmMakerType} from "../../../models/response/FilmMakerType";


type UserListState = {
    data: IPage<FilmMakerType>,
    sort: GridSortModel
}


const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {field: 'firstName', headerName: 'Имя', minWidth: 150},
    {field: 'lastName', headerName: 'Фамилия', minWidth: 150},
    {field: 'patronymic', headerName: 'Отчество', minWidth: 150},
    {
        field: 'active', headerName: 'Status', minWidth: 50, renderCell: params => {
            if (params.getValue(params.id, 'active'))
                return (<Done color='success'/>)
            return (<Block color='error'/>)
        }
    }
]

export default function FilmMakerList() {
    let [searchParams, setSearchParams] = useSearchParams();
    const filmId = searchParams.get("film");

    const navigate = useNavigate();

    const [state, setState] = useState<UserListState>({
        data: {
            size: 5,
            number: 0
        } as IPage<FilmMakerType>,
        sort: [
            {
                field: 'id',
                sort: 'asc'
            }
        ]
    });
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<Array<FilmMakerType>>([]);
    const getAllResponse = useCallback(
        () => getAll(state),
        []);

    useEffect(() => {
        getAllResponse();
    }, [getAllResponse])


    function getAll(requestState: UserListState): Promise<void> {
        console.log(requestState);
        const promise = $api.get<IPage<FilmMakerType>>(`/filmmakers?anystatus&size=${requestState.data.size}&page=${requestState.data.number}` +
            `&sort=${requestState.sort.filter(x => x.sort === 'asc').map(x => x.field)},asc&sort=${requestState.sort.filter(x => x.sort === 'desc').map(x => x.field)},desc`)
            .then(response => response.data)
            .then(data => {
                setState({
                    data: data,
                    sort: requestState.sort
                })
                setError(false);
            })
            .catch(error => {
                setState({
                    data: {
                        content: new Array<FilmMakerType>()
                    } as IPage<IUser>,
                    sort: requestState.sort
                })
                setError(true);
            }).finally(() => {
                setLoaded(true);
            })
        return promise;
    }


    async function deleteFilmMakers() {
        try {
            await $api.delete(`/filmmakers?id=${selectedRowData.map(x => x.id)}`);
            getAll(state);
        } catch (e) {
            setError(true);
        }
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

    if (!loaded)
        return (
            <LoadingPage/>
        )

    return (
        <>
            {(loaded && error) &&
                <Alert severity='error'>Ошибка</Alert>
            }
            <Stack direction='row'>
                <Button style={{margin: 20}} variant='outlined' color='success' href='/makers/create'>
                    <Stack direction='row' alignItems='center'>
                        <Add/>
                        <span>Добавить</span>
                    </Stack>
                </Button>
                <Button style={{margin: 20}} variant='outlined' color='warning'
                        onClick={() => deleteFilmMakers()}>
                    <Stack direction='row' alignItems='center'>
                        <Delete/>
                        <span>Удалить</span>
                    </Stack>
                </Button>
            </Stack>
            <DataGrid pageSize={state.data.size}
                      checkboxSelection
                      onSelectionModelChange={(ids) => {
                          console.log(ids);
                          const selectedIDs = new Set(ids);
                          const rowData = state.data.content.filter((row) =>
                              selectedIDs.has(row.id)
                          );
                          setSelectedRowData(rowData);
                      }}
                      isRowSelectable={params => true}
                      onRowDoubleClick={params => navigate(`/makers/${params.id}`)}
                      editMode='row'
                      columns={columns}
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
                      autoHeight
                      page={state.data.number}
                      rows={state.data.content}/>
        </>

    );
}