import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Pop(props) {
  const pop = props.pop;
  const convertPopToIdPls = window.$convertPopToIdPls;
  const convertToUrlPls = window.$convertToUrlPls;
  const pop_id = convertPopToIdPls(pop, true);
  const pop_id_w = convertPopToIdPls(pop);
  let stickers = [];
  const [hobbyprice, setHobbyprice] = useState();

  stickers = pop.features?.map((feature) => {
    if (feature == "exclusive" && pop.exclusive && pop.exclusive != "none") {
      let exc = "exc_";
      if (pop.exclusive == "special edition") exc = "";
      return (
        "https://raw.githubusercontent.com/Yxmna/funko-stickers/main/svg/" +
        exc +
        pop.exclusive.split(" ").join("_") +
        ".svg"
      );
    } else if (feature == "event" && pop.event) {
      return (
        "https://raw.githubusercontent.com/Yxmna/funko-stickers/main/svg/exc_" +
        pop.event.split(" ").join("_") +
        ".svg"
      );
    } else {
      return (
        "https://raw.githubusercontent.com/Yxmna/funko-stickers/main/svg/" +
        feature.split(" ").join("_") +
        ".svg"
      );
    }
  });

  return (
    <Link
      to={
        pop.collection
          ? "/funko-collection/collections/" +
            convertToUrlPls(pop.collection) +
            "/" +
            pop_id
          : ""
      }
      className={pop.ok || props.ok ? "pop" : "pop wanted"}
    >
      <div className={"image_effect"}>
        <div>
          {!pop.more_details?.includes("flying") ? (
            <img
              className="new_pop_shadow"
              src={
                "https://github.com/Yxmna/funko-collection-source-code/raw/main/public/img/" +
                pop_id_w +
                ".png"
              }
              onError={(e) => {
                e.target.src =
                  "https://media.discordapp.net/attachments/962465593116733511/973528265597784104/error.png?width=603&height=603";
              }}
            />
          ) : (
            ""
          )}
        </div>
        <img
          src={
            "https://github.com/Yxmna/funko-collection-source-code/raw/main/public/img/" +
            pop_id_w +
            ".png"
          }
          onError={(e) => {
            e.target.src =
              "https://media.discordapp.net/attachments/962465593116733511/973528265597784104/error.png?width=603&height=603";
          }}
        />
      </div>
      <div className="info">
        <h1>
          {pop.name} <span>{pop?.details}</span>{" "}
        </h1>
        <h3> {pop.series} </h3>
      </div>
      <div className="price">
        {pop.info?.price ? (
          <h2 className="price_acquired">✔ {pop.info.price} €</h2>
        ) : (
          ""
        )}
        {pop.estimated ? (
          <h2 className="price_estimated">
            ~ {Math.floor(pop.estimated / window.$rate)} €
          </h2>
        ) : (
          ""
        )}
      </div>
      {pop.features ? (
        <div className="stickers">
          {stickers.map((sticker) => (
            <img
              key={"sticker" + sticker}
              src={sticker}
              onError={(e) => {
                e.target.src =
                  "https://media.discordapp.net/attachments/962465593116733511/973529042710040597/sticker_error.png";
              }}
            />
          ))}
        </div>
      ) : (
        ""
      )}
    </Link>
  );
}

export default Pop;
