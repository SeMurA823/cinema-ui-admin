import React, {useContext} from "react";
import Header from "../Header";
import {Context} from "../../index";

interface IGeneralPage {
    children: React.ReactNode
}

export default function GeneralPage(props: IGeneralPage) {
    const {store} = useContext(Context);

    return (
        <>
            <Header/>
            <div style={{height: 80}}/>
            <main style={{minHeight: '100vh'}}>
                {props.children}
            </main>
        </>
    )
}