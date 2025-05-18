'use client';

import { MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "app/atom";
import { useAtom } from "jotai";

type Props = { location?: string}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY

const Navbar = ({location}: Props) => {
  const [city, setCity] = useState("")
  const [error, setError] = useState("")
  //
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value)
    if(value.length >= 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError('');
        setShowSuggestions(true)
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([]);
        setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false)
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault()
    if(suggestions.length == 0) {
      setError("Location not found");
      setLoadingCity(false)
    } else {
      setError("")
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city)
        setShowSuggestions(false)
      },500)
    }
  }
/*
  function handleCurrentLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async(position) => {
        const {latitude,longitude} = position.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name)
          },500)
        } catch(error){
          setLoadingCity(false);
        }
      })
    }
  }
*/  
  return (
    <>
    <section className="flex justify-center mt-4">
      <div className="relative hidden md:flex">{/* Search Box */}
      <SearchBox 
        value={city}
        onSubmit={handleSubmitSearch}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <SuggestionBox 
        {...{
          showSuggestions,
          suggestions,
          handleSuggestionClick,
          error
        }}
      />
      </div>
    </section>
    <section className="flex max-w-7xl px-3 md:hidden">
    <div className="relative">{/* Search Box */}
      <SearchBox 
        value={city}
        onSubmit={handleSubmitSearch}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <SuggestionBox 
        {...{
          showSuggestions,
          suggestions,
          handleSuggestionClick,
          error
        }}
      />
      </div>
      </section>
    </>
  )
}

export default Navbar

const SuggestionBox = ({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) => {
  return (
    <> { ((showSuggestions && suggestions.length > 1) || error) && (
      <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
        { error && suggestions.length < 1 && (<li className="text-red-500 p-1">{error}</li>)}
        {suggestions.map((item,i) => (
          <li 
            key={i} 
            onClick={() => handleSuggestionClick(item)}
            className="cursor-pointer p-1 rounded hover:bg-gray-200">{item}</li>
        ))}
      </ul>
      )}
    </>
  )
}