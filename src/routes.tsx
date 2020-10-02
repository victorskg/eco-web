import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreatePoint from "./pages/Point/Create";
import ListPoints from "./pages/Point/List";

function Routes() {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={ListPoints} path="/pontos" />
      <Route component={CreatePoint} path="/novo-ponto" />
    </BrowserRouter>
  );
}

export default Routes;
