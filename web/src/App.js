import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  SearchResults
} from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
