import React, { useState, useEffect } from "react";
import Pop from "../components/Pop";
import { Link } from "react-router-dom";

function Collection(props) {
  const convertPopToIdPls = window.$convertPopToIdPls;
  const convertToUrlPls = window.$convertToUrlPls;
  const pops = props.pops;

  let randoms = [];
  let max_random = pops.length;
  if (max_random > 3) max_random = 3;

  for (var i = 0; i < max_random; i++) {
    let r = 0;
    do {
      r = Math.floor(Math.random() * pops.length);
    } while (randoms.join("-").toString().includes(r.toString()));
    randoms.push(r);
  }

  function scrollToTopPls() {
    document.querySelector("header").scrollIntoView();
  }

  return (
    <article className="collection" onClick={scrollToTopPls}>
      <Link
        to={
          "/funko-collection/collections/" +
          convertToUrlPls(props.collection.name)
        }
      ></Link>
      <h1>{props.collection.name}</h1>
      <p>{props.collection.description}</p>
      <p>
        {props.pops.filter((pop) => pop.ok).length + "/" + props.pops.length}
      </p>
      <ul>
        {randoms.map((r) => (
          <li key={"random-pop-" + r}>
            <img
              src={pops.length > r ? "https://github.com/Yxmna/funko-collection-source-code/raw/main/public/img/" + convertPopToIdPls(pops[r]) + ".png" : "" }
              onError={(e) => {
                e.target.src =
                  "https://media.discordapp.net/attachments/962465593116733511/973528265597784104/error.png?width=603&height=603";
              }}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default Collection;
