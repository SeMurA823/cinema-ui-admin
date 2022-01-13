import {observer} from "mobx-react-lite";
import React from "react";
import {Outlet} from "react-router-dom";
import Header from "../Header";
import AuthenticatedPage from "./AuthenticatedPage";
import {Container} from "@mui/material";

function GeneralPage() {
    return (
        <AuthenticatedPage>
            <Header/>
            <div style={{height: 80}}/>
            <Container style={{minHeight: '100vh'}} maxWidth={'xl'}>
                <Outlet/>
            </Container>
        </AuthenticatedPage>
    )
}

export default observer(GeneralPage);