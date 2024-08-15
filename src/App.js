import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import TestComponent from './pages/Test';
import { Route as RouteConst } from './constants/constants';
import { Flex } from 'antd';

function App() {

  const navigate = useNavigate()

  return (
    <div className="App">
      <div>
        <button onClick={()=>{navigate(`/${RouteConst.TEST}`)}}> test</button>
      </div>

      <Routes>
        <Route path={`/${RouteConst.TEST}`} element={
          <TestComponent />
        } />
      </Routes>
    </div>
  );
}

export default App;
