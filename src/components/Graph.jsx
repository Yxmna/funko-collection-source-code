import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import React, { useState, useEffect } from "react";

function Graph(props) {
  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
    annotationPlugin
  );

  const rate = window.$rate;
  const pop = props.pop;
  const data = props.data.map((dollard) => {
    return dollard / rate;
  });
  let labels = props.labels.map((date) => {
    let sdate = date.split("/");
    let ndate = sdate[1] + "/" + sdate[0] + "/" + sdate[2];
    ndate = new Date(ndate).valueOf();
    return ndate;
  });

  let min_date = Math.min(...labels);
  let max_date = Math.max(...labels);

  const bar = {
    type: "line",
    borderColor: "#00B2FFC9",
    borderWidth: 5,
    borderDash: [10, 10],
    borderDashOffset: 0,
  };

  const price_bar = {
    ...bar,
    ...{
      scaleID: "y",
      value: props.pop.info?.price,
    },
    label: {
      content: ["Prix d'achat", "(" + props.pop.info?.price + "€)"],
      enabled: (ctx) => ctx.hovered,
      backgroundColor: "#00B2FFC9",
      drawTime: "afterDatasetsDraw",
      position: (ctx) => ctx.hoverPosition,
    },
    enter({ chart, element }, event) {
      element.options.label.enabled = true;
      chart.draw();
    },
    leave({ chart, element }, event) {
      element.options.label.enabled = false;
      chart.draw();
    },
  };

  const date_bar = {
    ...bar,
    ...{
      scaleID: "x",
      value: new Date(props.pop.info?.date).valueOf(),
    },
    label: {
      content: [
        "Date d'achat",
        "(" + new Date(props.pop.info?.date).toLocaleDateString() + ")",
      ],
      enabled: (ctx) => ctx.hovered,
      backgroundColor: "#00B2FFC9",
      drawTime: "afterDatasetsDraw",
      position: (ctx) => ctx.hoverPosition,
    },

    enter({ chart, element }, event) {
      element.options.label.enabled = true;
      chart.draw();
    },
    leave({ chart, element }, event) {
      element.options.label.enabled = false;
      chart.draw();
    },
  };

  const chart_options = {
    maintainAspectRatio: false,
    layout: {
      padding: 40,
    },
    elements: {
      point: {
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Valeur estimée au fils du temps en Amérique",
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
      annotation: {
        annotations: {
          price_bar,
          date_bar,
        },
      },
      tooltip: {
        intersect: false,
        displayColors: false,
        callbacks: {
          title: function (tooltip_item) {
            return new Date(tooltip_item[0].parsed.x).toLocaleDateString();
          },
          label: function (tooltip_item) {
            return Math.floor(tooltip_item.parsed.y) + "€";
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        type: "linear",
        suggestedMax: 75,
        min: 0,
        grid: {
          display: true,
          color: "rgba(255,255,255,0.125)",
        },
        ticks: {
          color: "rgba(255,255,255,0.75)",
          callback: function (value, index, ticks) {
            return value + "€";
          },
        },
      },
      x: {
        type: "linear",
        max: max_date,
        min: min_date,
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
    animation: {
      easing: "easeOutQuart",
      duration: "750",
    },
  };

  const chart = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: data,
        backgroundColor: "#00B2FF80",
        borderColor: "#00B2FFC9",
        fill: "origin",
        pointRadius: 10,
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
        pointHoverBackgroundColor: "rgba(255, 255, 255, 0.1)",
        pointBorderWidth: 0,
        pointHoverRadius: 15,
        lineTension: 0.25,
      },
    ],
  };

  return (
    <>
      <Line data={chart} options={chart_options} />
    </>
  );
}

export default Graph;
