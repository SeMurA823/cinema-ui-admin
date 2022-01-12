import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import React, {useCallback, useEffect, useState} from "react";

import {Alert, Button, Link, Stack} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {useSearchParams} from "react-router-dom";
import {Block, Done} from "@mui/icons-material";
import $api from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {TicketType} from "../../../models/response/PurchasesTypes";
import {ruMoment} from "../../../App";


type TicketListState = {
    data: IPage<TicketType>,
    sort: GridSortModel
}

type TicketListProps = {
    navigation?: NavigationType
}

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', minWidth: 50},
    {
        field: 'expired', sortable: false, headerName: 'Статус', minWidth: 75, renderCell: params => {
            if (params.row.expired) {
                return (
                    <Block color='error'/>
                )
            }
            return (
                <Done color='success'/>
            )
        }
    },
    {
        field: 'filmScreening', headerName: 'Кинопоказ', minWidth: 150, sortable: false, renderCell: params => (
            <Link href={`/screenings/${params.row.filmScreening.id}`}>
                {ruMoment(new Date(params.row.filmScreening.date)).format('lll')}
            </Link>
        )
    },
    {
        field: 'seat.row', headerName: 'Ряд', minWidth: 200, sortable: false, renderCell: params => (
            <p style={{textAlign: 'center', width: '100%'}}>{params.row.seat.row}</p>
        )
    },
    {
        field: 'seat.number', headerName: 'Место', minWidth: 200, sortable: false, renderCell: params => (
            <p style={{textAlign: 'center', width: '100%'}}>{params.row.seat.number}</p>
        )
    }
]

export default function TicketList(props: TicketListProps) {
    let [searchParams, setSearchParams] = useSearchParams();
    const purchaseId = searchParams.get("purchase");

    const [state, setState] = useState<TicketListState>({
        data: {
            size: 5,
            number: 0
        } as IPage<TicketType>,
        sort: [
            {
                field: 'id',
                sort: 'asc'
            }
        ]
    });
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<Array<TicketType>>([]);
    const getAllResponse = useCallback(
        () => getAll(state),
        []);

    useEffect(() => {
        getAllResponse();
    }, [getAllResponse])


    function getAll(requestState: TicketListState): Promise<void> {
        console.log(requestState);
        return $api.get<IPage<TicketType>>(`/tickets?anystatus&purchase=${purchaseId}&size=${requestState.data.size}&page=${requestState.data.number}` +
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
                        content: new Array<TicketType>()
                    } as IPage<TicketType>,
                    sort: requestState.sort
                })
                setError(true);
            }).finally(() => {
                setLoaded(true);
            })
    }


    async function cancelSelectedTickets() {
        try {
            await $api.post(`/tickets/cancel?id=${selectedRowData.map(x => x.id)}`);
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
                        onClick={() => cancelSelectedTickets()}>
                    <Stack direction='row' alignItems='center'>
                        <Block/>
                        <span>Отменить</span>
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
                      disableColumnFilter={true}
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