import React, {useState} from "react";
import {Button, Stack, TextField} from "@mui/material";
import $api from "../../../http/config";

type Props = {
    userId: number,
    onSubmit: (text: string) => any
}

export const NotifyComponent = (props: Props) => {

    const [text, setText] = useState<string>('');

    const [error, setError] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(true);

    const notify = async () => {
        setLoaded(false);
        setError(false);
        try {
            await $api.post(`/notifications/create`, JSON.stringify({
                'user': props.userId,
                'message': text
            }));
            props.onSubmit(text);
        } catch (e) {
            setError(true);
        } finally {
            setLoaded(true);
        }
    }

    return (
        <Stack alignItems={'center'}>
            <TextField placeholder={'Сообщение'} error={error} value={text}
                       onChange={event => setText(event.target.value)} variant={'outlined'}
                       disabled={!loaded} fullWidth/>
            <Button color={'success'} variant={'outlined'} disabled={!loaded}
                    onClick={() => notify()}>Отправить</Button>
        </Stack>
    )
}