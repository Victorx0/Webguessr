import { useState, useEffect } from 'react';
import supabase from "../Supabase/supabaseClient";
import ChampionSearch from './ChampionSearch';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap

interface DataItem {
  id: number;
  name: string;
  [key: string]: any; // For any additional properties
}

function Page() {
    const { id } = useParams<{ id: string }>();
    const [Title, setTitle] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [dbdata, setdbData] = useState<DataItem[] | null>(null);
    const [chosen, setChosen] = useState<DataItem[] | null>(null);
    const [numberEffect, setnumberEffect] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchHistory, setSearchHistory] = useState<DataItem[]>([]);
      
    useEffect(() => { 
        const fetchAll = async () => {
            setLoading(true);
            const { data: playsetData, error: playsetError } = await supabase
                .from('user_custom_tables')
                .select()
                .eq('id', Number(id));
            
            if (playsetError) {
                setFetchError('Could not fetch the playsets');
                console.log(playsetError);
                setLoading(false);
                return;
            }
            if(playsetData){
                setTitle(playsetData[0].table_name.slice(playsetData[0].user_id.length + 6))
            }
            if (playsetData && playsetData.length > 0) {
                setFetchError(null);
                
                const { data, error } = await supabase
                    .from(playsetData[0].table_name)
                    .select();
              
                if (error) {
                    setFetchError('Could not fetch the data');
                    setdbData(null);
                    console.log(error);
                }
                if (data) {
                    setdbData(data);
                    setFetchError(null);
                }
            }
            setLoading(false);
            setnumberEffect(1);
        };
        
        fetchAll();
    }, [id]);
    
    useEffect(() => {
        const handleChosen = () => {
            if (dbdata != null) {
                const randomindex = Math.ceil((Math.random() * dbdata.length));
                console.log('Random Index:', randomindex);
                const matchedData = dbdata.filter(champ => champ.id === randomindex);
                setChosen(matchedData);
                setnumberEffect(0);
                
                // Clear search history when new champion is chosen
                setSearchHistory([]);
            }
        };
        handleChosen();
    }, [numberEffect, dbdata]);

    // Function to handle adding to search history
    const addToSearchHistory = (champion: DataItem) => {
        if (!searchHistory.some(item => item.id === champion.id)) {
            setSearchHistory([champion, ...searchHistory]);
        }
    };

    return (
        <div className="container py-4">
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h1 className="display-5 fw-bold">{Title}</h1>
                    <p className="lead">Test your knowledge and make your guesses!</p>
                </div>
            </div>
            
            <div className="row mb-4">
                <div className="col-12">
                    <button 
                        className="btn btn-primary" 
                        onClick={() => {setnumberEffect(1)}}
                    >
                        <i className="bi bi-arrow-repeat me-2"></i>
                        New Champion
                    </button>
                </div>
            </div>
            
            {loading && (
                <div className="row">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading game data...</p>
                    </div>
                </div>
            )}
            
            {dbdata && !loading && (
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <ChampionSearch 
                                    dbdata={dbdata} 
                                    chosen={chosen} 
                                    searchHistory={searchHistory}
                                    addToSearchHistory={addToSearchHistory}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {fetchError && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {fetchError}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;