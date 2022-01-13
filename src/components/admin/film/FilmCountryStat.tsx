import React, {useEffect, useState} from 'react'
import {PieComponent} from "../PieComponent";
import {Stack, Typography} from "@mui/material";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Moment} from "moment";

type FilmCountry = {
    country: string,
    count: number
};

type Props = {
    start: Moment,
    end: Moment
}


export const FilmCountryStat = (props: Props) => {
    const [data, setData] = useState<FilmCountry[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        const asyncFoo = async () => {
            try {
                const response =
                    await $api.get<FilmCountry[]>(decodeURI(`/stat/filmcountries?start=${encodeURIComponent(props.start.toISOString(true))}&end=${encodeURIComponent(props.end.toISOString(true))}`));
                setData(response.data);
            } finally {
                setLoaded(true);
            }
        }
        asyncFoo();
    }, [props.start, props.end])


    const dataPie = data.map(d => ({
        id: d.country,
        label: d.country,
        value: d.count.toString(),
    }));

    if (!loaded) {
        return (<LoadingPage/>)
    }

    return (
        <Stack style={{maxWidth: 768, width: '100%'}}>
            <Typography fontWeight={'bold'} align={'center'}>Распределение фильмов по странам</Typography>
            <Stack style={{height: 500, maxWidth: 768, width: '100%'}}>
                <PieComponent data={dataPie}/>
            </Stack>
        </Stack>
    )
}