import React, {useEffect, useState} from "react";
import $api from "../../../http/config";
import LoadingPage from "../../LoadingPage";
import {Stack, Typography} from "@mui/material";
import {PieComponent} from "../PieComponent";
import {Moment} from "moment";

type LimitCountry = {
    limit: string,
    count: number
};

type Props = {
    start: Moment,
    end: Moment
}

export default function FilmAgeLimitStat(props: Props) {
    const [data, setData] = useState<LimitCountry[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        const asyncFoo = async () => {
            try {
                const response = await $api.get<LimitCountry[]>(encodeURI(`/stat/filmlimits?start=${encodeURIComponent(props.start.toISOString(true))}&end=${encodeURIComponent(props.end.toISOString(true))}`));
                setData(response.data);
            } finally {
                setLoaded(true);
            }
        }
        asyncFoo();
    }, [props.start, props.end])


    const dataPie = data.map(d => ({
        id: d.limit.toString(),
        label: d.limit.toString(),
        value: d.count.toString(),
    }));

    if (!loaded) {
        return (<LoadingPage/>)
    }

    return (
        <Stack style={{maxWidth: 768, width: '100%'}}>
            <Typography fontWeight={'bold'} align={'center'}>Распределение фильмов по возврастным
                ограничениям</Typography>
            <Stack style={{height: 500, maxWidth: 768, width: '100%'}}>
                <PieComponent data={dataPie}/>
            </Stack>
        </Stack>
    )
}