import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import ISO6391 from "iso-639-1";

export const successToast = (message) => {
  toast.success(message, {
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function titleCase(label) {
  return (
    label?.charAt(0)?.toUpperCase() +
    label
      ?.slice(1)
      ?.split(/(?=[A-Z])/)
      ?.join("")
  );
}

export const copyToClipboard = (text) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  successToast("Copied to clipboard!");
};

export const getAllCountries = () => {
  const countries = Country.getAllCountries();
  return countries?.map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));
};

export const getAllStates = (country) => {
  const states = State.getStatesOfCountry(country);
  return states?.map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));
};

export const getAllCities = (country, state) => {
  const cities = City.getCitiesOfState(country, state);
  return cities?.map((city) => ({
    label: city.name,
    value: city.name,
  }));
};

export const languageOptions = ISO6391.getAllCodes().map((code) => ({
  value: code,
  label: ISO6391.getName(code),
}));

export const getLanguageName = (code) => {
  return ISO6391.getName(code);
};
