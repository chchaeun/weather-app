import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, ActivityIndicator } from "react-native";
import styled from "styled-components";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};
export default function App() {
  const [days, setDays] = useState([]);
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=14&units=metric&appid=${API_KEY}`
    ).then((res) => res.json());
    setDays(response.list);
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <Container>
      <CityBox>
        <City>{city}</City>
      </CityBox>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <LoadingBox>
            <ActivityIndicator color="black" size="small" />
          </LoadingBox>
        ) : (
          days.map((day, idx) => (
            <DayBox key={idx}>
              <DateText>
                {new Date(day.dt * 1000)
                  .toString()
                  .split(" ")
                  .slice(1, 3)
                  .join(" ")}
              </DateText>
              <Icons>
                <TempText>{Math.floor(day.temp.day)}°</TempText>
                <Fontisto name={icons[day.weather[0].main]} size="108" />
              </Icons>
              <WeatherText>{day.weather[0].main}</WeatherText>
            </DayBox>
          ))
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: powderblue;
`;

const CityBox = styled.View`
  flex: 1.3;
  justify-content: center;
  align-items: center;
`;

const City = styled.Text`
  font-size: 68;
  font-weight: 500;
`;
const LoadingBox = styled.View`
  width: ${WINDOW_WIDTH};
  align-items: center;
`;
const DayBox = styled.View`
  width: ${WINDOW_WIDTH};
  align-items: flex-start;
  padding-horizontal: 120;
`;
const Icons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  align-items: center;
`;
const DateText = styled.Text`
  font-size: 35;
  color: #06555c;
`;
const TempText = styled.Text`
  font-size: 200;
`;
const WeatherText = styled.Text`
  margin-top: -30;
  font-size: 55;
`;
