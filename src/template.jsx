const App = () => {
  // eslint-disable-next-line no-undef
  const [count, setCount] = React.useState(0)
  return <div>
    <button onClick={() => setCount(count + 1)}>add</button>
    <p>counter: {count}</p>
  </div>
}
export default App