import {DataGrid, GridColDef} from '@mui/x-data-grid';
import React, {useCallback, useEffect, useState} from "react";

import {Alert, Button, Stack} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Add, Block} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {RoleType} from "../../types/RoleTypes";


type RoleListState = {
    data: Array<RoleType>,
}

type FilmPageProps = {
    navigation?: NavigationType
}


export default function RoleList(props: FilmPageProps) {
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const userId = searchParams.get("user");

    const [state, setState] = useState<RoleListState>({
        data: []
    });

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<Array<RoleType>>([]);
    const getAllResponse = useCallback(
        () => getAll(state),
        []);

    useEffect(() => {
        getAllResponse();
    }, [getAllResponse])

    const columns: GridColDef[] = [
        {field: 'role', headerName: 'Роль', minWidth: 150},
        {
            field: '', headerName: '', minWidth: 250, renderCell: params => (
                <Button color='warning' onClick={() => demote([params.id as number])}>
                    Разжаловать
                </Button>
            )
        }
    ]

    function getAll(requestState: RoleListState): Promise<void> {
        console.log(requestState);
        return $api.get<Array<RoleType>>(`/roles?user=${userId}`)
            .then(response => response.data)
            .then(data => {
                setState({
                    data: data,
                })
                setError(false);
                setSelectedRowData([]);
            })
            .catch(error => {
                setState({
                    data: [],
                })
                setError(true);
            }).finally(() => {
                setLoaded(true);
            })
    }


    async function demote(ids: number[]) {
        try {
            await $api.post(`/roles/demote?id=${ids}`);
            getAll(state);
        } catch (e) {
            setError(true);
        }
    }

    async function create(role: string) {
        try {
            await $api.post(`/roles/create?role=${role}&user=${userId}`);
            getAll(state);
        } catch (e) {
            setError(true);
        }
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
                <Button style={{margin: 20}} color='success' variant='outlined' onClick={() => create('ADMIN')}>
                    <Stack direction='row' alignItems='center'>
                        <Add/>
                        <span>Админ</span>
                    </Stack>
                </Button>
                <Button style={{margin: 20}} color='success' variant='outlined' onClick={() => create('EMPLOYEE')}>
                    <Stack direction='row' alignItems='center'>
                        <Add/>
                        <span>Работник</span>
                    </Stack>
                </Button>
                <Button style={{margin: 20}} color='success' variant='outlined' onClick={() => create('CUSTOMER')}>
                    <Stack direction='row' alignItems='center'>
                        <Add/>
                        <span>Пользователь</span>
                    </Stack>
                </Button>
                <Button style={{margin: 20}} variant='outlined' color='warning'
                        onClick={() => demote(selectedRowData.map(x => x.id))}>
                    <Stack direction='row' alignItems='center'>
                        <Block/>
                        <span>Разжаловать</span>
                    </Stack>
                </Button>
            </Stack>
            <DataGrid
                checkboxSelection
                onSelectionModelChange={(ids) => {
                    console.log(ids);
                    const selectedIDs = new Set(ids);
                    const rowData = state.data.filter((row) =>
                        selectedIDs.has(row.id)
                    );
                    setSelectedRowData(rowData);
                }}
                isRowSelectable={params => true}
                editMode='row'
                columns={columns}
                rowCount={state.data.length}
                autoHeight
                rows={state.data}/>
        </>

    );
}