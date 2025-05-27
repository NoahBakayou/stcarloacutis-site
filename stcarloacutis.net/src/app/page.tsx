"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "cesium/Build/Cesium/Widgets/widgets.css";

export default function Home() {
  useEffect(() => {
    let viewer: any;
    if (typeof window !== "undefined" && document.getElementById("cesiumContainer")) {
      // Dynamically import Cesium to avoid SSR issues
      import("cesium").then((Cesium) => {
        (window as any).CESIUM_BASE_URL = "/cesium";
        // Debug log to verify env variable is loaded
        console.log("Cesium token:", process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN);
        Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN as string;
        // Clean up previous viewer if any
        if ((window as any).__CESIUM_VIEWER__ && typeof (window as any).__CESIUM_VIEWER__.destroy === "function") {
          (window as any).__CESIUM_VIEWER__.destroy();
        }
        viewer = new Cesium.Viewer("cesiumContainer", {
          timeline: false,
          animation: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          navigationHelpButton: false,
          navigationInstructionsInitiallyVisible: false,
          fullscreenButton: false,
        });
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#f3f4f6");
        viewer.scene.skyBox.show = false;
        viewer.scene.skyAtmosphere.show = false;
        (window as any).__CESIUM_VIEWER__ = viewer;
        // Set initial camera view: more zoomed in on mobile, desktop unchanged
        if (window.innerWidth < 768) { // Tailwind's md breakpoint
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(-100, 40, 18000000), // slightly more zoomed out for mobile
          });
        } else {
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(-100, 40, 25000000), // desktop zoom
          });
        }
        // Remove the old California marker and add all provided miracles
        const miracles = [
          { name: "Buenos Aires", url: "https://www.miracolieucaristici.org/en/Liste/scheda_c.html?nat=argentina&wh=buenosaires&ct=Buenos%20Aires,%201992-1994-1996", lat: -34.6037, lng: -58.3816 },
          { name: "Fiecht", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=austria&wh=fiecht&ct=Fiecht,%201310", lat: 47.3367, lng: 11.5911 },
          { name: "Seefeld", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=austria&wh=seefeld&ct=Seefeld,%201384Weiten-Raxendorf, 1411", lat: 47.3306, lng: 11.1875 },
          { name: "Bois-Seigneur-Isaac", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=boisseigneurisaac&ct=Bois-Seigneur-Isaac,%201405", lat: 50.6686, lng: 4.3572 },
          { name: "Bruges", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=bruges&ct=Bruges,%201203", lat: 51.2093, lng: 3.2247 },
          { name: "Brussels", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=bruxelles&ct=Brussels,%201370", lat: 50.8503, lng: 4.3517 },
          { name: "Herentals", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=herentals&ct=Herentals,%201412", lat: 51.1762, lng: 4.8326 },
          { name: "Herkenrode-Hasselt", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=herkenrode&ct=Herkenrode-Hasselt,%201317", lat: 50.9481, lng: 5.3361 },
          { name: "Liège", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=liege&ct=Li%C3%A8ge,%201374", lat: 50.6326, lng: 5.5797 },
          { name: "Middleburg-Lovanio", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=belgio&wh=middleburg&ct=Middleburg-Lovanio,%201374", lat: 51.4986, lng: 3.6136 },
          { name: "Tumaco", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=colombia&wh=tumaco&ct=Tumaco,%201906", lat: 1.8081, lng: -78.7647 },
          { name: "Ludbreg", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=croazia&wh=ludbreg&ct=Ludbreg,%201411", lat: 46.2517, lng: 16.6197 },
          { name: "St. Mary of Egypt", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=egitto&wh=s_maria_egiziaca&ct=St.%20Mary%20of%20Egypt,%20IV-V%20cent.", lat: 30.0444, lng: 31.2357 },
          { name: "Scete", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=egitto&wh=scete&ct=Scete,%20III-V%20cent.", lat: 30.4000, lng: 30.3167 },
          { name: "Avignon", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=francia&wh=avignone&ct=Avignon,%201433", lat: 43.9493, lng: 4.8055 },
          { name: "Blanot", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=blanot&ct=Blanot,%201331", lat: 46.9781, lng: 4.4631 },
          { name: "Bordeaux", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=bordeaux&ct=Bordeaux,%201822", lat: 44.8378, lng: -0.5792 },
          { name: "Dijon", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=digione&ct=Dijon,%201430", lat: 47.3220, lng: 5.0415 },
          { name: "Douai", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=douai&ct=Douai,%201254", lat: 50.3670, lng: 3.0800 },
          { name: "Faverney", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=faverney&ct=Faverney,%201608", lat: 47.6981, lng: 5.9631 },
          { name: "La Rochelle", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=la_rochelle&ct=La%20Rochelle,%201461", lat: 46.1603, lng: -1.1511 },
          { name: "Neuvy Saint Sepulcre", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=la_rochelle&ct=Neuvy%20Saint%20Sepulcre,%201257", lat: 46.6872, lng: 1.8106 },
          { name: "Les Ulmes", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=les_ulmes&ct=Les%20Ulmes,%201668", lat: 47.2000, lng: -0.2333 },
          { name: "Marseille-En-Beauvais", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=marseille-en-beauvais&ct=Marseille-En-Beauvais,%201533", lat: 43.2965, lng: 5.3698 },
          { name: "Paris", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=francia&wh=parigi&ct=Paris,%201290", lat: 48.8566, lng: 2.3522 },
          { name: "Pressac", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=francia&wh=pressac&ct=Pressac,%201643", lat: 46.1833, lng: 0.7000 },
          { name: "Augsburg", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=augsburg&ct=Augsburg,%201194", lat: 48.3668, lng: 10.8985 },
          { name: "Benningen", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=benningen&ct=Benningen,%201216", lat: 48.1500, lng: 9.8833 },
          { name: "Bettbrunn", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=bettbrunn&ct=Bettbrunn,%201125", lat: 48.8333, lng: 11.7167 },
          { name: "Erding", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=erding&ct=Erding,%201417", lat: 48.3064, lng: 11.9069 },
          { name: "Kranenburg", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=kranenburg_bei_kleve&ct=Kranenburg,%201280", lat: 51.7922, lng: 6.0247 },
          { name: "Regensburg", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=regensburg&ct=Regensburg,%201255", lat: 49.0134, lng: 12.1016 },
          { name: "Walldürn", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=walldurn&ct=Walld%C3%BCrn,%201330", lat: 49.5850, lng: 9.3661 },
          { name: "Weingarten", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=germania&wh=weingarten&ct=Weingarten", lat: 47.8106, lng: 9.6381 },
          { name: "Wilsnack", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=germania&wh=wilsnack&ct=Wilsnack,%201383", lat: 53.0081, lng: 11.9461 },
          { name: "Chirattakonam", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=india&wh=chirattakonam&ct=Chirattakonam,%202001", lat: 9.0667, lng: 76.7167 },
          { name: "Morne-Rouge", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=isole_della_martinica&wh=morne-rouge&ct=Morne-Rouge,%201902", lat: 14.8000, lng: -61.1167 },
          { name: "Saint-André de la Réunion", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=isole_della_reunion&wh=saint-andre_de_la_reunion&ct=Saint-Andr%C3%A9%20de%20la%20R%C3%A9union,%201902", lat: -20.9633, lng: 55.6500 },
          { name: "Alatri", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=alatri&ct=Alatri,%201228", lat: 41.7300, lng: 13.3422 },
          { name: "Saint Clare of Assisi", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=santachiaradassisi&ct=Saint%20Clare%20of%20Assisi,%201240", lat: 43.0707, lng: 12.6176 },
          { name: "Asti", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=italia&wh=asti&ct=Asti,%201535", lat: 44.9000, lng: 8.2064 },
          { name: "Bagno di Romagna", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=bagnodiromagna&ct=Bagno%20di%20Romagna,%201412", lat: 43.8192, lng: 11.9781 },
          { name: "Bolsena", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=italia&wh=bolsena&ct=Bolsena,%201264", lat: 42.6367, lng: 12.0117 },
          { name: "Canosio", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=canosio&ct=Canosio,%201630", lat: 44.4333, lng: 7.0833 },
          { name: "Cascia", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=cascia&ct=Cascia,%201330", lat: 42.7167, lng: 13.0167 },
          { name: "Cava dei Tirreni", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=cavadeitirreni&ct=Cava%20dei%20Tirreni,%201656", lat: 40.7000, lng: 14.7000 },
          { name: "Dronero", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=dronero&ct=Dronero,%201631", lat: 44.4667, lng: 7.3500 },
          { name: "San Mauro La Bruca", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=dronero&ct=San%20Mauro%20La%20Bruca,%201969", lat: 40.1333, lng: 15.3167 },
          { name: "Ferrara", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=ferrara&ct=Ferrara,%201171", lat: 44.8350, lng: 11.6198 },
          { name: "Florence", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=italia&wh=firenze&ct=Florence,%201230-1595", lat: 43.7696, lng: 11.2558 },
          { name: "Gruaro (Valvasone)", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=gruaro&ct=Gruaro%20(Valvasone),%201294", lat: 45.8167, lng: 12.8167 },
          { name: "Lanciano", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=italia&wh=lanciano&ct=Lanciano,%20750%20D.C.", lat: 42.2261, lng: 14.3913 },
          { name: "Macerata", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=macerata&ct=Macerata,%201356", lat: 43.3001, lng: 13.4536 },
          { name: "Mogoro", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=mogoro&ct=Mogoro,%201604", lat: 39.7000, lng: 8.7333 },
          { name: "Morrovalle", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=morrovalle&ct=Morrovalle,%201560", lat: 43.3167, lng: 13.5667 },
          { name: "Offida", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=offida&ct=Offida,%201273-1280", lat: 42.9342, lng: 13.6872 },
          { name: "Patierno (Naples)", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=patierno&ct=Patierno%20(Naples),%201772", lat: 40.9000, lng: 14.3167 },
          { name: "Rimini", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=rimini&ct=Rimini,%201227", lat: 44.0678, lng: 12.5695 },
          { name: "Rome, VI-VII cent.", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=italia&wh=romaa&ct=Rome,%20VI-VII%20cent.", lat: 41.9028, lng: 12.4964 },
          { name: "Rome, 1610", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=romab&ct=Rome,%201610", lat: 41.9028, lng: 12.4964 },
          { name: "Rosano", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=rosano&ct=Rosano,%201948", lat: 43.7833, lng: 11.4167 },
          { name: "S. Peter Damian, XI cent.", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=sanpierdamiani&ct=S.%20Peter%20Damian,%20XI%20cent.", lat: 44.2000, lng: 12.1000 },
          { name: "Salzano", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=salzano&ct=Salzano,%201517", lat: 45.5333, lng: 12.1167 },
          { name: "Scala", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=sanpierdamiani&ct=Scala,%201732", lat: 40.6500, lng: 14.5667 },
          { name: "Siena", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=caterinadasiena&ct=Siena,%201730", lat: 43.3188, lng: 11.3308 },
          { name: "Trani, XI sec.", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=trani&ct=Trani,%20XI%20sec.", lat: 41.2779, lng: 16.4100 },
          { name: "Turin, 1453", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=italia&wh=torinoa&ct=Turin,%201453", lat: 45.0703, lng: 7.6869 },
          { name: "Turin, 1640", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=torinob&ct=Turin,%201640", lat: 45.0703, lng: 7.6869 },
          { name: "Veroli", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=veroli&ct=Veroli,%201570", lat: 41.6922, lng: 13.4131 },
          { name: "Volterra", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=italia&wh=volterra&ct=Volterra,%201472", lat: 43.4022, lng: 10.8611 },
          { name: "Tixtla", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=messico&wh=tixtla&ct=Tixtla,%202006", lat: 17.5636, lng: -99.3922 },
          { name: "Alkmaar", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=alkmaar&ct=Alkmaar,%201429", lat: 52.6324, lng: 4.7534 },
          { name: "Amsterdam", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=olanda&wh=amsterdam&ct=Amsterdam,%201345", lat: 52.3676, lng: 4.9041 },
          { name: "Bergen", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=bergen&ct=Bergen,%201421", lat: 52.6700, lng: 4.7000 },
          { name: "Boxmeer", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=boxmeer&ct=Boxmeer,%201400", lat: 51.6467, lng: 5.9472 },
          { name: "Boxtel-Hoogstraten", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=boxtel-hoogstraten&ct=Boxtel-Hoogstraten,%201380", lat: 51.5900, lng: 5.3200 },
          { name: "Breda-Niervaart", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=breda-niervaart&ct=Breda-Niervaart,%201300", lat: 51.5719, lng: 4.7683 },
          { name: "Meerssen", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=meerssen&ct=Meerssen,%201222-1465", lat: 50.8833, lng: 5.7500 },
          { name: "Stiphout", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=olanda&wh=stiphout&ct=Stiphout,%201342", lat: 51.4833, lng: 5.6500 },
          { name: "Eten", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=peru&wh=eten&ct=Eten,%201649", lat: -6.2333, lng: -79.8333 },
          { name: "Krakow", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=polonia&wh=cracovia&ct=Krakow,%201345", lat: 50.0647, lng: 19.9450 },
          { name: "Glotowo", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=polonia&wh=glotowo&ct=Glotowo,%201290", lat: 54.0000, lng: 20.2833 },
          { name: "Legnica", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=polonia&wh=legnica&ct=Legnica,%202013", lat: 51.2100, lng: 16.1619 },
          { name: "Poznan", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=polonia&wh=poznan&ct=Poznan,%201399", lat: 52.4064, lng: 16.9252 },
          { name: "Sokółka", url: "https://www.miracolieucaristici.org/en/Liste/scheda_c.html?nat=polonia&wh=sokolka&ct=Sok%C3%B3%C5%82ka%202008", lat: 53.4081, lng: 23.5042 },
          { name: "Santarém", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=portogallo&wh=santarem&ct=Santar%C3%A9m,%201247", lat: 39.2362, lng: -8.6866 },
          { name: "Alboraya-Almacéra", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=spagna&wh=alboraya-almacera&ct=Alboraya-Almac%C3%A9ra,%201348", lat: 39.5167, lng: -0.3667 },
          { name: "Alcalà", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=alcala&ct=Alcal%C3%A0,%201597", lat: 40.4818, lng: -3.3645 },
          { name: "Alcoy", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=alcoy&ct=Alcoy,%201568", lat: 38.6986, lng: -0.4736 },
          { name: "Caravaca de la Cruz", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=caravaca_de_la_cruz&ct=Caravaca%20de%20la%20Cruz,%201231", lat: 38.1056, lng: -1.8647 },
          { name: "Cimballa", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=cimballa&ct=Cimballa,%201370", lat: 41.1167, lng: -1.8667 },
          { name: "Daroca", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=spagna&wh=daroca&ct=Daroca,%201239", lat: 41.1131, lng: -1.4131 },
          { name: "Gerona", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=gerona&ct=Gerona,%201297", lat: 41.9831, lng: 2.8249 },
          { name: "Gorkum-El Escorial", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=gorkum-el_escorial&ct=Gorkum-El%20Escorial,%201572", lat: 40.5896, lng: -4.1477 },
          { name: "Guadalupe", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=guadalupe&ct=Guadalupe,%201420", lat: 39.4522, lng: -6.1106 },
          { name: "Ivorra", url: "https://www.miracolieucaristici.org/en/Liste/scheda_c.html?nat=spagna&wh=ivorra&ct=Ivorra,%201010", lat: 41.7833, lng: 1.3667 },
          { name: "Moncada", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=moncada&ct=Moncada,%201392", lat: 39.5333, lng: -0.3833 },
          { name: "Montserrat", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=montserrat&ct=Montserrat,%201657", lat: 41.5956, lng: 1.8333 },
          { name: "O'Cebreiro", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=ocebreiro&ct=O%27Cebreiro,%201300", lat: 42.7083, lng: -7.0406 },
          { name: "Onil", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=spagna&wh=onil&ct=Onil,%201824", lat: 38.6292, lng: -0.6681 },
          { name: "Ponferrada", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=ponferrada&ct=Ponferrada,%201533", lat: 42.5461, lng: -6.5961 },
          { name: "S. John of the Abbesses", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=s_j_de_las_abadeses&ct=S.%20John%20of%20the%20Abbesses,%201251", lat: 42.2422, lng: 2.3647 },
          { name: "Silla", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=silla&ct=Silla,%201907", lat: 39.3667, lng: -0.4167 },
          { name: "Valencia", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=spagna&wh=valencia&ct=Valencia", lat: 39.4699, lng: -0.3763 },
          { name: "Zaragoza", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=spagna&wh=zaragoza&ct=Zaragoza,%201427", lat: 41.6488, lng: -0.8891 },
          { name: "Ettiswil", url: "https://www.miracolieucaristici.org/en/Liste/scheda_b.html?nat=svizzera&wh=ettiswil&ct=Ettiswil,%201447", lat: 47.1500, lng: 8.0167 },
          { name: "Betania", url: "https://www.miracolieucaristici.org/en/Liste/scheda.html?nat=venezuela&wh=betania&ct=Betania,%201991", lat: 10.0833, lng: -65.4333 },
        ];
        const entityUrlMap = new Map();
        miracles.forEach((miracle) => {
          const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(miracle.lng, miracle.lat),
            billboard: {
              image: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg',
              width: 32,
              height: 32,
            },
            name: miracle.name,
            description: miracle.name,
          });
          entityUrlMap.set(entity, miracle.url);
        });
        // Register the click handler ONCE
        viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: any) {
          const pickedObject = viewer.scene.pick(movement.position);
          if (pickedObject && entityUrlMap.has(pickedObject.id)) {
            window.open(entityUrlMap.get(pickedObject.id), '_blank');
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      });
    }
    return () => {
      if (viewer && typeof viewer.destroy === "function") {
        viewer.destroy();
        (window as any).__CESIUM_VIEWER__ = null;
      }
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center bg-white text-black p-0">
      {/* Hero Section - collage/banner */}
      <section className="w-full flex flex-col items-center justify-center pt-10 pb-4 bg-white relative">
        {/* Mobile: auto-scroll, edge-to-edge */}
        <div className="w-screen overflow-hidden md:hidden" style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}>
          {(() => {
            const heroImages = [
              { src: "/carlo1.jpg", alt: "Carlo Acutis 1" },
              { src: "/carlo2.jpg", alt: "Carlo Acutis 2" },
              { src: "/carlo3.jpg", alt: "Carlo Acutis 3" },
              { src: "/carlo4.jpg", alt: "Carlo Acutis 4" },
            ];
            const [currentHero, setCurrentHero] = useState(0);
            useEffect(() => {
              const interval = setInterval(() => {
                setCurrentHero((prev) => (prev + 1) % heroImages.length);
              }, 3500); // 3.5 seconds per image
              return () => clearInterval(interval);
            }, []);
            return (
              <div className="flex transition-transform duration-[1800ms] ease-in-out" style={{ transform: `translateX(-${currentHero * 100}vw)` }}>
                {heroImages.map((img) => (
                  <div key={img.src} className="min-w-screen w-screen flex-shrink-0 flex justify-center">
                    <Image src={img.src} alt={img.alt} width={231} height={336} className="rounded-xl shadow-md object-cover w-auto h-[336px] mx-auto" />
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
        {/* Desktop: static collage */}
        <div className="hidden md:flex gap-4 w-full max-w-5xl mx-auto overflow-x-auto">
          <Image src="/carlo1.jpg" alt="Carlo Acutis" width={231} height={336} className="rounded-xl shadow-md object-cover" />
          <Image src="/carlo2.jpg" alt="Carlo Acutis" width={231} height={336} className="rounded-xl shadow-md object-cover" />
          <Image src="/carlo3.jpg" alt="Carlo Acutis" width={231} height={336} className="rounded-xl shadow-md object-cover" />
          <Image src="/carlo4.jpg" alt="Carlo Acutis" width={231} height={336} className="rounded-xl shadow-md object-cover" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Quote Section */}
      <section className="w-full flex flex-col items-center py-1 px-4 bg-white">
        <blockquote className="text-xl md:text-2xl font-serif italic text-center text-blue-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          "The Eucharist is my highway to heaven."
        </blockquote>
      </section>

      {/* Bio Section with bullet points and video */}
      <section className="w-full flex flex-col items-center py-6 px-4 bg-white">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Mobile: Only show the YouTube Short with caption */}
          <div className="flex-1 max-w-2xl flex flex-col justify-center">
            <div className="block md:hidden w-full max-w-xs mx-auto mt-4">
              <div className="aspect-[9/16] bg-gray-100 border border-gray-200 flex items-center justify-center rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/oR3-6_ZVbH8"
                  title="Carlo Acutis YouTube Short"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-xl"
                ></iframe>
              </div>
              <div className="text-center text-gray-500 text-sm mt-2">Tap to play video.</div>
            </div>
            {/* Desktop: show the bio bullet points */}
            <ul className="hidden md:block text-base md:text-lg leading-relaxed text-gray-800 space-y-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <li><span className="font-semibold">St. Carlo Acutis (1991–2006):</span> Teenage computer genius from Milan, Italy.</li>
              <li>Known for his big smile, kindness, and sense of humor.</li>
              <li>Loved the Eucharist, soccer, video games, and animals.</li>
              <li>Built a website at 14 cataloging Eucharistic miracles worldwide.</li>
              <li>Helped classmates, stood up for bullied students, and volunteered for charities.</li>
              <li>Went to Mass daily, prayed the rosary, and gave to the poor.</li>
              <li>Lived with joy, purpose, and a contagious love for God.</li>
              <li>Died of leukemia at age 15; buried in his favorite Nike sneakers and jeans.</li>
              <li><span className="font-semibold">Beatified:</span> October 10, 2020, after a Brazilian boy with a rare pancreatic disorder was healed through Carlo's intercession.</li>
              <li><span className="font-semibold">Second miracle (2022):</span> A Costa Rican girl recovered from a severe head injury after her mother prayed at Carlo's tomb.</li>
              <li><span className="font-semibold">Canonization:</span> Scheduled for 2025—Carlo will become the Catholic Church's first millennial saint.</li>
            </ul>
          </div>
          {/* On desktop, show the video next to the bio */}
          <div className="hidden md:flex flex-1 w-full max-w-[280px] aspect-[9/16] bg-gray-100 border border-gray-200 items-center justify-center rounded-xl overflow-hidden ml-[-10px]">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/oR3-6_ZVbH8"
              title="Carlo Acutis YouTube Short"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CesiumJS Globe Section */}
      <section className="w-full flex flex-col items-center py-10 px-4 border-b border-gray-100">
        <h2 className="hidden sm:block text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Eucharistic Miracles Around the World</h2>
        {/* Desktop: two-line instructions */}
        <div className="hidden sm:block text-center mb-4">
          <div className="text-gray-700">Each marker shows the location of a Eucharistic miracle. Click a marker to open St. Carlo's website and explore details about that miracle.</div>
          <div className="mt-1 text-sm text-gray-500">Scroll to zoom. Click and drag to rotate.</div>
        </div>
        {/* Mobile: single-line instructions */}
        <div className="block sm:hidden text-center mb-4">
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Eucharistic Miracles Worldwide</h2>
          <div className="text-gray-600 text-base mb-2">Carlo Acutis built a website to share Eucharistic miracles. Tap a marker to open his site.</div>
        </div>
        <div className="w-full max-w-5xl h-56 md:h-96 bg-gray-100 border border-gray-200 flex items-center justify-center mb-4 rounded-xl overflow-hidden">
          <div id="cesiumContainer" className="w-full h-full rounded-xl" style={{ minHeight: 224 }}></div>
        </div>
      </section>

      {/* Prayer Intentions Section */}
      <section className="w-full flex flex-col items-center py-10 px-4">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Prayer Intentions</h2>
        <div className="flex flex-col md:flex-row items-start justify-center gap-1 w-full">
          <div className="max-w-lg min-w-[400px] w-full ml-[-4]">
            <form className="w-full max-w-md flex flex-col gap-4 bg-gray-50 border border-gray-200 p-6" style={{ borderRadius: 12 }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name (optional)"
                className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none"
                autoComplete="off"
              />
              <textarea
                name="intention"
                placeholder="Your prayer intention"
                required
                className="px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-200 outline-none min-h-[124px]"
              ></textarea>
              <button type="submit" className="px-8 py-2 bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" style={{ borderRadius: 0 }}>
                Submit Intention
              </button>
            </form>
          </div>
          <div className="max-w-lg min-w-[400px] w-full mr-[-4] aspect-video bg-gray-100 border border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full text-center text-gray-600 text-sm font-medium mb-2">Live Stream of St Carlo Acutis' Tomb</div>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/k0_3FFmsWwc?autoplay=1&mute=1"
              title="Live Stream Carlo Acutis Tomb"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-xl"
            ></iframe>
          </div>
        </div>
      </section>
      </main>
  );
}
