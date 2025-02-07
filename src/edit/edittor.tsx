import { useParams } from 'react-router-dom'
import supabase from '../Supabase/supabaseClient'
import { useEffect,useState } from 'react'

import DataTable from './datatable'

function Edittor(){
    const id = useParams().id
    const [playset, setPlayset] = useState<Array<{id: number, name: string, columns: number}> | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [dbdata, setdbData] = useState<Array<{id: number, name: string}> | null>(null)

    useEffect(() => { 
        const fetchAll = async () => {
            // First fetch playsets
            const {data: playsetData, error: playsetError} = await supabase
            .from('user_custom_tables')
            .select()
            .eq('id', Number(id) + 1)
            
            if(playsetError) {
            setFetchError('Could not fetch the playsets')
            setPlayset(null)
            console.log(playsetError)
            return // Exit early if there's an error
            }
            
            if(playsetData) {
              setPlayset(playsetData)
              setFetchError(null)
              console.log(Number(id))
              
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
              }
            }
        }
        
        fetchAll()
        }, [])

        // In your parent component
        const handleSave = async (editedData: any) => {
            for (const row of editedData) {
              if (row.id) {
                // Update existing row
                const { error } = await supabase
                  .from(playset[0].table_name)
                  .update(row)
                  .eq('id', row.id);
                
                if (error) throw error;
              } else {
                // Insert new row
                const { error } = await supabase
                  .from(playset[0].table_name)
                  .insert(row);
                
                if (error) throw error;
              }
            }
          };

    
        return (
        <>
          <DataTable 
                dbdata={dbdata} 
                onSave={handleSave}
            />
        </>
            
            );
}

export default Edittor