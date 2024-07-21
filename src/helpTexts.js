// helpTexts.js

const helpTexts = {
    categories: (
        <>
          
          <b>Ostokset</b>       
          <p>           
            3 näkymää: kategoriat, tuotteet ja ostoslista. 
            Näkymiä vaihdat alalaidan painikkeista.
          </p>
          
          
          <b>Kategoriat</b>
          <p>         
          Voit lisätä mieleisiäsi kategorioita, kuten Hedelemät, Vihannekset, Leivät jne.
          </p><p>
          Voit muuttaa kategogorioiden järjestystä raahaamalla kategorian sopivaan kohtaan.
          </p><p>
          Tuotteet -sivulle pääset joko alavalikosta tai kategorian nuolipainikkeesta.
          Jos menet nuolipainikkeesta, Tuote-sivulla näytetään vain sen kategorian tuotteet ja uusi tuote lisätään kyseiseen kategoriaan.
          </p>
        </>
      ),
    products: (
        <>
          <b>Tuotteet</b> 
          <p>
          Kirjoittaessasi alareunan tekstikenttään sivulta etsitään tekstiä vastaavia tuotteita ja ne korostetaan. 
          Voit tyhjentää kentän vasemmalla puolella olevasta ruksista tai lisätä tuotteen + painikkeesta.
          </p>           
          <p>
          Jos tulit sivulle kategorian nuolipainikkeesta, sivulla näytetään vain sen kategorian tuotteet 
          ja uusi tuote lisätään kyseiseen kategoriaan.
          </p>
          <p>
          Jos tulit sivulle alavalikon kautta, näytetään kaikki tuotteet. Tällöin uudelle tuotteelle 
          ei anneta kategoriaa, mutta voit asettaa sen kynän kuvaa klikkaamalla.
          Laittamalla ruksin "Kategorioittain" kohtaan, tuotteet näytetään kategorioittain 
          ja ylimpänä ne, joille ei ole asetettu kategoriaa.          
          </p>
          <p>
          Voit asettaa tuotteita suosikeiksi ja yläpalkin tähdestä suodattaa näkyviin vain suosikit.
          </p>
          <p>
          Klikkaamalla ostoskorin kuvaa voit asettaa tuotteen ostoslistalle tai pois sieltä.
          </p>                  
        </>
      ),
    shoppingList: (
        <>
          <b>Ostoslista</b>
          <p>
          Ostoslistalla näkyvät tuote-sivulla ostoskoriin valitsemasi tuotteet. Voit antaa ostettavan määrän ja yksikön.
          </p>
          <p>
          Tuotteet näytetään kategorioitten mukaisessa järjestyksessä, jonka voit asettaa kategoriat-sivulla.
          </p>
          <p>
          Voit ruksata keräämäsi tuotteet ja <b>poistaa</b> ne ostoslistalta. Tuotteet eivät poistu tuotelistalta.
          </p>
          <p>
          <b>Jaa</b> painikkeesta listan voit jakaa tekstimuotoisena tai kopioida leikepöydälle.          
          </p>
          <p>
          <b>Tuo</b> painikkeella voit tuoda tällä sovelluksella jaetun listan tai itse kirjoitetun listan.
          Puuttuvat kategoriat ja tuotteet lisätään. Kategoriariviksi tulkitaan rivi, joka loppuu ":".
          Voit antaa tuotteet myös ilman kategoriaa jolloin ne menevät "Ei kategoriaa" alle. Esimerkkejä:
          </p>
          <pre>
          Hevi:<br/>
            - Appelsiini 5 kpl <br/>
            - Kurkku 1 <br/>
          Juomat: <br/>
            -Maito <br/> 
          Leivät:<br/>
            *Leipää 2kpl <br/>          
          </pre>
          <p>tai:</p>
          <pre>
          Hevi:<br/>
          Appelsiini 5 kpl <br/>
          Kurkku 1 <br/>
          Juomat: <br/>
          Maito <br/> 
          Leivät:<br/>
          Leipää 2kpl <br/>          
          </pre>
          <p>tai:</p>
          <pre>
          Kurkku 1 <br/>
          Maito <br/> 
          Leipää 2kpl <br/>
          Appelsiini 5 kpl <br/>
          
          </pre>
                    
        </>
      ),
    deleteDB: (
      <>
        <p>
        Sovelluksen kaikki data on tallennettu selaimen muistiin. Mikäli haluat poistaa koko sovelluksen, on hyvä tehdä ensin tämä tietojen poisto.
        </p>
        <p>
        Tiedot poistetaan selaimen muistista ja niitä ei voi palauttaa, ellet ole ottanut varmuuskopita "Vie tiedot" toiminnolla.
        </p>
        <p>
        Ennen poistamista kysytään vielä varmistus, haluatko varmasti poistaa.        
        </p>

      </>
    ),
    // Lisää tarvittaessa muita sivuja...
  };
  
  export default helpTexts;
  