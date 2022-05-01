import React, { useState, useEffect } from "react";

function Pop(props) {
  let details = "";
  let pop_link;
  let pop_link_box;

  let pop = props.pop;

  // if (pop.name == "Illumi Zoldyck") {
  //   console.log(pop);
  // }

  if (pop.details) {
    if (["from", "with"].includes(pop.details.split(" ")[0].toLowerCase())) {
      details = pop.details.split(" ");
      details.shift();
      details = details.join(" ");
      details = "-" + details.toLowerCase().split(" ").join("-");
    } else {
      details = "-" + pop.details.toLowerCase().split(" ").join("-");
    }
  }

  // if (pop.features?.join("-").includes("exclusivity")) {
  //   details = details + "-exclusivity"
  // }

  if (pop.features) {
    pop.features.forEach((feature, i) => {
      let features_ban = [
        "exclusive",
        "event",
        "special edition",
        "specialty series",
        "art series",
        "with purpose",
      ];
      if (!features_ban.includes(feature)) {
        if (feature == "diamond collection") {
          details = details + "-diamond-glitter";
        } else if (feature == "glow chase") {
          details = details + "-chase-glows-in-the-dark";
        } else {
          details = details + "-" + feature;
        }
      }
    });
  }

  function convertToUrl(text) {
    let convertRules = [
      {
        replaceTo: "",
        target: [".", "(", ")"],
      },
      {
        replaceTo: "-",
        target: ["'", " "],
      },
      {
        replaceTo: "e",
        target: ["é", "è", "ê", "ë"],
      },
    ];
    let result = text;
    convertRules.forEach((rule, i) => {
      rule.target.forEach((target, i) => {
        result = result.split(target).join(rule.replaceTo);
      });
    });
    return result;
  }

  /*if (pop.beta) {
    pop_link = pop.beta;
  } else*/
  if (pop.api_error) {
    pop_link = pop.api_error;
  } else {
    pop_link =
      "https://figurines-pop.com/media/img/figurine/" +
      pop.number +
      "-figurine-funko-pop-" +
      convertToUrl(pop.series.toLowerCase()) +
      "-" +
      convertToUrl(pop.name.toLowerCase()) +
      convertToUrl(details.toLowerCase()) +
      ".jpg";
  }

  if (pop.api_error_box) {
    pop_link_box = pop.api_error_box;
  } else {
    pop_link_box = pop_link.split(".jpg")[0] + "-box.jpg";
  }

  return (
    <div
      className={(pop.ok ? "pop" : "pop wanted") + (pop.beta ? " beta" : "")}
    >
      <div className="image_effect">
        <img src={pop_link} /> <img src={pop_link_box} />{" "}
      </div>
      <div className="info">
        <h1> {pop.name} </h1> <h3> {pop.series} </h3>
        {pop.value ? <h2> Estimé à {pop.value}€ </h2> : ""}{" "}
      </div>
      {pop.features ? (
        <div className="stickers">
          {" "}
          {pop.features?.map((sticker) =>
            sticker == "exclusive" &&
            pop.exclusive &&
            pop.exclusive != "none" ? (
              <img
                key={"sticker" + sticker}
                src={
                  "https://raw.githubusercontent.com/Yxmna/funko-stickers/main/svg/" +
                  (pop.exclusive == "special edition" ? "" : "exc_") +
                  pop.exclusive?.split(" ").join("_") +
                  ".svg"
                }
              />
            ) : sticker == "event" && pop.event ? (
              <img
                key={"sticker" + sticker}
                src={
                  "https://raw.githubusercontent.com/Yxmna/funko-stickers/main/svg/exc_" +
                  pop.event.split(" ").join("_") +
                  ".svg"
                }
              />
            ) : (
              <img
                key={"sticker" + sticker}
                src={
                  "https://raw.githubusercontent.com/Yxmna/funko-stickers/main/svg/" +
                  sticker.split(" ").join("_") +
                  ".svg"
                }
              />
            )
          )}{" "}
        </div>
      ) : (
        ""
      )}{" "}
    </div>
  );
}

export default Pop;

/*

        <div className="stickers">
          {pop.features?.join("-").includes("specialty series") ? (
            <img src="/stickers/SPECIALTY_SERIES.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("glow chase") ? (
            <img src="/stickers/UNKNOW.svg" />
          ) : pop.features?.join("-").includes("chase") ? (
            <img src="/stickers/CHASE.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("special edition") ? (
            <img src="/stickers/SPECIAL_EDITION.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("flocked") ? (
            <img src="/stickers/FLOCKED.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("glows in the dark") ? (
            <img src="/stickers/GLOWS_IN_THE_DARK.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("anniversary") ? (
            <img src="/stickers/UNKNOW.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("metallic") ? (
            <img src="/stickers/UNKNOW.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("diamond") ? (
            <img src="/stickers/DIAMOND.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("with purpose") ? (
            <img src="/stickers/UNKNOW.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("event") ? (
            pop.event == "la comic con" ? (
              <img src="/stickers/EVENT_LA_COMIC_CON_2021.svg" />
            ) : (
              <img src="/stickers/UNKNOW.svg" />
            )
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("exclusive") ? (
            pop.exclusive?.includes("hot topic") ? (
              <img src="/stickers/EXC_HOT_TOPIC.svg" />
            ) : pop.exclusive?.includes("none") ? (
              <img src="/stickers/EXCLUSIVE.svg" />
            ) : pop.exclusive?.includes("special edition") ? (
              <img src="/stickers/SPECIAL_EDITION.svg" />
            ) : pop.exclusive?.includes("thinkgeek") ? (
              <img src="/stickers/EXC_THINKGEEK.svg" />
            ) : pop.exclusive?.includes("pop in the box") ? (
              <img src="/stickers/EXC_POP_IN_THE_BOX.svg" />
            ) : pop.exclusive?.includes("chalice collectibles") ? (
              <img src="/stickers/EXC_CHALICE_COLLECTIBLES.svg" />
            ) : pop.exclusive?.includes("toy stop") ? (
              <img src="/stickers/EXC_TOY_STOP.svg" />
            ) : (
              <img src="/stickers/UNKNOW.svg" />
            )
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("art series") ? (
            <img src="/stickers/ART_SERIES.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("-").includes("super sized") ? (
            <img src="/stickers/SUPER_SIZED.svg" />
          ) : (
            ""
          )}

          {pop.features?.join("--").includes("black light") ? (
            <img src="/stickers/BLACK_LIGHT_GLOW.svg" />
          ) : (
            ""
          )}
        </div>

  */
