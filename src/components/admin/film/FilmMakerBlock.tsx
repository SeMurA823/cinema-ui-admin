import React, {useEffect, useState} from "react";
import {FilmMakerType} from "../../types/FilmMakerType";
import {Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import FilmMakerForm, {FilmMakerFormResult} from "./FilmMakerForm";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";

type FilmMakerBlockProps = {
    filmId: number
};

type Dictionary = { [key: string]: FilmMakerType[] };

export default function FilmMakerBlock(props: FilmMakerBlockProps) {
    const [makers, setMakers] = useState<Dictionary>({} as Dictionary);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);


    useEffect(() => {
        getPosts()
    }, [])

    async function getPosts() {
        try {
            setLoaded(false);
            const response = await $api.get<Dictionary>(`/filmmakers?film=${props.filmId}`);
            const data: Dictionary = response.data;
            console.log(data);
            setMakers(data);
            setError(false);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    async function setPost(makerRes: FilmMakerFormResult) {
        try {
            setLoaded(false);
            await $api.post(`/filmmakers/relate`, JSON.stringify({
                film: props.filmId,
                maker: makerRes.maker.id,
                post: makerRes.post
            }))
            await getPosts();
            setError(false);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    async function deletePost(makerID: number, post: string) {
        try {
            setLoaded(false);
            await $api.delete(`/filmmakers?maker=${makerID}&post=${post}&film=${props.filmId}`)
            await getPosts();
            setError(false);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }


    if (!loaded)
        return (<LoadingPage/>)

    return (
        <Stack spacing={2}>
            Киноделы:
            <Stack>
                {Object.keys(makers).map(k => (
                    <Card key={k} style={{margin: 10, padding: 10, backgroundColor: '#6e6e6e'}}>
                        <CardContent>
                            <Typography color={'white'} align={'center'} variant={'h4'}
                                        fontWeight={'bolder'}>{k}</Typography>
                            <Divider/>
                            <Stack spacing={2}>
                                {
                                    makers[k]?.map(maker => (
                                        <Stack direction={'row'} key={maker.id} width={'100%'}>
                                            <Button variant={'contained'} href={`/makers/${maker.id}`}
                                                    style={{width: '100%'}}>{maker.lastName} {maker.firstName} {maker.patronymic}</Button>
                                            <Button variant={'contained'} color={'error'}
                                                    onClick={() => deletePost(maker.id, k)}>
                                                <Delete/>
                                            </Button>
                                        </Stack>
                                    ))
                                }
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <Stack alignItems={'center'}>
                <Button color='success' variant='outlined' onClick={() => setOpenMenu(true)}>
                    <Add/>
                </Button>
            </Stack>
            {openMenu &&
                <Dialog open={openMenu} onClose={() => setOpenMenu(false)}>
                    <DialogTitle>Киноделы</DialogTitle>
                    <DialogContent>
                        <FilmMakerForm open={openMenu} onSelected={(maker) => {
                            setOpenMenu(false);
                            setPost(maker);
                        }}/>
                    </DialogContent>
                </Dialog>
            }
        </Stack>
    )
}