import {CircularProgress, Stack} from "@mui/material";

export default function LoadingPage() {
    return (
        <Stack alignItems='center'
               justifyContent='center'
               style={{minHeight: '100vh', minWidth: '100%'}}>
            <CircularProgress/>
        </Stack>)
}