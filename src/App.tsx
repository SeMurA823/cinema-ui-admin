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

moment.locale('ru');


export function formater(date: Date) {
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
            <GeneralPage>
                <Routes>
                    <Route path='/sign-in' element={<LoginPage/>}/>
                    <Route path='/' element={<AuthenticatedPage><HomePage/></AuthenticatedPage>}/>
                    <Route path={'/films'} element={<AuthenticatedPage><FilmList/></AuthenticatedPage>}/>
                    <Route path={'/films/:id'} element={<AuthenticatedPage><FilmEdit/></AuthenticatedPage>}/>
                    <Route path={'/films/add'} element={<AuthenticatedPage><FilmCreate/></AuthenticatedPage>}/>
                    <Route path={'/countries'} element={<AuthenticatedPage><CountryList/></AuthenticatedPage>}/>
                    <Route path={'/countries/:id'} element={<AuthenticatedPage><CountryEdit/></AuthenticatedPage>}/>
                    <Route path={'/countries/add'} element={<AuthenticatedPage><CountryCreate/></AuthenticatedPage>}/>
                    <Route path={'/posters'} element={<AuthenticatedPage><PosterList/></AuthenticatedPage>}/>
                    <Route path={'/halls'} element={<AuthenticatedPage><HallList/></AuthenticatedPage>}/>
                    <Route path={'/halls/add'} element={<AuthenticatedPage><HallCreate/></AuthenticatedPage>}/>
                    <Route path={'/halls/:id'} element={<AuthenticatedPage><HallEdit/></AuthenticatedPage>}/>
                    <Route path={'/seats'} element={<AuthenticatedPage><SeatList/></AuthenticatedPage>}/>
                    <Route path={'/users'} element={<AuthenticatedPage><UserList/></AuthenticatedPage>}/>
                    <Route path={'/roles'} element={<AuthenticatedPage><RoleList/></AuthenticatedPage>}/>
                    <Route path={'/makers'} element={<AuthenticatedPage><FilmMakerList/></AuthenticatedPage>}/>
                    <Route path={'/makers/create'} element={<AuthenticatedPage><FilmMakerCreate/></AuthenticatedPage>}/>
                    <Route path={'/makers/:id'} element={<AuthenticatedPage><FilmMakerEdit/></AuthenticatedPage>}/>
                    <Route path={'/screenings'} element={<AuthenticatedPage><FilmScreeningList/></AuthenticatedPage>}/>
                    <Route path={'/screenings/create'}
                           element={<AuthenticatedPage><FilmScreeningCreate/></AuthenticatedPage>}/>
                    <Route path={'/screenings/:id'}
                           element={<AuthenticatedPage><FilmScreeningEdit/></AuthenticatedPage>}/>
                    <Route path={'/purchases'} element={<AuthenticatedPage><PurchaseList/></AuthenticatedPage>}/>
                    <Route path={'/tickets'} element={<AuthenticatedPage><TicketList/></AuthenticatedPage>}/>
                </Routes>
            </GeneralPage>
        </BrowserRouter>
    );
}

export default observer(App);
