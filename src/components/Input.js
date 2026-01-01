import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Mic } from "lucide-react"; // Käytetään Lucide-react-ikonia


const Input = styled.input`
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px; 
    margin: 2px;
    flex:1;     //Ottaa kaiken jäljellä olevan tilan  
`;

const InputAdd = styled(Input)`
    width: -webkit-fill-available;       
`;
export default InputAdd;

export const InputQuantity = styled.input`
    padding: 2px;
    margin: 2px;
    flex:1;     //Ottaa kaiken jäljellä olevan tilan  
    width: 35px;   
    &::placeholder {
    font-size: 9px; /* Pienennä placeholder-tekstin kokoa */
    /*color: #999;*/ /* Vaihda tarvittaessa placeholderin väri */
  }   
`;

export const InputUnit = styled(InputQuantity)`
    width: 30px;    
    &::placeholder {
    font-size: 9px; /* Pienennä placeholder-tekstin kokoa */    
  }    
`;

export const InputPrice = styled(InputQuantity)`       
`;

export const InputName = styled(Input)`
   margin-left: 10px;
   width: 200px;   
`;

export const InputCommon = styled(Input)`
   margin-left: 10px;      
   width: 180px; 
`;

export const InputColorShortName = styled(Input).attrs({
  maxLength: 6 // maksimimerkkimäärä
})`
    width: 50px;      
`;

export const Select = styled.select`
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
  margin-right: 2px;
  width: 196px; 
`;

export const InputTextArea = styled.textarea`
  width: 80%;
  height: 180px;
  margin: 2px 15px;
`;

export const InputAddProduct = styled(InputAdd)`
    padding-right: 40px; /* Tilaa mikrofonikuvakkeelle */
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: -webkit-fill-available;
`;

const MicButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $isActive }) => ($isActive ? "red" : "black")};
  }
`;


export const SpeechInput = ({ value, onChange, placeholder }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const supportsSpeech = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Alustetaan puheentunnistus, jos selain tukee
  const startListening = () => {
    if (!supportsSpeech) {
      console.log("Selain ei tue puheentunnistusta.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {


      if (!recognitionRef.current) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "fi-FI"; // Kieli voidaan tarvittaessa muuttaa
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event) => {
          let speechResult = event.results[0][0].transcript.trim();

          // Poistetaan piste lopusta, jos sellainen on
          if (speechResult.endsWith(".")) {
            speechResult = speechResult.slice(0, -1);
          }

          // Muutetaan ensimmäinen kirjain isoksi
          speechResult = speechResult.charAt(0).toUpperCase() + speechResult.slice(1);

          const updatedValue = value ? `${value} ${speechResult}` : speechResult;
          onChange({ target: { value: updatedValue } });
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }

      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return supportsSpeech ? (
    <InputWrapper>
      <InputAddProduct
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <MicButton onClick={startListening} $isActive={isListening}>
        <Mic />
      </MicButton>
    </InputWrapper>
  ) : (
    <InputAddProduct
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};