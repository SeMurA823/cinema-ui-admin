import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import AuthenticatedPage from "./AuthenticatedPage";

function GeneralPage() {
    return (
        <AuthenticatedPage>
            <Header/>
            <div style={{height: 80}}/>
            <main style={{minHeight: '100vh'}}>
                <Outlet/>
            </main>
        </AuthenticatedPage>
    )
}

export default observer(GeneralPage);