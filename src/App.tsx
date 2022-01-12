import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
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
import UserList from "./components/admin/user/UserList";
import RoleList from "./components/admin/user/RoleList";
import AuthenticatedPage from "./components/pages/AuthenticatedPage";
import FilmMakerList from "./components/admin/maker/FilmMakerList";
import FilmMakerCreate from "./components/admin/maker/FilmMakerCreate";
import FilmMakerEdit from "./components/admin/maker/FilmMakerEdit";
import FilmScreeningList from "./components/admin/screening/FilmScreeningList";
import FilmScreeningCreate from "./components/admin/screening/FilmScreeningCreate";
import FilmScreeningEdit from "./components/admin/screening/FilmScreeningEdit";
import PurchaseList from "./components/admin/purchase/PurchaseList";
import TicketList from "./components/admin/purchase/TicketList";
import moment from "moment";
import 'moment/locale/ru'
import {NotificationList} from "./components/admin/user/NotificationList";

moment.locale('ru');


export function ruMoment(date: Date) {
    return moment(date);
}

function App() {
    const {store} = useContext(Context);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        store.refresh()
            .finally(() => setLoaded(true));
    }, [])

    if (!loaded)
        return (<LoadingPage/>)

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/sign-in' element={<LoginPage/>}/>
                <Route path='/' element={<GeneralPage/>}>
                    <Route path='/' element={<Navigate to='/home'/>}/>
                    <Route path='home' element={<HomePage/>}/>
                    <Route path={'films'} element={<FilmList/>}/>
                    <Route path={'films/:id'} element={<FilmEdit/>}/>
                    <Route path={'films/add'} element={<FilmCreate/>}/>
                    <Route path={'countries'} element={<CountryList/>}/>
                    <Route path={'countries/:id'} element={<CountryEdit/>}/>
                    <Route path={'countries/add'}
                           element={<CountryCreate/>}/>
                    <Route path={'posters'} element={<PosterList/>}/>
                    <Route path={'halls'} element={<HallList/>}/>
                    <Route path={'halls/add'} element={<HallCreate/>}/>
                    <Route path={'halls/:id'} element={<HallEdit/>}/>
                    <Route path={'seats'} element={<SeatList/>}/>
                    <Route path={'users'} element={<UserList/>}/>
                    <Route path={'roles'} element={<RoleList/>}/>
                    <Route path={'notifications'} element={<NotificationList/>}/>
                    <Route path={'makers'} element={<FilmMakerList/>}/>
                    <Route path={'makers/create'}
                           element={<FilmMakerCreate/>}/>
                    <Route path={'makers/:id'} element={<FilmMakerEdit/>}/>
                    <Route path={'screenings'}
                           element={<FilmScreeningList/>}/>
                    <Route path={'screenings/create'}
                           element={<FilmScreeningCreate/>}/>
                    <Route path={'screenings/:id'}
                           element={<FilmScreeningEdit/>}/>
                    <Route path={'purchases'} element={<PurchaseList/>}/>
                    <Route path={'tickets'} element={<TicketList/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default observer(App);
