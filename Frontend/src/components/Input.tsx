import { useState } from "react";

const MyInput = () => {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p>You wrote: {text}</p>
    </div>
  );
};

export default MyInput;
