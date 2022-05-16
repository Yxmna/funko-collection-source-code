import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Graph from "../components/Graph";

function PopPage(props) {
  let params = useParams();
  let stickers = [];
  const convertPopToIdPls = window.$convertPopToIdPls;

  let pop = props.data.find((pop) => {
    let pop_test = convertPopToIdPls(pop, true);
    return pop_test == params.pop_id;
  });

  const pop_id = convertPopToIdPls(pop);

  if (!pop) return;

  const [chart_labels, setChartLabels] = useState([]);
  const [chart_data, setChartData] = useState([]);
  const [hobby_imgs, setHobbyImgs] = useState({});
  const [img_index, setImgIndex] = useState(0);

  useEffect(() => {
    let url =
      "https://www.hobbydb.com/api/historical_ci_values?catalog_item_id=" +
      pop.hdbid;
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (obj) {
        obj = obj.data
          .filter((price) => price.attributes.dateEnd)
          .sort((price1, price2) => {
            let date1 = new Date(price1.attributes.dateEnd);
            let date2 = new Date(price2.attributes.dateEnd);
            return date1 - date2;
          });
        let labels = obj;
        labels = labels.map((price) => {
          let date = new Date(price.attributes.dateEnd);
          return date.toLocaleDateString();
        });
        setChartLabels(labels);
        let data = obj;
        data = data.map((price) => price.attributes.value);
        setChartData(data);
      });
  }, []);

  useEffect(() => {
    let url =
      "https://www.hobbydb.com/api/catalog_items/" + pop.hdbid + "/images";
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (obj) {
        setHobbyImgs(obj.photos.map((img) => img.url));
      });
  }, []);

  function switchImgsPls() {
    if (img_index == hobby_imgs.length - 1 || hobby_imgs.length == 0) {
      setImgIndex(0);
    } else {
      setImgIndex((index) => index + 1);
    }
  };


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
    <div className="pop_page">
      <div>
        <div className={"back"}>
          <Link to={params.collection_id != "null" ? "/funko-collection/collections/" + params.collection_id : "/funko-collection/tout"}>
            🠜 Retour
          </Link>
        </div>

        <div className="pop_image panel">
          <div className="div_shadow">
            <img
              className="pop_shadow"
              src={
                "https://github.com/Yxmna/funko-collection-source-code/raw/main/public/img/" +
                convertPopToIdPls(pop) +
                ".png"
              }
            />
          </div>
          <img
            src={
              "https://github.com/Yxmna/funko-collection-source-code/raw/main/public/img/" +
              convertPopToIdPls(pop) +
              ".png"
            }
            onError={(e) => {
              e.target.src =
                "https://media.discordapp.net/attachments/962465593116733511/973528265597784104/error.png?width=603&height=603";
            }}
          />
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
        </div>

        <div className={"pop_name"}>
          <h1>{pop.name}</h1>
          <h2>{pop.series}</h2>
        </div>
      </div>

      <div>
        <div className="ul_and_list">
          <ul>
            {pop.number ? <li>Numéro : {pop.number}</li> : ""}
            {pop.info?.date ? (
              <li>Date : {new Date(pop.info.date).toLocaleDateString()} </li>
            ) : (
              ""
            )}
            {pop.info?.shop ? <li>Magasin : {pop.info.shop} </li> : ""}
            {pop.info?.city ? <li>Lieux : {pop.info.city} </li> : ""}
            {pop.info?.price ? <li>Prix : {pop.info.price}€ </li> : ""}
          </ul>

          <div className="galery panel" onClick={switchImgsPls}>
            <img src={hobby_imgs[img_index]} />
            <span>{img_index + 1 + " / " + hobby_imgs.length}</span>
          </div>
        </div>

        <div className="chart panel">
          <Graph data={chart_data} labels={chart_labels} pop={pop} />
        </div>
      </div>
    </div>
  );
}

export default PopPage;
