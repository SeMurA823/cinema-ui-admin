import React, {ReactNode, useContext} from "react";
import {Navigate} from "react-router-dom";
import {Context} from "../../index";
import LoadingPage from "../LoadingPage";

type AuthenticatedPageProps = {
    children: ReactNode;
}

export default function AuthenticatedPage(props: AuthenticatedPageProps) {
    const {store} = useContext(Context);

    if (!store.loaded)
        return (<LoadingPage/>)

    if (!store.isAuth) {
        return (<Navigate to={'/sign-in'}/>)
    }

    return (
        <>
            {props.children}
        </>);
}