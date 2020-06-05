import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";

import "./styles.css";
import logo from "../../../assets/logo.svg";
import Item from "../../../models/item";
import IBGEService from "../../../services/IBGEService";
import ItemService from "../../../services/ItemService";
import States from "../../../models/State";
import { LeafletMouseEvent } from "leaflet";
import PointService from "../../../services/PointService";

function CreatePoint() {
  const history = useHistory();
  const defaultLocation: [number, number] = [0, 0];
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<States[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedState, setSelectedState] = useState("0");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>(
    defaultLocation
  );
  const [initialPosition, setInitialPosition] = useState<[number, number]>(
    defaultLocation
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    ItemService.getItems().then((response) => setItems(response.data));
    IBGEService.getStates().then((response) => setStates(response.data));
    navigator.geolocation.getCurrentPosition((position) =>
      setInitialPosition([position.coords.latitude, position.coords.longitude])
    );
  }, []);

  useEffect(() => {
    if (selectedState !== "0") {
      IBGEService.getStateCities(selectedState).then((response) => {
        setCities(response.data.map((city: any) => city.nome));
      });
    }
  }, [selectedState]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleItemClick(id: number) {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    const [latitude, longitude] = selectedPosition;
    const point = {
      ...formData,
      uf: selectedState,
      city: selectedCity,
      latitude,
      longitude,
      items: selectedItems,
    };

    await PointService.createPoint(point);
    history.push("/");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={submit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            ></input>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              ></input>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map
            zoom={15}
            center={initialPosition}
            onClick={(event: LeafletMouseEvent) =>
              setSelectedPosition([event.latlng.lat, event.latlng.lng])
            }
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Estado</label>
              <select
                name="state"
                id="state"
                value={selectedState}
                onChange={(event) => setSelectedState(event.target.value)}
              >
                <option value="0">Selecione um estado</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.sigla} - {state.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.imageUrl} alt={item.title}></img>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;
