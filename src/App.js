import './App.css';
import List from './List';

function App() {
  return (
    <div className="App">
      <h1>hello</h1>
      <List items={[{text:'hi'}, {text:'there'}, {text:'world'}]}/>
    </div>
  );
}

export default App;
