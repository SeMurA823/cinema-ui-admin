import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import React, {useCallback, useEffect, useState} from "react";

import {Alert, Button, Container, Stack, Typography} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {Block} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {PurchaseType} from "../../types/PurchasesTypes";
import {ruMoment} from "../../../App";


type PurchaseState = {
    data: IPage<PurchaseType>,
    sort: GridSortModel
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {
        field: 'user', headerName: 'Покупатель', minWidth: 500, renderCell:
            params =>
                (<p>
                    {params.row.user.firstName} {params.row.user.lastName} {params.row.user.patronymic}
                </p>)
    },
    {
        field: 'created', headerName: 'Дата', minWidth: 350, renderCell: params =>
            (<p>{ruMoment(new Date(params.row.created)).format('DD-MM-YYYY h:mm:ss')}</p>)
    },
    {
        field: '', headerName: '', renderCell: params => (
            <Button color='secondary' href={`/tickets?purchase=${params.id}`}>
                Билеты...
            </Button>
        )
    }
]

export default function PurchaseList() {

    const [state, setState] = useState<PurchaseState>({
        data: {
            size: 5,
            number: 0
        } as IPage<PurchaseType>,
        sort: [
            {
                field: 'id',
                sort: 'asc'
            }
        ]
    });
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<Array<PurchaseType>>([]);
    const getAllResponse = useCallback(
        () => getAll(state),
        []);

    useEffect(() => {
        getAllResponse();
    }, [getAllResponse])


    function getAll(requestState: PurchaseState): Promise<void> {
        console.log(requestState);
        const promise = $api.get<IPage<PurchaseType>>(`/purchases?anystatus&size=${requestState.data.size}&page=${requestState.data.number}` +
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
                        content: new Array<PurchaseType>()
                    } as IPage<PurchaseType>,
                    sort: requestState.sort
                })
                setError(true);
            }).finally(() => {
                setLoaded(true);
            })
        return promise;
    }


    async function cancelSelectedPurchases() {
        try {
            await $api.post(`/purchases/cancel?id=${selectedRowData.map(x => x.id)}`);
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
        <Container>
            <Typography variant='h2' fontWeight='bold' color={'blue'}>Продажи</Typography>
            {(loaded && error) &&
                <Alert severity='error'>Ошибка</Alert>
            }
            <Stack direction='row'>
                <Button style={{margin: 20}} variant='outlined' color='warning'
                        onClick={() => cancelSelectedPurchases()}>
                    <Stack direction='row' alignItems='center'>
                        <Block/>
                        <span>Отмена</span>
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
        </Container>

    );
}