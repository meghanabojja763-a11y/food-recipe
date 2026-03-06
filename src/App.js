/* git is used to write the code and github we storing the data
Repository-create a folder in the name of repository to store individual project
commands to be used to push the code to github
git init -while writting code we need to initialize the git 
git add . -after add we are telling which file to be added '.' means all files will be pushed
git commit -m "commit message"
copy the repo url from GitHub
git remote add origin 'copied url from repo'
git branch -M main
git push -u origin main*/
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  
  const [country, setCountry] = useState(null); 
  
  
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const getQueryTerm = (input) => {
    const lower = input.toLowerCase().trim();
    
    const map = {
      
      "sambar": "sambar",
      "sambhar": "sambar",
      "curry": "curry",
      "vegitable": "vegetable",
      "veg": "vegetarian",
      
      
      "indian": "indian",
      "american": "american",
      "italian": "italian",
      "chinese": "chinese",
      "mexican": "mexican",
      "thai": "thai",
      "japanese": "japanese"
    };

    return map[lower] || lower;
  };

  
  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      if (data.meals) setSelectedRecipe(data.meals[0]);
    } catch (error) {
      console.error("Error fetching details", error);
    }
  };

 
  const fetchRecipes = async (queryTerm) => {
    setLoading(true);
    setRecipes([]);
    setSelectedRecipe(null);

    
    const countries = ["indian", "american", "italian", "chinese", "mexican", "thai", "japanese", "french", "british"];
    const query = getQueryTerm(queryTerm);

    let url = "";

    if (countries.includes(query)) {
      
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${query}`;
    } else {
      
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  

 
  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    fetchRecipes(selectedCountry); 
  };

  
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchRecipes(search);
    }
  };

  
  const handleCardClick = (meal) => {
    if (meal.strInstructions) {
      setSelectedRecipe(meal);
    } else {
      setSelectedRecipe(meal);
      fetchRecipeDetails(meal.idMeal);
    }
  };

 

  
  if (!country) {
    return (
      <div className="container welcome-screen">
        <h1>🍽️ Welcome to Recipe Finder</h1>
        <h2>Which country do you belong to?</h2>
        <p>Select your country to see famous recipes:</p>
        
        <div className="country-grid">
          <button className="country-btn" onClick={() => handleCountrySelect("Indian")}>🇮🇳 India</button>
          <button className="country-btn" onClick={() => handleCountrySelect("American")}>🇺🇸 USA</button>
          <button className="country-btn" onClick={() => handleCountrySelect("Italian")}>🇮🇹 Italy</button>
          <button className="country-btn" onClick={() => handleCountrySelect("Chinese")}>🇨🇳 China</button>
          <button className="country-btn" onClick={() => handleCountrySelect("Mexican")}>🇲🇽 Mexico</button>
          <button className="country-btn" onClick={() => handleCountrySelect("Thai")}>🇹🇭 Thailand</button>
          <button className="country-btn" onClick={() => handleCountrySelect("Japanese")}>🇯🇵 Japan</button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="container">
      <h1>🍽️ Recipe Finder</h1>
      
      
      <form onSubmit={handleSearch} style={{ marginBottom: "20px", marginTop: "20px" }}>
        <input
          type="text"
          placeholder={`Search recipes (e.g., Sambar, ${country} Curry)...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Find</button>
      </form>

      
      {loading && <p>Loading recipes...</p>}
      
      {!loading && recipes.length === 0 && (
        <p style={{ color: "gray" }}>No recipes found. Try searching for "Sambar" or "Curry".</p>
      )}

      <div className="recipe-list">
        {recipes.map((meal) => (
          <div
            key={meal.idMeal}
            className="recipe-card"
            onClick={() => handleCardClick(meal)}
          >
            <h3>{meal.strMeal}</h3>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
          </div>
        ))}
      </div>

      
      {selectedRecipe && (
        <div className="recipe-details">
          <button 
            onClick={() => setSelectedRecipe(null)} 
            style={{ float: "right", background: "#e74c3c", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer" }}
          >
            Close
          </button>
          
          <h2>{selectedRecipe.strMeal}</h2>
          <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", marginBottom: "20px" }} />
          
          {selectedRecipe.strInstructions ? (
            <>
              <h3>Ingredients</h3>
              <ul>
                {Array.from({ length: 20 }, (_, i) => {
                  const ingredient = selectedRecipe[`strIngredient${i + 1}`];
                  const measure = selectedRecipe[`strMeasure${i + 1}`];
                  if (ingredient && ingredient.trim() !== "") {
                    return <li key={i}>{ingredient} - {measure}</li>;
                  }
                  return null;
                })}
              </ul>
              <h3>Instructions</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{selectedRecipe.strInstructions}</p>
            </>
          ) : (
            <p><i>Loading ingredients...</i></p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;