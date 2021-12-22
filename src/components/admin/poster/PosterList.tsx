import {GridSortDirection, GridSortModel} from '@mui/x-data-grid';
import React, {ChangeEvent, useContext, useEffect, useState} from "react";

import {Alert, Button, Card, CardActions, CardMedia, Stack, Typography} from "@mui/material";
import {IPage} from '../../../models/response/IPage';
import {useNavigate, useSearchParams} from "react-router-dom";
import {Delete} from "@mui/icons-material";
import $api, {SERVER_URL} from '../../../http/config';
import LoadingPage from '../../LoadingPage';
import {Context} from '../../..';
import {PosterType} from "../../types/PosterTypes";
import FileService from "../../../services/FileService";


type PosterListState = {
    data: IPage<PosterType>,
    sort: GridSortModel
}

const order: GridSortDirection[] = [
    "asc",
    "desc"
]

export default function PosterList() {
    const navigate = useNavigate();
    const {store} = useContext(Context);

    let [searchParams, setSearchParams] = useSearchParams();
    const filmId = searchParams.get("film");

    const [loaded, setLoaded] = useState<boolean>();
    const [error, setError] = useState<boolean>();

    const [state, setState] = useState<PosterListState>({
        data: {
            size: 5,
            number: 0
        } as IPage<PosterType>,
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

    if ((loaded && error) || filmId === null)
        return (
            <Alert severity='error'>Ошибка</Alert>
        )

    function getAll(requestState: PosterListState) {
        console.log(requestState);
        $api.get<IPage<PosterType>>(`/admin/posters?size=${requestState.data.size}&page=${requestState.data.number}` +
            `&sort=${requestState.sort.filter(x => x.sort === 'asc').map(x => x.field)},asc` +
            `&sort=${requestState.sort.filter(x => x.sort === 'desc').map(x => x.field)},desc` +
            `&film=${filmId}`)
            .then(response => response.data)
            .then(data => {
                setState({
                    data: data,
                    sort: requestState.sort
                });
                setLoaded(true);
                setError(false);
            })
            .catch(error => {
                setError(true);
                setLoaded(true);
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

    if (!loaded)
        return (
            <LoadingPage/>
        )

    async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
        setLoaded(false);
        const files = event.target.files;
        if (files === null || files.length < 1)
            return;
        const file = files[0];
        const base64 = await FileService.toBase64(file);
        const response = await $api.post<PosterType>(`/admin/posters/create`, JSON.stringify({
            filmId: filmId,
            file: base64
        }));
        getAll(state);
    }

    async function deleteFile(posterId: number) {
        setLoaded(false);
        let response = await $api.delete(`/admin/posters/${posterId}`);
        if (response.status !== 200)
            setState({
                ...state,
                error: true,
                loaded: true
            } as PosterListState);
        else
            getAll(state);
    }

    return (
        <>
            <Stack padding={2}>
                <Typography variant='h2'>Film ID: {filmId}</Typography>
                <Button color='warning' variant='outlined' style={{height: 'max-content', width: 'max-content'}}>
                    <label htmlFor='poster-file' style={{width: '100%', height: '100%'}}>
                        <Typography variant='h5'>Добавить</Typography>
                    </label>
                    <input id='poster-file' type='file' accept='image/*' style={{display: 'none'}}
                           onChange={event => uploadFile(event)}/>
                </Button>
                <Stack sx={{flexWrap: 'wrap'}} direction='row' padding={2} alignItems='center'>
                    {state.data.content.map(p =>
                        <Card sx={{maxWidth: 345, margin: 2, backgroundColor: '#2f2f2f'}} key={p.id}>
                            <CardMedia
                                component='img'
                                image={`${SERVER_URL}/files/${p.filename}`}/>
                            <CardActions>
                                <Button color='error' variant='outlined'
                                        onClick={event => deleteFile(p.id)}><Delete/></Button>
                            </CardActions>
                        </Card>
                    )}
                </Stack>
                <Stack justifyContent='center' spacing={2} direction='row'>
                    {!state.data.first &&
                        <Stack justifyContent='center'>
                            <Button variant='outlined' color='warning'
                                    onClick={() => setPage(state.data.number - 1)}>{'<<'}</Button>
                        </Stack>
                    }
                    {!state.data.last &&
                        <Stack justifyContent='center'>
                            <Button variant='outlined' color='warning'
                                    onClick={() => setPage(state.data.number + 1)}>{'>>'}</Button>
                        </Stack>
                    }
                </Stack>
            </Stack>
        </>

    );
}