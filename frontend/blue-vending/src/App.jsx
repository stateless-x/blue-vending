import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import { ProductList } from "./components/ProductList";
import { Navbar } from "./components/Navbar";
import { Manage } from "./components/Manage";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes path="/" element={<ProductList />}>
        <Route index element={<ProductList />} />
        <Route path="/manage" element={<Manage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
