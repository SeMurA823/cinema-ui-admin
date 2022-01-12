import React, {useCallback, useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useSearchParams} from "react-router-dom";
import {RoleType} from "../../../models/response/RoleTypes";
import {Button, Stack} from "@mui/material";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {NotificationType} from "../../../models/response/IUser";
import {IPage} from "../../../models/response/IPage";
import {NotifyComponent} from "./NotifyComponent";

type RoleListState = {
    data: IPage<NotificationType>
}

export const NotificationList = () => {

    let [searchParams, setSearchParams] = useSearchParams();
    const userId = searchParams.get("user");

    const [state, setState] = useState<IPage<NotificationType>>({content: [] as NotificationType[], number: 0, size: 20} as IPage<NotificationType>);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<NotificationType[]>([]);

    useEffect(() => {
        getNotifications(0,20)
    }, [])

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', minWidth: 100, sortable: false},
        {field: 'message', headerName: 'Сообщение', minWidth: 400, sortable: false}
    ]

    const getNotifications = async (page: number, size: number) => {
        setLoaded(false);
        setError(false);
        setSelectedRowData([]);
        try {
            const response =
                await $api.get<IPage<NotificationType>>(`/notifications?user=${userId}&page=${page}&size=${size}`);
            setState(response.data);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }


    return (
        <Stack>
            <Stack>
                <NotifyComponent userId={Number(userId)} onSubmit={()=>getNotifications(0,state.size)}/>
            </Stack>
            <DataGrid
                loading={!loaded}
                paginationMode={'server'}
                autoPageSize
                checkboxSelection
                onSelectionModelChange={(ids) => {
                    console.log(ids);
                    const selectedIDs = new Set(ids);
                    const rowData = state.content.filter((row) =>
                        selectedIDs.has(row.id)
                    );
                    setSelectedRowData(rowData);
                }}
                pagination
                rowsPerPageOptions={[5, 20, 50]}
                onPageSizeChange={pageSize => getNotifications(state.number, pageSize)}
                onPageChange={page => getNotifications(page, state.size)}
                page={state.number}
                pageSize={state.size}
                isRowSelectable={params => true}
                editMode='row'
                columns={columns}
                rowCount={state.totalElements}
                autoHeight
                rows={state.content}/>
        </Stack>
    )
}