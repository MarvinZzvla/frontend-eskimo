import React from "react";

type Props = {};

function Home({}: Props) {
  const name = JSON.parse(localStorage.getItem("login") ?? "{}").name;

  return <h1 className="text-2xl font-bold">Bienvenido {name}</h1>;
}

export default Home;
