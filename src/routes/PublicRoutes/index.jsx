import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  actionReLogin } from '../../redux/features/auth/authSlice'
import { history } from '../helper/history';
import { isObjectEmpty } from '../../utils/helpers';
import { useEffect } from 'react';
import { RouteName } from '../../routes/RouteName';

export { PublicRoute };

function PublicRoute({ children }) {
    const { isAuth, currentUser, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch()

    const access_token = localStorage.getItem("access_token") || ""

    if (!isAuth && !access_token) {
        return <Navigate to={RouteName.LOGIN.path} />
    } 

    if (access_token && isObjectEmpty(currentUser) && !isLoading) {
        dispatch(actionReLogin())
    }

    return children;
}