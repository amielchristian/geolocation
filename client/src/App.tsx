import { useState, useEffect } from "react";
import { getMessage } from "./lib/services";

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const getResponse = async () => {
      const response = await getMessage();
      setMessage(response.message);
    };
    getResponse();
  }, [message]);

  return (
    <>
      <div>Hi! A message from the API: {message}</div>
    </>
  );
}

export default App;
