import React, { useEffect, useState } from 'react';

function ChampionSearch({ dbdata, chosen, }) {
  const headings = Object.keys(dbdata[0])
  const [input, setInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleInputChange = (e: { target: { value: string; }; }) => {
    const userInput = e.target.value;
    setInput(userInput);

    const matchedData = dbdata.filter((champ: { name: string; }) => 
      champ.name.toLowerCase().includes(userInput.toLowerCase())
    );

    setFilteredData(userInput ? matchedData : []);
  };

  const handleSearch = (champion) => {
    // Prevent duplicate entries
    if (!searchHistory.some(item => item.id === champion.id)) {
      setSearchHistory([champion, ...searchHistory]);
    }
    setInput('');
    setFilteredData([]);
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter' && filteredData.length > 0) {
      handleSearch(filteredData[0]);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return (
    <div>
      <input 
        type="text" 
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Guess"
      />
      {filteredData.length > 0 && (
        <table>
          <tbody>
            {filteredData.map(champ => (
              <tr key={champ.id} onClick={() => handleSearch(champ)}>
                <td>{champ.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

{searchHistory.length > 0 && (
        <div>
        <h2>Search History</h2>
        <button onClick={clearSearchHistory}>Clear History</button>
        <table className="table">
          <thead>
            <tr>
            {headings.map(heading => (
              <th>{heading}</th>
            ))}
            </tr>
          </thead>
          <tbody>
          {searchHistory.map(champion => (
            <tr key={champion[headings[2]]}>
              {headings.map(heading => (
                <td 
                  key={heading}
                  style={{ 
                    color: chosen && chosen[0][heading] === champion[heading] ? 'green' : 'red' 
                  }}
                >
                  {champion[heading]}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default ChampionSearch;