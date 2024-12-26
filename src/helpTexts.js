// helpTexts.js

const helpTexts = {
  categories: (
    <>

      <b>Ostokset</b>
      <p>
        3 näkymää: kategoriat, tuotteet ja ostoslista.
        Näkymiä vaihdat alalaidan painikkeista. Kullekin näkymälle on oma infotekstinsä.
      </p>


      <b>Kategoriat</b>
      <p>
        Voit lisätä mieleisiäsi kategorioita, kuten Hedelmät, Vihannekset, Leivät jne.
      </p><p>
        Voit muuttaa kategorioiden järjestystä raahaamalla kategorian sopivaan kohtaan.
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
        Kirjoittaessasi <b>alareunan tekstikenttään</b> sivulta etsitään tekstiä vastaavia tuotteita ja ne korostetaan.
        Voit tyhjentää kentän vasemmalla puolella olevasta ruksista tai lisätä tuotteen + painikkeesta.
      </p>
      <p>
        Jos tulit sivulle <b>kategorian nuolipainikkeesta</b>, sivulla näytetään vain sen kategorian tuotteet
        ja uusi tuote lisätään kyseiseen kategoriaan.
      </p>
      <p>
        Jos tulit sivulle <b>alavalikon kautta</b>, näytetään kaikki tuotteet. Tällöin uudelle tuotteelle
        ei anneta kategoriaa, mutta voit asettaa sen kynän kuvaa klikkaamalla.
        Asettamalla yläreunasta "Kategoriat" näkymään, tuotteet näytetään kategorioittain
        ja ylimpänä ne, joille ei ole asetettu kategoriaa.
      </p>
      <p>
        Voit asettaa tuotteita <b>suosikeiksi</b> ja yläpalkin tähdestä suodattaa näkyviin vain suosikit.
      </p>
      <p>
        Klikkaamalla <b>ostoskorin</b> kuvaa voit asettaa tuotteen ostoslistalle tai pois sieltä.
        Asetuksista voi määritellä, haluatko avata määrädialogin automaattisesti vai vasta pitkällä klikkauksella.
      </p>
      <p>
        Voit suodattaa tuotteita <b>väreittäin</b>. Menun asetuksista voi säätää, käytetäänkö tuotteilla värikoodeja.
        Halutessasi voit määritellä väreille merkitykset menun valikosta "Värien määrittely".
        Tuotteelle voit valita värit ja tuotesivun yläpalkin suodattimesta voi valita näkyviin haluamasi värit/värittömät
        ja poistaa valinnat klikkaamalla suodattimen kuvaa.
      </p>
      <p>
        Voit antaa tuotteille <b>luokitustietoja</b>, esim proteiinit, hiilihydraatit jne, kun määrittelet luokat ensin asetuksista.
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
        Hevi:<br />
        - Appelsiini 5 kpl <br />
        - Kurkku 1 <br />
        Juomat: <br />
        -Maito <br />
        Leivät:<br />
        *Leipää 2kpl <br />
      </pre>
      <p>tai:</p>
      <pre>
        Hevi:<br />
        Appelsiini 5 kpl <br />
        Kurkku 1 <br />
        Juomat: <br />
        Maito <br />
        Leivät:<br />
        Leipää 2kpl <br />
      </pre>
      <p>tai:</p>
      <pre>
        Kurkku 1 <br />
        Maito <br />
        Leipää 2kpl <br />
        Appelsiini 5 kpl <br />
      </pre>
      <p>tai:</p>
      <pre>
        1Kurkku  <br />
        Maito <br />
        2kpl Leipää  <br />
        5 kpl Appelsiini<br />
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
  exportDB: (
    <>
      <p>
        Tallenna tiedot tiedostoon varmuuskopioksi tai kopioi leikepöydälle.
      </p>
    </>
  ),
  showExportDB: (
    <>
      <br />
      Voit muokata tietoja.
    </>
  ),
  importDB: (
    <>
      <p>
        Kaikki tiedot korvataan valitsemastasi tiedostosta tai tekstikentästä.
      </p>
    </>
  ),
  showImportDB: (
    <>
      <br />
      Liitä tai kirjoita tähän tiedot json-muotoisena:
    </>
  ),
  loadExampleDB: (
    <>
      <p>
        Voit ladata esimerkkiaineiston. Kaikki nykyiset tiedot poistetaan.
      </p>
      <p>
        Mikäli olet jo tallentanut tietoja ohjelmalla, suositellaan varmuuskopion ottamista "Vie tiedot" toiminnolla.
      </p>
    </>
  ),
  productClasses: (
    <>
      
        Voit määritellä tuoteluokkia, esimerkiksi proteiinit, kasvikset, rasvat jne.
        Tiedot tallentuvat välittömästi ilman erillistä tallentamista, myös poisto!
        Nimeä voit muokata suoraan tekstikentässä. Luokkien järjestystä voit muuttaa raahaamalla luokkaa haluttuun paikkaan.
      
    </>
  ),


};

export default helpTexts;
