// helpTexts.js

const helpTexts = {
  categories: (
    <>

      <b>Ostokset - sovellus</b>
      <p>
        4 näkymää: kategoriat, tuotteet, ostoslista ja päivät, joista viimeisin asetettavissa näkymään valikon asetuksista.
        Näkymiä vaihdat alalaidan painikkeista. Kullekin näkymälle on oma infotekstinsä.
      </p>

      <b>Kategoriat -näkymä</b>
      <p>
        Voit lisätä mieleisiäsi kategorioita, kuten Hedelmät, Vihannekset, Leivät jne.
      </p><p>
        Voit muuttaa kategorioiden järjestystä raahaamalla kategorian sopivaan kohtaan.
      </p><p>
        Tuotteet -sivulle pääset joko alavalikosta tai kategorian nuolipainikkeesta.
        Jos menet nuolipainikkeesta, Tuote-sivulla näytetään vain sen kategorian tuotteet ja uusi tuote lisätään kyseiseen kategoriaan.
      </p><p>
        Ohjelman käytön kannalta kategorioita ei ole pakko määritellä ja käyttää ollenkaan.
      </p>
    </>
  ),
  products: (
    <>
      <b>Tuotteet</b>
      <p>
        Kirjoittaessasi <b>alareunan tekstikenttään</b> sivulta etsitään tekstiä vastaavia tuotteita ja ne korostetaan.
        Yleisistä asetuksista voit määritellä, suodatetaanko näkymään vain löydetyt tuotteet.
        Voit tyhjentää kentän vasemmalla puolella olevasta ruksipainikkeesta tai lisätä tuotteen + painikkeesta.
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
  days: (
    <>

      <b>Päivät</b>
      <p>
        Päivät sisältää <i>suunnittelunäkymän</i> ja <i>toteutusnäkymän</i>. 
         <br />
        Voit valita näkymään kaikki tai pelkästään <i>aktivoidut päivät</i>. (Aktivointi päälle tai pois klikkaamalla päivän nimen edessä olevaa painiketta.)
        <br />
      </p><p>
        <b>Suunnittelunäkymä</b>
      </p><p>
        Suunnittelunäkymässä voit lisätä haluamasi määrän päiviä ja voit muuttaa niiden järjestystä raahaamalla. 
       <br />
        Näkymä on monitasoinen: <br />
        päivät - ateriat - tuoteluokat - tuotteet.
      </p><p>
        Lisäämäsi <b>päivän</b> kohdalla on kaksi painiketta oikeassa laidassa. <i>Kynän</i> kuvasta pääset muokkaamaan päivän nimeä, valitsemaan sille värikoodin, ja lisäämään muistiinpanoja.
        <br />
        <i>Nuoli ylös/alas</i> laajentaa tai kutistaa päivän tiedot. Laajennetussa näkymässä pääset lisäämään päivälle aterioita.
      </p><p>
        <b>Aterian</b> lisäys painikkeesta ja muokkaus kynän kuvasta avaa ikkunan, jossa näytetään <i> luokat, jotka olet määritellyt erikseen</i> <small>(Asetukset-Tuoteluokkien määrittely)</small>  ja lisäksi luokasta riippumaton "Vapaa valinta".
      </p><p>
        Kun olet valinnut ateriaan kuuluvat luokat joko pakolliseksi tai valinnaiseksi, ne näytetään aterialla, kun avaat nuolesta aterian laajennetun näkymän.
      </p><p>
        Aterialle valitsemasi <b>luokan</b> kohdalta pääset edelleen oikean reunan nuolipainikkeella avaamaan tuotelistan,
        jossa näytetään ne tuotteet, jotka voit määrittelyjesi mukaan valita aterialle.
      </p><p>
        <b>Tuotelistat aterialle luokittain:</b>
        <br />  
        Itse määrittelemillesi <i>luokille</i> tuotelistalla näytetään vain ne tuotteet,
        jotka olet valinnut kuulumaan tuohon luokkaan Tuote-näkymässä.
        <br />Jos olet valinnut päivälle <i>värin</i>, tuotelistalla näytetään vain ne tuotteet,
        joille olet laittanut kyseisen värin Tuote-näkymässä.
        <br />
        <i>"Vapaa valinta"</i> suodattaa tuotteita vain värin mukaan, mikäli se on päivälle valittu.
      </p><p>
        <b>Tuotteet</b> ovat painikkeina, joita voit valita päälle/pois.
        Valitut näytetään luokan nimen perässä.
      </p><p>
      <b>Toteutusnäkymä</b>
      </p><p>
      Myös tässä näkymässä voi valita näkyviin joko kaikki tai pelkästään <i>valitut päivät</i>.            
      </p><p>
        Toteutusnäkymässä voit ruksata päivälle suunnitellut tuotteet valituiksi, esimerkiksi ruoat syödyiksi.      
      </p><p>
        Voit myös vaihtaa aterian tuotteita luokittelukohtaisesti oikeassa reunassa näkyvien nuolipainikkeen avulla.      
      </p>
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
