import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "../pages/weatherbody.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

const Weatherbody = () => {
  const [longitude, setLongitude] = useState("77.1025");
  const [latitude, setLatitude] = useState("28.7041");
  const [city, setCity] = useState(null);
  const [pollutiondata, setPollutionData] = useState(null);
  const [weatherdata, setWeatherdata] = useState(null);
  const [time,setTime] = useState(null);

  const apiFetch = async () => {
    const pollutiondataapi = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=25d2c0b22be768d9096ba774b2e76ce3`
    );
    setPollutionData(await pollutiondataapi);
    const weatherdataapi = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=25d2c0b22be768d9096ba774b2e76ce3&units=metric`
    );
    setWeatherdata(await weatherdataapi);
  };
  const fetchCity = async () => {
    try {
      const geoLocation = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=25d2c0b22be768d9096ba774b2e76ce3`
      );
      setLatitude(await geoLocation.data[0].lat);
      setLongitude(await geoLocation.data[0].lon);
    } catch (error) {
      toast.error(`😅Invalid City/Country `, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  const fetchairquality = () => {
    switch (pollutiondata.data.list[0].main.aqi) {
      case 1:
        return "Good";
        break;
      case 2:
        return "Fair";
        break;
      case 3:
        return "Moderate";
        break;
      case 4:
        return "Poor";
        break;
      case 5:
        return "Very Poor";
        break;
    }
  };
  const fetchIcon = () => {};
  useEffect(() => {
    apiFetch();
  }, [latitude]);
  if (weatherdata === null) {
    return (
      <>
        <Loading />
      </>
    );
  }
  //   {latitude===undefined&&}

  return (
    <div className="container">
      <ToastContainer />
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div className="circle3"></div>
      <div className="maincontent">
        <div className="searchContainer">
          <input
            type="text"
            className="searchfield"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchCity();
              }
            }}
          />
          <button
            type="submit"
            className="btn"
            onClick={() => {
              fetchCity();
            }}
          >
            Go
          </button>
        </div>
        <h1>Current Weather</h1>
        <h3>{dayjs().format("LLLL")}</h3>
        <h1 className="city">
          {weatherdata.data.name},
          {weatherdata.data.sys.country}
        </h1>
        <div className="toup">
          <h1 className="temp">
            <img
              src={`https://openweathermap.org/img/wn/${weatherdata.data.weather[0].icon}@2x.png`}
              className="weathericon"
            />
            {weatherdata.data.main.temp}&deg;C
          </h1>
          <div className="otherinfo">
            <span className="subinfo">
              <h2>Air quality</h2>
              <h3>{fetchairquality()}</h3>
            </span>
            <span className="subinfo">
              <h2>Wind</h2>
              <h3>{weatherdata.data.wind.speed / 1000}km/h</h3>
            </span>
            <span className="subinfo">
              <h2>Humidity</h2>
              <h3>{weatherdata.data.main.humidity}%</h3>
            </span>
            <span className="subinfo">
              <h2>Visibility</h2>
              <h3>{weatherdata.data.visibility / 1000}km</h3>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weatherbody;
