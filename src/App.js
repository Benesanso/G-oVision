import React, { useEffect } from 'react';
import FontFaceObserver from 'fontfaceobserver'; // Importation de FontFaceObserver
import Map from './Map';
import './App.css'; // Assurez-vous d'importer le fichier CSS

function App() {
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Création des observateurs de polices pour chaque police que vous souhaitez charger
        const lobsterTwoBoldObserver = new FontFaceObserver('Lobster Two Bold');
        const lobsterTwoBoldItalicObserver = new FontFaceObserver('Lobster Two Bold Italic');
        const lobsterTwoItalicObserver = new FontFaceObserver('Lobster Two Italic');
        const lobsterTwoObserver = new FontFaceObserver('Lobster Two');
        const mrDeHavilandObserver = new FontFaceObserver('Mr De Haviland Regular');

        // Chargement de chaque police
        await Promise.all([
          lobsterTwoBoldObserver.load(),
          lobsterTwoBoldItalicObserver.load(),
          lobsterTwoItalicObserver.load(),
          lobsterTwoObserver.load(),
          mrDeHavilandObserver.load()
        ]);

        // Ajout de la classe 'my-custom-font-loaded' à la balise <html> lorsque toutes les polices sont chargées
        document.documentElement.classList.add('my-custom-font-loaded');
      } catch (error) {
        console.error('Failed to load fonts:', error);
      }
    };

    loadFonts();
  }, []);

  return (
    <div className="App">
      <div className="header">
        <img src="/GéoVision.png" alt="Logo" className="logo" /> 
      <div className="title">
        <h1>GéoVision,</h1>
        <p>pour explorer le monde</p>
      </div>
    </div>
      <Map />
    </div>
  );
}

export default App;
