import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import React, {useCallback, useEffect, useState} from "react";

import {Alert, Button, Stack} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {useNavigate} from "react-router-dom";
import {Block, Done, Warning} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {IUser} from "../../../models/response/IUser";


type UserListState = {
    data: IPage<IUser>,
    sort: GridSortModel
}

type FilmPageProps = {
    navigation?: NavigationType
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {field: 'firstName', headerName: 'Имя', minWidth: 150},
    {field: 'lastName', headerName: 'Фамилия', minWidth: 150},
    {field: 'patronymic', headerName: 'Отчество', minWidth: 150},
    {field: 'birthDate', headerName: 'Дата рождения', minWidth: 100},
    {field: 'gender', headerName: 'Пол', minWidth: 100},
    {
        field: 'userStatus', headerName: 'Статус пользователя', minWidth: 250, renderCell: params => {
            if (params.value === 'ACTIVE')
                return (<>
                    <Done color={'success'}/>
                    <span>{params.value}</span>
                </>)
            if (params.value === 'LOCKED')
                return (<>
                    <Block color={'success'}/>
                    <span>{params.value}</span>
                </>)
            return (<Warning/>)
        }
    },
    {
        field: '', headerName: '', renderCell: params => (
            <Button color='secondary' href={`/roles?user=${params.id}`}>
                Роли...
            </Button>
        )
    }
]

export default function UserList(props: FilmPageProps) {
    const navigate = useNavigate();

    const [state, setState] = useState<UserListState>({
        data: {
            size: 5,
            number: 0
        } as IPage<IUser>,
        sort: [
            {
                field: 'id',
                sort: 'asc'
            }
        ]
    });
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<Array<IUser>>([]);
    const getAllResponse = useCallback(
        () => getAll(state),
        []);

    useEffect(() => {
        getAllResponse();
    }, [getAllResponse])


    function getAll(requestState: UserListState): Promise<void> {
        console.log(requestState);
        const promise = $api.get<IPage<IUser>>(`/users?size=${requestState.data.size}&page=${requestState.data.number}` +
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
                        content: new Array<IUser>()
                    } as IPage<IUser>,
                    sort: requestState.sort
                })
                setError(true);
            }).finally(() => {
                setLoaded(true);
            })
        return promise;
    }


    async function setStatusSelectedUser(status: string) {
        try {
            await $api.post(`/users/edit?status=${status}&id=${selectedRowData.map(x => x.id)}`);
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
                <Button style={{margin: 20}} variant='outlined' color='warning'
                        onClick={() => setStatusSelectedUser('LOCKED')}>
                    <Stack direction='row' alignItems='center'>
                        <Block/>
                        <span>Заблокировать</span>
                    </Stack>
                </Button>
                <Button style={{margin: 20}} variant='outlined' color='warning'
                        onClick={() => setStatusSelectedUser('ACTIVE')}>
                    <Stack direction='row' alignItems='center'>
                        <Done/>
                        <span>Активировать</span>
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