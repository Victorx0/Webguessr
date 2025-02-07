import { useState } from 'react';

interface DataItem {
    id: number;
    name: string;
    [key: string]: any; // For any additional properties
}

interface ChampionSearchProps {
    dbdata: DataItem[];
    chosen: DataItem[] | null;
}

function ChampionSearch({ dbdata = [], chosen }: ChampionSearchProps) {
    const headings = dbdata && dbdata.length > 0 ? Object.keys(dbdata[0]) : [];
    const [input, setInput] = useState('');
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [searchHistory, setSearchHistory] = useState<DataItem[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        setInput(userInput);

        const matchedData = dbdata.filter((champ) => 
            champ.name.toLowerCase().includes(userInput.toLowerCase())
        );

        setFilteredData(userInput ? matchedData : []);
    };

    const handleSearch = (champion: DataItem) => {
        if (!searchHistory.some(item => item.id === champion.id)) {
            setSearchHistory([champion, ...searchHistory]);
        }
        setInput('');
        setFilteredData([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                                    <th key={heading}>{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {searchHistory.map(champion => (
                                <tr key={champion.id}>
                                    {headings.map(heading => (
                                        <td 
                                            key={heading}
                                            style={{ 
                                                color: chosen && chosen[0] && 
                                                    chosen[0][heading] === champion[heading] 
                                                    ? 'green' 
                                                    : 'red' 
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