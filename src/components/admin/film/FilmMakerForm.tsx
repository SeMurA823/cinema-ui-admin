import React, {useState} from "react";
import {Autocomplete, Button, Stack, TextField} from "@mui/material";
import {FilmMakerType} from "../../../models/response/FilmMakerType";
import $api from "../../../http/config";
import {IPage} from "../../../models/response/IPage";

export type FilmMakerFormResult = {
    post: string,
    maker: FilmMakerType
}

type FilmMakerFormProps = {
    open: boolean,
    onSelected(makerRes: FilmMakerFormResult): any
}

export default function FilmMakerForm(props: FilmMakerFormProps) {
    const [makers, setMakers] = useState<Array<FilmMakerType>>([]);
    const [loadedMakers, setLoadedMakers] = useState<boolean>(true);
    const [maker, setMaker] = useState<FilmMakerType>({} as FilmMakerType);
    const [post, setPost] = useState<string>('');
    return (

        <Stack padding={3} spacing={2}>
            <TextField value={post} onChange={(event) => setPost(event.target.value)}/>
            <Autocomplete
                options={makers}
                loading={!loadedMakers}
                onChange={(event, value) => {
                    if (value !== null) {
                        setMaker(value);
                    }
                }}
                getOptionDisabled={(option) => maker === option}
                getOptionLabel={(option) => `${option.lastName} ${option.firstName} ${option.patronymic}`}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant='outlined'
                        onChange={async (event) => {
                            setLoadedMakers(false);
                            let encoded = encodeURI(`/filmmakers?search=${event.target.value}&page=0&size=10`);
                            const response =
                                await $api.get<IPage<FilmMakerType>>(encoded);
                            const data = response.data;
                            setMakers(data.content);
                            setLoadedMakers(true);
                        }}
                        label='Кинодел'/>
                )}
            />
            <Stack alignItems='center'>
                <Button color='success' onClick={() => props.onSelected({
                    maker: maker,
                    post: post
                })}>
                    Готово
                </Button>
            </Stack>
        </Stack>
    )
}