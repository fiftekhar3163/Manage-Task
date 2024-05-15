import ToDo from "./components/ToDo";
import { Header } from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <ToDo />
        </div>
      </main>
    </>
  );
}

export default App;
