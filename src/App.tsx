import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import HomePage from "./components/pages/HomePage";
import {Context} from "./index";
import {observer} from "mobx-react-lite"
import GeneralPage from "./components/pages/GeneralPage";
import FilmList from "./components/admin/film/FilmList";
import FilmEdit from "./components/admin/film/FilmEdit";
import LoadingPage from "./components/LoadingPage";
import FilmCreate from "./components/admin/film/FilmCreate";
import CountryList from "./components/admin/country/CountryList";
import CountryEdit from "./components/admin/country/CountryEdit";
import CountryCreate from "./components/admin/country/CountryCreate";
import PosterList from "./components/admin/poster/PosterList";
import HallList from "./components/admin/hall/HallList";
import HallCreate from "./components/admin/hall/HallCreate";
import HallEdit from "./components/admin/hall/HallEdit";
import SeatList from "./components/admin/seats/SeatList";

function App() {
    const {store} = useContext(Context);
    const [isAuth, setIsAuth] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
        if (localStorage.getItem('token')) {
            store.refresh()
                .then(() => {
                    setIsAuth(true);
                    setLoaded(true);
                })
        } else {
            setLoaded(true);
        }
    }, [])

    if (!store.loaded)
        return (<LoadingPage/>)

    return (
        <BrowserRouter>
            <GeneralPage>
                <Routes>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/sign-in' element={<LoginPage/>}/>
                </Routes>
                <Routes>
                    <Route path={'/films'} element={<FilmList/>}/>
                    <Route path={'/films/:id'} element={<FilmEdit/>}/>
                    <Route path={'/films/add'} element={<FilmCreate/>}/>
                </Routes>
                <Routes>
                    <Route path={'/countries'} element={<CountryList/>}/>
                    <Route path={'/countries/:id'} element={<CountryEdit/>}/>
                    <Route path={'/countries/add'} element={<CountryCreate/>}/>
                </Routes>
                <Routes>
                    <Route path={'/posters'} element={<PosterList/>}/>
                </Routes>
                <Routes>
                    <Route path={'/halls'} element={<HallList/>}/>
                    <Route path={'/halls/add'} element={<HallCreate/>}/>
                    <Route path={'/halls/:id'} element={<HallEdit/>}/>
                </Routes>
                <Routes>
                    <Route path={'/seats'} element={<SeatList/>}/>
                </Routes>
            </GeneralPage>
        </BrowserRouter>
    );
}

export default observer(App);
