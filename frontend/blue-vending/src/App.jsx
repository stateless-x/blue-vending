import "./styles/App.scss";
import { ProductList } from "./components/ProductList";
function App() {
  return (
    <>
      <div className="header-container">
        <h1 className="header">Blue Vending</h1>
        <h5 className="subheader">Fulfull your belly with happiness</h5>
      </div>
      <ProductList />
    </>
  );
}

export default App;
