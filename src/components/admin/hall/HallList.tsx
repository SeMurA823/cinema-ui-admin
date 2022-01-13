import {DataGrid, GridColDef, GridSortDirection, GridSortModel} from '@mui/x-data-grid';
import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Stack, Typography} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {useNavigate} from "react-router-dom";
import {Add} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {Context} from '../../..';
import {HallType} from "../../../models/response/HallTypes";


type HallListState = {
    data: IPage<HallType>,
    sort: GridSortModel
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {field: 'name', headerName: 'Название', minWidth: 200},
    {
        field: '',
        headerName: 'Места',
        renderCell: params => (<Button href={`/seats?hall=${params.id}`}>Места...</Button>)
    }
]

const order: GridSortDirection[] = [
    "asc",
    "desc"
]

export default function HallList() {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    const [edited, setEdited] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [state, setState] = useState<HallListState>({
        data: {
            size: 5,
            number: 0
        } as IPage<HallType>,
        sort: [
            {
                field: 'id',
                sort: 'asc'
            }
        ]
    });

    useEffect(() => {
        let cleanupFoo = false;
        const asyncFoo = async () => {
            console.log('TEST')
            try {
                const response = await $api.get<IPage<HallType>>(`/admin/halls?size=${state.data.size}&page=${state.data.number}` +
                    `&sort=${state.sort.filter(x => x.sort === 'asc').map(x => x.field)},asc&sort=${state.sort.filter(x => x.sort === 'desc').map(x => x.field)},desc`);
                if (!cleanupFoo) {
                    setState({
                        ...state,
                        data: response.data
                    })
                }
            } catch (e) {
                if (!cleanupFoo) {
                    setError(true);
                }
            } finally {
                if (!cleanupFoo) {
                    setLoaded(true);
                }
            }
        };
        asyncFoo();
        return () => {
            cleanupFoo = true
        };
    }, [edited])


    async function getAll(requestState: HallListState) {
        setLoaded(false);
        try {
            const response = await $api.get<IPage<HallType>>(`/halls?anystatus&size=${requestState.data.size}&page=${requestState.data.number}` +
                `&sort=${requestState.sort.filter(x => x.sort === 'asc').map(x => x.field)},asc&sort=${requestState.sort.filter(x => x.sort === 'desc').map(x => x.field)},desc`);
            setState({
                ...state
            })
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
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

    if (loaded && error)
        return (
            <Alert severity='error'>Ошибка</Alert>
        )

    if (!loaded)
        return (
            <LoadingPage/>
        )

    return (
        <>
            <Typography color={'blue'} variant={'h3'} fontWeight={'bold'}>Залы</Typography>
            <Button style={{margin: 20}} variant='outlined' color='warning' href={`/halls/add`}>
                <Stack direction='row' alignItems='center'>
                    <Add/>
                    <span>Добавить</span>
                </Stack>
            </Button>
            <DataGrid pageSize={state.data.size}
                      isRowSelectable={() => false}
                      editMode='row'
                      autoHeight
                      columns={columns}
                      onRowDoubleClick={(params, event, details) => {
                          navigate(`/halls/${params.getValue(params.id, 'id')}`)
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