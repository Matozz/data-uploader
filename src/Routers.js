import React, { useEffect, useState } from "react";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import ErrorPage from "./pages/Error/Error";
import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
} from "react-router-dom";
import Quiz from "./pages/Quiz/Quiz";
import Navigator from "./components/Navigator/Navigator";
import Welcome from "./pages/Welcome/Welcome";

const routerArr = [
  {
    path: "/login",
    component: Auth,
  },
  {
    path: "/error",
    component: ErrorPage,
  },
  {
    path: "/",
    component: Welcome,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/quiz",
    component: Quiz,
  },
];

function RouterGuard() {
  const [isLogin, setIsLogin] = useState(false);
  let location = useLocation();
  let { pathname } = location;
  // 拿到当前路由
  let thisRoute = routerArr.find((el) => el["path"] === pathname);

  useEffect(() => {
    setIsLogin(Number(sessionStorage.getItem("isLogin")));
  }, [isLogin]);

  //如果没登录且页面为登录页的话渲染登录页
  if (pathname === "/login" && isLogin !== 1) {
    return <Route path={pathname} component={thisRoute["component"]} exact />;
  }
  //如果已经登录渲染页面
  if (isLogin === 1) {
    //如果登陆了跳转login页，则重定向
    if (pathname === "/login") {
      return <Redirect to="/" />;
    }
    if (thisRoute) {
      return <Route path={pathname} component={thisRoute["component"]} exact />;
    } else {
      return <Redirect to="/error" />;
    }
  } else {
    // 否则跳转到登录页
    return <Redirect to="/login" />;
  }
}
function Routes() {
  return (
    <Router>
      <Navigator />
      <Switch>
        <RouterGuard />
      </Switch>
    </Router>
  );
}
export default Routes;
