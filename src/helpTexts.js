// helpTexts.js
import helpCategoriesImage from './helpimages/help-categories.jpg';
import helpMenuImage from './helpimages/help-menu.jpg';
import helpPagesImage from './helpimages/help-pages.jpg';
import helpAllPagesImage from './helpimages/help-all-pages.jpg';

import helpProductFindImage from './helpimages/help-product-find.jpg';
import helpProductAddToCategoryImage from './helpimages/help-product-add1.jpg';
import helpProductAddImage from './helpimages/help-product-add2.jpg';
import helpProductView1Image from './helpimages/help-product-view1.jpg';
import helpProductShopAmountImage from './helpimages/help-product-amount.jpg';
import helpProductDefineColorsImage from './helpimages/help-product-define-colors.jpg';
import helpProductFilterColorsImage from './helpimages/help-product-filter-colors.jpg';
import helpProductClassesImage from './helpimages/help-product-classes.jpg';
import helpProductDefineClassesImage from './helpimages/help-product-define-classes.jpg';
import helpProductUseClassesImage from './helpimages/help-product-use-classes.jpg';
import helpShoppinglistImage from './helpimages/help-shoppinglist.jpg';
import helpDaysPlanImage from './helpimages/help-days-plan.jpg';
import helpDaysPlanActiveImage from './helpimages/help-days-plan-active.jpg';
import helpDaysPlanProductsImage from './helpimages/help-days-plan-products.jpg';
import helpDaysPlanEditImage from './helpimages/help-days-plan-edit.jpg';

const helpTexts = {
  categories: (
    <>

      <b>Ostokset - sovellus</b>
      <p>
        Sovellus sisältää 4 näkymää: <br /> kategoriat, tuotteet, ostoslista ja päivät.      
        <img src={helpAllPagesImage} alt="Sovellukset näkymät: kategoriat, tuotteet, ostoslista, päivät" style={{ maxWidth: '100%', height: 'auto' }} />
      </p>
      <p>        
        Näkymiä vaihdat alhaalta painikkeista. Päivänäkymän saat näkyviin asetuksista. Kullekin näkymälle avautuu oma ohje kysymysmerkistä.
        <img src={helpPagesImage} alt="Näkymän vaihtaminen alareunan painikkeista" style={{ maxWidth: '100%', height: 'auto' }} />        
      </p>
      
      <b>Kategoriat -näkymä</b>
      <p>
        Ohjelman käytön kannalta kategorioita ei ole pakko määritellä ja käyttää ollenkaan.
        Voit kuitenkin lisätä mieleisiäsi kategorioita, kuten Hedelmät, Vihannekset, Leivät jne.
        <img src={helpCategoriesImage} alt="Sivut" style={{ maxWidth: '100%', height: 'auto' }} />
        Voit muuttaa kategorioiden järjestystä raahaamalla kategorian sopivaan kohtaan.
        <br />
        Tuotteet -sivulle pääset joko alavalikosta tai kategorian nuolipainikkeesta.
        Jos menet nuolipainikkeesta, Tuote-sivulla näytetään vain sen kategorian tuotteet ja uusi tuote lisätään kyseiseen kategoriaan.
      
      </p>
    </>
  ),
  products: (
    <>
      <b>Tuotteet</b>
      <p>
        <img src={helpProductFindImage} alt="Tuotteen etsiminen ja lisääminen" style={{ maxWidth: '100%', height: 'auto' }} />        
        Kirjoittaessasi <b>alareunan tekstikenttään</b> sivulta etsitään tekstiä vastaavia tuotteita ja ne korostetaan.
        Yleisistä asetuksista voit määritellä, suodatetaanko näkymään vain löydetyt tuotteet.
        Voit tyhjentää kentän vasemmalla puolella olevasta ruksipainikkeesta tai lisätä tuotteen + painikkeesta.
      </p>
      <p>
        <img src={helpProductAddToCategoryImage} alt="Tuotteen lisääminen kategoriaan" style={{ maxWidth: '100%', height: 'auto' }} />        
        Jos tulit sivulle <b>kategorian nuolipainikkeesta</b>, sivulla näytetään vain sen kategorian tuotteet
        ja uusi tuote lisätään kyseiseen kategoriaan.
      </p>
      <p>
        <img src={helpProductAddImage} alt="Tuotteen lisääminen" style={{ maxWidth: '100%', height: 'auto' }} />        
        Jos tulit sivulle <b>alavalikon kautta</b>, näytetään kaikki tuotteet. Tällöin uudelle tuotteelle
        ei anneta kategoriaa, mutta voit asettaa sen kynän kuvaa klikkaamalla.
        
      </p>
      <p>
        <img src={helpProductView1Image} alt="Tuotteet kategorioittan ja suosikit" style={{ maxWidth: '100%', height: 'auto' }} />        
        Asettamalla yläreunasta "Kategoriat" näkymään, tuotteet näytetään <b>kategorioittain</b> ja ylimpänä ne, 
        joille ei ole asetettu kategoriaa. Voit kutistaa ja laajentaa kategoioiden sisällön nuolipainikkeesta.
        Voit asettaa tuotteita <b>suosikeiksi</b> ja yläpalkin tähdestä suodattaa näkyviin vain suosikit.
      </p>
      <p>
        <img src={helpProductShopAmountImage} alt="Tuote ostoskoriin" style={{ maxWidth: '100%', height: 'auto' }} />        
        Klikkaamalla <b>ostoskorin</b> kuvaa voit asettaa tuotteen ostoslistalle tai pois sieltä.
        Asetuksista voi määritellä, haluatko avata määrädialogin automaattisesti kun tuote klikataan ostoskoriin 
        vai erikseen pitkällä klikkauksella. Määrää ei ole pakko antaa.
      </p>
      <p>
        <img src={helpProductDefineColorsImage} alt="Tuotteiden värikoodit" style={{ maxWidth: '100%', height: 'auto' }} />        
        Voit suodattaa tuotteita <b>väreittäin</b>. Menun asetuksista voi säätää, käytetäänkö tuotteilla värikoodeja.
        Halutessasi voit määritellä väreille merkitykset menun valikosta "Värien määrittely".
      </p>
      <p>
        <img src={helpProductFilterColorsImage} alt="Tuotteiden suodatus värikoodeilla" style={{ maxWidth: '100%', height: 'auto' }} />        
        Tuotteelle voit valita värit ja tuotesivun yläpalkin suodattimesta voi valita näkyviin haluamasi värit/värittömät
        ja poistaa valinnat klikkaamalla suodattimen kuvaa.
      </p>
      <p>
        <img src={helpProductDefineClassesImage} alt="Tuotteiden luokittelu" style={{ maxWidth: '100%', height: 'auto' }} />
        Voit antaa tuotteille <b>luokitustietoja</b>, esim proteiinit, hiilihydraatit jne, kun määrittelet luokat ensin asetuksista. 
        <img src={helpProductUseClassesImage} alt="Tuotteiden luokittelu" style={{ maxWidth: '100%', height: 'auto' }} />
        Niitä hyödynnetään päiväsuunnitelmien tekemisessä, mutta ne voidaan valita näkymään myös tuotelistauksessa, 
        johon voidaan määritellä näkymään myös tuotteelle asetettu annos.
      </p>
    </>
  ),
  shoppingList: (
    <>
      <b>Ostoslista</b>
      <p>
        Ostoslistalla näkyvät tuote-sivulla ostoskoriin valitsemasi tuotteet. 
        Voit antaa ostettavan <i>määrän</i> ja <i>yksikön</i> sekä <i>kokonaishinnan</i>.
        Asetuksista voit määritellä, näytetäänkö ne ostoslistalla.
        <img src={helpShoppinglistImage} alt="Ostoslista" style={{ maxWidth: '100%', height: 'auto' }} />
      </p>
      <p>
        Jos olet valinnut hinnat näkyviin, tuotteiden yhteenlasketut hinnat näytetään listan yläreunassa: valituille tuotteille / kaikille ostoslistan tuotteille.        
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
        Päivät sisältää <br />
        <i>suunnittelunäkymän</i> ja <i>toteutusnäkymän</i>. 
        <img src={helpDaysPlanImage} alt="Päivien suunnittelu" style={{ maxWidth: '100%', height: 'auto' }} />                 
        </p><p>
        Voit valita näkymään kaikki tai pelkästään <i>aktivoidut päivät</i>. (Aktivointi päälle tai pois klikkaamalla päivän nimen edessä olevaa painiketta.)
        <br />
        <img src={helpDaysPlanActiveImage} alt="Kaikki tai vain aktivoidut päivät" style={{ maxWidth: '100%', height: 'auto' }} />        
      </p><p>
        <b>Suunnittelunäkymä</b>
        <br />
        Suunnittelunäkymässä voit lisätä haluamasi määrän päiviä ja voit muuttaa niiden järjestystä raahaamalla. 
       <br />
        Näkymä on monitasoinen: <br />
        päivät - ateriat - tuoteluokat - tuotteet.
        <img src={helpDaysPlanProductsImage} alt="Tuotteiden määrittely ja valinta" style={{ maxWidth: '100%', height: 'auto' }} />                 
      </p><p>
        Lisäämäsi <b>päivän</b> kohdalla on kolme painiketta oikeassa laidassa. <i>Kynän</i> kuvasta pääset muokkaamaan päivän nimeä, valitsemaan sille värikoodin, ja lisäämään muistiinpanoja.
        <br />
        <i>Kopioi</i> kuvakkeesta päivä monistetaan ja nimen alkuun tulee "Kopio-" etuliite.
        <br />
        <i>Nuoli ylös/alas</i> laajentaa tai kutistaa päivän tiedot. Laajennetussa näkymässä pääset lisäämään päivälle aterioita.
        <img src={helpDaysPlanEditImage} alt="Päivän tietojen muokkaus ja kopiointi" style={{ maxWidth: '100%', height: 'auto' }} />                 
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
