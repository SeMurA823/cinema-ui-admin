import React, {useEffect, useState} from "react";
import $api from "../../../http/config";
import {Moment} from "moment";
import {Button, Stack} from "@mui/material";
import LoadingPage from "../../LoadingPage";
import {ruMoment} from "../../../App";


type Props = {
    hallId: number,
    date: Moment
}

type TimingScreenings = {
    filmName: string,
    start: string,
    end: string
}


export const ScheduleScreenings = (props: Props) => {
    const [screenings, setScreenings] = useState<TimingScreenings[]>([]);

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const asyncFoo = async () => {
            setLoaded(false);
            try {
                let response =
                    await $api.get<TimingScreenings[]>(`/screenings?hall=${props.hallId}&start=${props.date.startOf('day').toISOString()}&end=${props.date.endOf('day').toISOString()}`);
                setScreenings(response.data);
            } catch (e) {
                setScreenings([]);
            } finally {
                setLoaded(true);
            }
        }
        if (props.date.isValid())
            asyncFoo();
    }, [props.hallId, props.date])

    if (!loaded)
        return (
            <LoadingPage/>
        )

    return (
        <Stack spacing={1}>
            {
                screenings.map(s => <Button color={'error'} key={s.start}
                                            variant={'outlined'}>
                    {ruMoment(new Date(s.start)).format('LT')} - {ruMoment(new Date(s.end)).format('LT')}
                </Button>)
            }
        </Stack>
    )
}