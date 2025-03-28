import React, { useState, useEffect } from "react";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 12;
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
      .then((response) => response.json())
      .then((data) => {
        Promise.all(
          data.results.map((p) => fetch(p.url).then((res) => res.json()))
        )
          .then((pokemonData) => setPokemon(pokemonData))
          .catch((error) =>
            console.error("Error fetching Pokémon details:", error)
          );
      })
      .catch((error) => console.error("Error fetching Pokémon list:", error));

    fetch("https://pokeapi.co/api/v2/type")
      .then((response) => response.json())
      .then((data) => setTypes(data.results.map((t) => t.name)))
      .catch((error) => console.error("Error fetching types:", error));
  }, []);

  const openModal = (pokemonData) => {
    setSelectedPokemon({
      name: pokemonData.name,
      image: pokemonData.sprites.front_default,
      height: pokemonData.height,
      types: pokemonData.types.map((t) => t.type.name),
      abilities: pokemonData.abilities.map((a) => a.ability.name),
    });
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;

  const filteredPokemons = pokemon
    .filter((p) => p.name.includes(search.toLowerCase()))
    .filter(
      (p) => !selectedType || p.types.some((t) => t.type.name === selectedType)
    );

  const currentPokemons = filteredPokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>Pokémon List</h1>

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "16px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      />

      <div>
        <label style={{ fontSize: "18px", marginRight: "10px" }}>
          Filter by Type:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        >
          <option value="">All Types</option>
          {types.map((type, index) => (
            <option key={index} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {currentPokemons.map((p, index) => (
          <div
            key={index}
            onClick={() => openModal(p)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px",
              textAlign: "center",
              cursor: "pointer",
              background: "#f8f8f8",
            }}
          >
            <img
              src={p.sprites.front_default}
              alt={p.name}
              style={{ width: "100px", height: "100px" }}
            />
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{p.name}</p>
          </div>
        ))}
      </div>

      {/* Pokémon Details Modal */}
      {selectedPokemon && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <h2>{selectedPokemon.name.toUpperCase()}</h2>
          <img
            src={selectedPokemon.image}
            alt={selectedPokemon.name}
            style={{ width: "150px", height: "150px" }}
          />
          <p>
            <strong>Height:</strong> {selectedPokemon.height}
          </p>
          <p>
            <strong>Type:</strong> {selectedPokemon.types.join(", ")}
          </p>
          <p>
            <strong>Abilities:</strong> {selectedPokemon.abilities.join(", ")}
          </p>
          <button
            onClick={closeModal}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Dark Background for Modal */}
      {selectedPokemon && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of{" "}
          {Math.ceil(filteredPokemons.length / pokemonsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredPokemons.length / pokemonsPerPage)
              )
            )
          }
          disabled={
            currentPage === Math.ceil(filteredPokemons.length / pokemonsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
