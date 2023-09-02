import "./styles/App.scss";
import { ProductList } from "./components/ProductList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes path="/" element={<ProductList />}>
        <Route index element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
