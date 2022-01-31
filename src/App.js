import './App.css';
import { useEffect, useState } from 'react';

const baseURL = 'https://api.memegen.link/templates?animated=false';

function App() {
  const [templates, setTemplates] = useState([
    { value: 'empty', label: '---' },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState('doge');
  // const [inputText, setInputText] = useState('');
  const [topText, setTopText] = useState('');
  const [botText, setBotText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageData, setImageData] = useState('');
  const [click, setClick] = useState(false);

  function textReplace(stringInput) {
    let tempString = stringInput.trim();
    tempString = tempString.replace(/\s/g, '_');
    tempString = tempString.replace(/[#]/g, '~h');
    tempString = tempString.replace(/[?]/g, '~q');
    tempString = tempString.replace(/[/]/g, '~s');
    return tempString;
  }

  // function handleKeyDown(e) {
  //   if (e.key === 'Enter') {
  //     const element = document.getElementById('memeSelector');
  //     element.label = inputText;
  //     // setSelectedTemplate(inputText);
  //     // if (pic !== selectedTemplate.value) {
  //     //   setPic(selectedTemplate.value);
  //     // }
  //   }
  // }

  let address = 'https://api.memegen.link/images/' + selectedTemplate;
  if (topText !== '') {
    address += '/' + textReplace(topText);
  }
  if (botText !== '') {
    address += '/' + textReplace(botText);
  }
  address += '.png';

  useEffect(() => {
    if (!isLoaded) {
      console.log(setSelectedTemplate);
      fetch(baseURL)
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            // templates.length = 0; // empty out the template array before filling it
            const newTemp = result.map((e) => {
              return { value: e.id, label: e.name }; // add the available templates one by one
            });
            setTemplates(newTemp);
          },
          (err) => {
            setIsLoaded(true);
            console.log(err);
          },
        );
    }
  }, [setTemplates, isLoaded, setIsLoaded]);

  useEffect(() => {
    if (click) {
      setClick(false);
      fetch(address)
        .then((response) => {
          response
            .arrayBuffer()
            .then((buffer) => {
              const element = document.createElement('a');
              const file = new Blob([buffer], { type: 'image/png' });
              element.href = URL.createObjectURL(file);
              setImageData(element.href);
              element.download = 'image.png';
              element.click();
            })
            .catch(function (e) {
              console.error(e.message); // "oh, no!"
            });
        })
        .catch(function (e) {
          console.error(e.message); // "oh, no!"
        });
    }
  }, [click, address, setImageData]);

  return (
    <div>
      <label>
        Meme template
        {/* <input
          value={inputText}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setInputText(e.currentTarget.value);
          }}
        /> */}{' '}
        <br />
        <select
          id="memeSelector"
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          {templates.map((e) => {
            return (
              <option key={e.value + e.label} value={e.value} label={e.label}>
                {e.label}
              </option>
            );
          })}
        </select>
      </label>
      <br />

      <label>
        Top text
        <input
          placeholder="top text"
          onChange={(e) => {
            setTopText(e.currentTarget.value);
          }}
          value={topText}
        />
      </label>
      <br />
      <label>
        Bottom text
        <input
          placeholder="bottom text"
          onChange={(e) => {
            setBotText(e.currentTarget.value);
          }}
          value={botText}
        />
      </label>
      <br />
      <br />
      <img
        alt="meme"
        src={imageData === '' ? address : imageData}
        data-test-id="meme-image"
      />
      <br />
      <button onClick={() => setClick(true)}>Download</button>
    </div>
  );
}

export default App;
