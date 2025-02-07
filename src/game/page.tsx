import { useState, useEffect } from 'react'
import supabase from "../Supabase/supabaseClient"
import ChampionSearch from './ChampionSearch'
import { useParams } from 'react-router-dom'

function Page(){
    const id = useParams().id
    const [playset, setPlayset] = useState<Array<{id: number, table_name: string, columns: number}> | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [dbdata, setdbData] = useState<Array<{id: number, name: string}> | null>(null)
    const [chosen, setChosen] = useState<Array<{id: number, name: string}> | null>(null)
    const [numberEffect, setnumberEffect] = useState(0)
      
    useEffect(() => { 
        const fetchAll = async () => {
            // First fetch playsets
            const {data: playsetData, error: playsetError} = await supabase
            .from('user_custom_tables')
            .select()
            .eq('id', Number(id));
            
            if(playsetError) {
            setFetchError('Could not fetch the playsets')
            setPlayset(null)
            console.log(playsetError)
            return // Exit early if there's an error
            }
            if(playsetData) {
              setPlayset(playsetData)
              setFetchError(null)
              console.log(playsetData) 
              
              // Only after we have playsetData, fetch the second dataset
              const {data, error} = await supabase
                  .from(playsetData[0].table_name)
                  .select()

              
              console.log('Raw Supabase Response:', { data, error });
              
              if(error) {
                  setFetchError('Could not fetch the data')
                  setdbData(null)
                  console.log(error)
              }
              if(data) {
                  setdbData(data)
                  setFetchError(null)
                  console.log(dbdata)
              }
            }
            setnumberEffect(1)
        }
        
        fetchAll()
        }, [])
    
      useEffect(() => {
        const handleChosen = () => {
          if(dbdata != null) {
            const randomindex = Math.ceil((Math.random() * dbdata.length))
            console.log('Random Index:', randomindex)
            const matchedData: typeof dbdata = dbdata.filter(champ => champ.id === randomindex)
            setChosen(matchedData)
            console.log(matchedData)
            setnumberEffect(0)
          }
        }
        handleChosen()
      },[numberEffect])

      
      return (
        <>
          <button className="btn btn-primary" onClick={() => {setnumberEffect(1)}}>Reset</button>
          {dbdata && (
            <ChampionSearch dbdata={dbdata} chosen={chosen}/>
          )}
          {fetchError && (<p>{fetchError}</p>)}
        </>
      )
}

export default Page