import { useState, useEffect } from 'react';
import supabase from "../Supabase/supabaseClient";
import ChampionSearch from './ChampionSearch';
import { useParams } from 'react-router-dom';

interface DataItem {
  id: number;
  name: string;
  [key: string]: any; // For any additional properties
}

function Page() {
    const { id } = useParams<{ id: string }>();
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [dbdata, setdbData] = useState<DataItem[] | null>(null);
    const [chosen, setChosen] = useState<DataItem[] | null>(null);
    const [numberEffect, setnumberEffect] = useState(0);
      
    useEffect(() => { 
        const fetchAll = async () => {
            const { data: playsetData, error: playsetError } = await supabase
                .from('user_custom_tables')
                .select()
                .eq('id', Number(id));
            
            if (playsetError) {
                setFetchError('Could not fetch the playsets');
                console.log(playsetError);
                return;
            }
            
            if (playsetData && playsetData.length > 0) {
                setFetchError(null);
                console.log(playsetData);
              
                const { data, error } = await supabase
                    .from(playsetData[0].table_name)
                    .select();
              
                console.log('Raw Supabase Response:', { data, error });
              
                if (error) {
                    setFetchError('Could not fetch the data');
                    setdbData(null);
                    console.log(error);
                }
                if (data) {
                    setdbData(data);
                    setFetchError(null);
                    console.log(dbdata);
                }
            }
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
                console.log(matchedData);
                setnumberEffect(0);
            }
        };
        handleChosen();
    }, [numberEffect, dbdata]);

    return (
        <>
            <button className="btn btn-primary" onClick={() => {setnumberEffect(1)}}>Reset</button>
            {dbdata && (
                <ChampionSearch dbdata={dbdata} chosen={chosen} />
            )}
            {fetchError && (<p>{fetchError}</p>)}
        </>
    );
}

export default Page;