import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import ChartDataLabels from "chartjs-plugin-datalabels";

function Graphique(props) {
  ChartJS.register(
    PointElement,
    LineElement,
    BarElement,
    BarController,
    LinearScale,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
    CategoryScale,
    annotationPlugin,
    ChartDataLabels
  );

  const data = props.data;

  if (!data) return;

  let init_time_data = data
    .sort(
      (pop1, pop2) =>
        new Date(pop2.date).valueOf() - new Date(pop1.date).valueOf()
    )
    .map((pop) => {
      return { date: new Date(pop.date).valueOf(), value: 1 };
    });

  let time_data = init_time_data
    .map((date) => {
      let test = init_time_data.filter((d) => d.date == date.date);
      return { date: date.date, value: test.length };
    })
    .filter(
      (v, i, a) =>
        a.findIndex((t) => t.date === v.date && t.value === v.value) === i
    );

  let init_who_data = data.map((pop) => pop.who);

  let who_data = [...new Set(init_who_data)].map((who) => {
    let value = init_who_data.filter((w) => w == who).length;
    let price = data
      .filter((w) => w.who == who)
      .map((pop) => pop.price)
      .reduce((a, b) => {
        if (!Math.floor(a)) a = 0;
        if (!Math.floor(b)) b = 0;
        return a + b;
      });
    return { who: who, value: value, price: price };
  });

  let shop_data_init = data.map((pop) => pop.shop);

  let shop_data = [...new Set(shop_data_init)]
    .map((shop) => {
      let value = shop_data_init.filter((s) => s == shop).length;
      return { shop: shop, value: value };
    })
    .sort((a, b) => a.value - b.value);

  let place_data_init = data.map((pop) => pop.city);

  let place_data = [...new Set(place_data_init)]
    .map((place) => {
      let value = place_data_init.filter((s) => s == place).length;
      return { place: place, value: value };
    })
    .sort((a, b) => a.value - b.value);

  let features_data_init = data
    .map((pop) => pop.features)
    .filter((feature) => feature)
    .map((arr) => arr.join("/"))
    .join("/")
    .split("/");

  let features_data = [...new Set(features_data_init)]
    .map((feature) => {
      let value = features_data_init.filter((s) => s == feature).length;
      return { feature: feature, value: value };
    })
    .sort((a, b) => b.value - a.value);

  let price_data = data
    .map((pop) => {
      return {
        name: pop.name + " - " + window.$convertPopToIdPls(pop),
        value: pop.price,
      };
    })
    .sort((a, b) => b.value - a.value);

  let estimated_data = props.better_data
    .filter((pop) => pop.ok)
    .map((pop) => {
      let value = props.estimated.find((p) => p.hdbid == pop.hdbid);
      return {
        name: pop.name + " - " + window.$convertPopToIdPls(pop),
        value: value?.value,
      };
    })
    .sort((a, b) => b.value - a.value);

  const time_options = {
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: "Nombre de Pops achetées sur le temps",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        displayColors: false,
        callbacks: {
          title: function (tooltip_item) {
            return new Date(tooltip_item[0].parsed.x).toLocaleDateString();
          },
          label: function (tooltip_item) {
            let s = "";
            if (tooltip_item.parsed.y > 1) s = "s";
            return (
              Math.floor(tooltip_item.parsed.y) + " Pop" + s + " achetée" + s
            );
          },
        },
      },
      datalabels: {
        display: false,
      },
      annotation: {
        drawTime: "afterDatasetsDraw",
        annotations: [
          {
            type: "line",
            mode: "vertical",
            borderColor: "transparent",
            borderWidth: 10,
            scaleID: "y",
            value: 5,
            label: {
              backgroundColor: "transparent",
              font: { size: 18 },
              fontColor: "#fff",
              cornerRadius: 6,
              position: "end",
              enabled: true,
              content: "Total: " + data.length + " Pops!",
            },
          },
        ],
      },
    },
    scales: {
      y: {
        type: "linear",
        min: 0,
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          stepSize: 1,
          color: "rgba(255,255,255,0.75)",
        },
      },
      x: {
        type: "linear",
        max: new Date().valueOf(),
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value, index, ticks) {
            return new Date(value).toLocaleDateString();
          },
          color: "rgba(255,255,255,0.75)",
        },
      },
    },
  };
  const time_chart = {
    labels: time_data.map((obj) => new Date(obj.date)),
    datasets: [
      {
        type: "bar",
        label: "",
        data: time_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        barThickness: 10,
      },
    ],
  };

  const who_options = {
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      title: {
        display: true,
        text: "Nombre de Pops achetées et prix dépensé",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
        labels: {
          color: "white",
          font: {
            size: 20,
          },
        },
      },
      datalabels: {
        color: "white",
        labels: {
          name: {
            align: "top",
            font: { size: 16 },
            formatter: function (value, ctx) {
              if (value > 0) {
                return ctx.chart.data.labels[ctx.dataIndex];
              } else {
                return "";
              }
            },
          },
          value: {
            align: "center",
            color: "white",
            formatter: function (value, ctx) {
              if (ctx.datasetIndex == 0) {
                return value + " Pops";
              } else if (value > 0) {
                return value + " €";
              } else {
                return "";
              }
            },
            padding: 4,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  const who_chart = {
    labels: who_data.map((obj) => obj.who),
    datasets: [
      {
        type: "pie",
        label: "",
        data: who_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        barThickness: 10,
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
      {
        type: "pie",
        label: "",
        data: who_data.map((obj) => obj.price),
        backgroundColor: "#00B2FF80",
        barThickness: 10,
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  const shop_options = {
    maintainAspectRatio: true,
    scales: {
      y: {
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
        },
      },
      x: {
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Nombre de Pops achetées par magasins",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        color: "white",
        anchor: "end",
        align: "end",
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  const shop_chart = {
    labels: shop_data.map((obj) => obj.shop),
    datasets: [
      {
        type: "bar",
        label: "",
        data: shop_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        barThickness: 30,
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  const place_options = {
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      title: {
        display: true,
        text: "Nombre de Pops achetées par lieu",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        color: "white",
        labels: {
          name: {
            align: "top",
            font: { size: 16 },
            formatter: function (value, ctx) {
              if (value > 10) {
                return ctx.chart.data.labels[ctx.dataIndex];
              } else {
                return "";
              }
            },
          },
          value: {
            align: "center",
            color: "white",
            formatter: function (value, ctx) {
              if (value > 10) {
                return value + " Pops";
              } else {
                return "";
              }
            },
            padding: 4,
          },
        },
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltip_item) {
            return tooltip_item[0].label;
          },
          label: function (tooltip_item) {
            let s = "";
            if (tooltip_item.parsed > 1) s = "s";
            return (
              Math.floor(tooltip_item.parsed) + " Pop" + s + " achetée" + s
            );
          },
        },
      },
    },
  };
  const place_chart = {
    labels: place_data.map((obj) => obj.place),
    datasets: [
      {
        type: "pie",
        label: "",
        data: place_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  const feature_options = {
    aspectRatio: 1,
    plugins: {
      title: {
        display: true,
        text: "Nombre de Spécialité de toutes les pops",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        color: "white",
        labels: {
          name: {
            align: "top",
            font: { size: 16 },
            formatter: function (value, ctx) {
              if (value > 5) {
                return ctx.chart.data.labels[ctx.dataIndex];
              } else {
                return "";
              }
            },
          },
          value: {
            align: "center",
            color: "white",
            formatter: function (value, ctx) {
              if (value > 5) {
                return value;
              } else {
                return "";
              }
            },
            padding: 4,
          },
        },
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltip_item) {
            return tooltip_item[0].label;
          },
          label: function (tooltip_item) {
            let s = "";
            if (tooltip_item.parsed > 1) s = "s";
            return (
              Math.floor(tooltip_item.parsed) + " Pop" + s + " achetée" + s
            );
          },
        },
      },
    },
  };
  const feature_chart = {
    labels: features_data.map((obj) => obj.feature),
    datasets: [
      {
        type: "pie",
        label: "",
        data: features_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  const price_options = {
    scales: {
      y: {
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
          callback: function (value, index, ticks) {
            return value + " €";
          },
        },
      },
      x: {
        grid: {
          display: false,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Prix des pops",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltip_item) {
            let details =
              "\n" +
              tooltip_item[0].label
                .split(
                  " " +
                    tooltip_item[0].label
                      .split(" - ")[0]
                      .split(" ")
                      .join("-")
                      .toLowerCase()
                )[1]
                ?.substring(1, 50);
            if (details.length < 2) {
              details = "";
            }
            return tooltip_item[0].label.split(" - ")[0] + details;
          },
          label: function (tooltip_item) {
            return tooltip_item.parsed.y + " €";
          },
        },
      },
    },
  };
  const price_chart = {
    labels: price_data.map((obj) => obj.name),
    datasets: [
      {
        type: "bar",
        label: "",
        data: price_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        barThickness: 10,
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  const estimated_options = {
    scales: {
      y: {
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
          callback: function (value, index, ticks) {
            return value + " €";
          },
        },
      },
      x: {
        grid: {
          display: false,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Estimation des pops",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltip_item) {
            let details =
              "\n" +
              tooltip_item[0].label
                .split(
                  " " +
                    tooltip_item[0].label
                      .split(" - ")[0]
                      .split(" ")
                      .join("-")
                      .toLowerCase()
                )[1]
                ?.substring(1, 50);
            if (details.length < 2) {
              details = "";
            }
            return tooltip_item[0].label.split(" - ")[0] + details;
          },
          label: function (tooltip_item) {
            return tooltip_item.parsed.y + " €";
          },
        },
      },
    },
  };
  const estimated_chart = {
    labels: estimated_data.map((obj) => obj.name),
    datasets: [
      {
        type: "bar",
        label: "",
        data: estimated_data.map((obj) => obj.value),
        backgroundColor: "#00B2FF80",
        barThickness: 10,
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  const total_options = {
    aspectRatio: 1,
    scales: {
      y: {
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
          callback: function (value, index, ticks) {
            return value + " €";
          },
        },
      },
      x: {
        grid: {
          display: false,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Dépenses totales et valeur réelle des collections enregistrées",
        color: "white",
        font: {
          weight: false,
          size: 17,
        },
        align: "start",
        padding: {
          top: 5,
          bottom: 40,
        },
      },
      legend: {
        display: false,
      },

      datalabels: {
        color: "white",
        anchor: "end",
        align: "end",

        font: { size: 16 },
        formatter: function (value, ctx) {
          return value + " €";
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };


  const total_chart = {
    labels: ["Total dépensé", "Valeur réelle"],
    datasets: [
      {
        type: "bar",
        label: "",
        data: [
          props.better_data
            .filter((pop) => pop.ok)
            .map((pop) => pop.info?.price)
            .reduce((a, b) => {
              return a + b;
            }, 0),
            props.better_data
              .filter((pop) => pop.ok)
              .map((pop) => {
                let value = props.estimated.find((p) => pop.hdbid == p.hdbid);
                return value.value
              })
            .reduce((a, b) => {
              return a + b;
            }, 0),
        ],
        backgroundColor: "#00B2FF80",
        barThickness: 100,
        backgroundColor: ["#00B2FF80", "#00B2FF80", "#00B2FF80"],
        borderWidth: 2,
        borderColor: "#00B2FFC9",
      },
    ],
  };

  return (
    <div id="graphs">
      <h1>Graphique</h1>
      <div className="firstgraphs">
        <div>
          <Line data={time_chart} options={time_options} />
        </div>
        <div>
          <Pie data={who_chart} options={who_options} />
        </div>
      </div>
      <div className="secondgraphs">
        <div>
          <Pie data={place_chart} options={place_options} />
        </div>
        <div>
          <Bar data={shop_chart} options={shop_options} />
        </div>
      </div>
      <div className="firstgraphs">
        <div>
          {price_data.length > 1 ? (
            <Bar data={price_chart} options={price_options} />
          ) : (
            ""
          )}
        </div>
        <div>
          <Pie data={feature_chart} options={feature_options} />
        </div>
      </div>

      <div className="secondgraphs">
        <div>
          <Bar data={total_chart} options={total_options} />
        </div>
        <div>
          <Bar data={estimated_chart} options={estimated_options} />
        </div>
      </div>
    </div>
  );
}

export default Graphique;
