// helpTexts.js

const helpTexts = {
    categories: (
        <>
          <b>Kategoriat</b>
          <br />
          <p>
          Voit lisätä mieleisiäsi kategorioita, kuten Hedelemät, Vihannekset, Leivät jne.
          <br />
          Voit muuttaa kategogorioiden järjestystä raahaamalla kategorian sopivaan kohtaan.
          <br />
          <br />
          Tuotteet -sivulle pääset joko alavalikosta tai kategorian nuolipainikkeesta.
          Jos menet nuolipainikkeesta, Tuote-sivulla näytetään vain sen kategorian tuotteet ja uusi tuote lisätään kyseiseen kategoriaan.
          <br />
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
          Voit ruksata keräämäsi tuotteet ja poistaa ne ostoslistalta. Tuotteet eivät poistu tuotelistalta.
          </p>
          <p>
          Tulostettavan tekstimuotoisen listan voit kopioida leikepöydälle tai jakaa viestinä.          
          </p>
          
        </>
      ),
    delete: (
      <>
        <b>Poista tiedot...</b>
        <br />
        Sovelluksen kaikki data on tallennettu selaimen muistiin.
        <br />
        Tiedot poistetaan selaimen muistista ja niitä ei voi palauttaa.
        <br />
        Ennen poistamista kysytään vielä varmistus, haluatko varmasti poistaa.
        <br />
      </>
    ),
    // Lisää tarvittaessa muita sivuja...
  };
  
  export default helpTexts;
  