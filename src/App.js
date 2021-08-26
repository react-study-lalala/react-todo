import { Switch, Route } from "react-router-dom";
import React, { useCallback } from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUser, Types } from './modules/user'
import useFetchInfo from "./lib/useFetchInfo";
import lazyIdle from "./lib/lazyIdle";

import {
  makeStyles,
  AppBar,
  SwipeableDrawer,
  ListItem,
  Toolbar,
  IconButton,
  Typography,
  Link,
  List,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const routes = [
  { path: '/register', component: lazyIdle(() => import('./page/Register')) },
  { path: '/login', component: lazyIdle(() => import('./page/Login')) },
  { path: '/logout', component: lazyIdle(() => import('./page/Logout')) },
  { path: '/profile', component: lazyIdle(() => import('./page/Profile')) },
  { path: '/todo', component: lazyIdle(() => import('./page/Todo')) },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [toggle, setToggle] = useState(false)
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  const onLoadUser = useCallback(() => dispatch(getUser()), [dispatch])
  const { isFetched } = useFetchInfo(Types.GET_USER)
  const classes = useStyles();

  const toggleDrawer = (val) => () => {
    setToggle(val);
  };


  useEffect(() => {
    if (user) setIsLoggedIn(true)
    else setIsLoggedIn(false)
  }, [user])

  useEffect(() => {
    if (!isFetched) {
      onLoadUser()
    }
  }, [onLoadUser, isFetched])

  return (<>
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {user ? <Typography>{user.name}'s Todo</Typography> : <Typography>Todo App</Typography>}
        </Typography>
        <Link color="inherit" component={RouterLink} to={!isLoggedIn ? '/login' : '/logout'} >
          {!isLoggedIn ? '로그인' : '로그아웃'}
        </Link>
      </Toolbar>
    </AppBar>
    <SwipeableDrawer
      anchor="left"
      open={toggle}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <List>
        {
          (!isLoggedIn ? [
            { path: '/register', name: '회원가입', icon: PersonAddIcon },
            { path: '/login', name: '로그인', icon: VpnKeyIcon },
          ] : [
            { path: '/profile', name: '프로필', icon: AccountBoxIcon },
            { path: '/todo', name: '할일', icon: AssignmentTurnedInIcon },
            { path: '/logout', name: '로그아웃', icon: ExitToAppIcon },
          ]).map(({ path, name, icon: Icon }) =>
            <ListItem button key={path} component={RouterLink} to={path}>
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          )
        }
      </List>
    </SwipeableDrawer>
    <Switch>
      {routes.map(({ path, exact, component: Component }) => <Route key={path} path={path} exact={exact}><Component /></Route>)}
    </Switch>
  </>
  );
}

export default App;
