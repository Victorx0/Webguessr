import { Routes, Route } from 'react-router-dom'
import Page from './game/page'
import Navigator from './nav/navigator'
import Home from './nav/home'
import Register from './nav/register'
import Login from './nav/login'
import Dashboard from './nav/dashboard'
import Edittor from './edit/edittor'
import Create from './edit/create'
import NewTable from './edit/newTable'

import Wrapper from './wrapper'

function App() {

  return(
    <>
      <Navigator />
      <div style={{ paddingTop: "80px" }}>
      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<Home />}/>
        <Route path="/game/:id" element={
          <Wrapper>
            <Page/>
          </Wrapper>
          }/>
        <Route path="/dashboard" element={
          <Wrapper>
            <Dashboard/>
          </Wrapper>
        }/>
        <Route path="/edit/:id" element={
          <Wrapper>
            <Edittor/>
          </Wrapper>
        }/>
        <Route path="/create" element={
          <Wrapper>
            <Create/>
          </Wrapper>
        }/>
        <Route path="/new_table" element={
          <Wrapper>
            <NewTable/>
          </Wrapper>
        }/>
      </Routes>
      </div>
    </>
  )
}

export default App
