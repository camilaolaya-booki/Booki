
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import PeruMap from './components/PeruMap';
import ExerciseGame from './components/ExerciseGame';
import ChatBot from './components/ChatBot';
import { UserState, World, City, ExerciseType } from './types';
import { WORLD_NAMES, EXERCISE_LABELS } from './constants';
import { generateStorySynopsis, generateStoryIllustration } from './services/geminiService';
import { sounds } from './services/soundService';

const App: React.FC = () => {
  const [activeWorld, setActiveWorld] = useState<World>('CAMINO_LECTOR');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [showResult, setShowResult] = useState<{ score: number, coins: number } | null>(null);
  const [showAdaptivePrompt, setShowAdaptivePrompt] = useState<ExerciseType | null>(null);
  
  // Story Preview State
  const [storyPreview, setStoryPreview] = useState<{
    name: string;
    synopsis: string;
    illustration: string | null;
    price?: number;
    isOwned: boolean;
    loading: boolean;
  } | null>(null);

  const [userState, setUserState] = useState<UserState>({
    coins: 50,
    completedStories: 0,
    unlockedWorlds: ['CAMINO_LECTOR'],
    inventory: [],
    performance: {
      ELIGE_LA_PALABRA: 0,
      HALLA_EL_PROPOSITO: 0,
      RETO_SORPRESA: 0
    }
  });

  useEffect(() => {
    if (userState.completedStories >= 3 && !userState.unlockedWorlds.includes('LEYENDOPOLIS')) {
      setUserState(prev => ({
        ...prev,
        unlockedWorlds: [...prev.unlockedWorlds, 'LEYENDOPOLIS']
      }));
      sounds.playUnlock();
    }
    if (userState.coins >= 200 && !userState.unlockedWorlds.includes('CUENTOPIA')) {
        setUserState(prev => ({
          ...prev,
          unlockedWorlds: [...prev.unlockedWorlds, 'CUENTOPIA']
        }));
        sounds.playUnlock();
    }
  }, [userState.completedStories, userState.coins, userState.unlockedWorlds]);

  const handleCitySelect = (city: City) => {
    sounds.playClick();
    setSelectedCity(city);
    setSelectedExercise(null);
  };

  const handleExerciseStart = (type: ExerciseType) => {
    sounds.playClick();
    setSelectedExercise(type);
    setShowResult(null);
  };

  const handleGameFinish = (score: number, coins: number) => {
    setShowResult({ score, coins });
    if (coins > 0) sounds.playCoin();
    
    if (selectedExercise) {
        setUserState(prev => ({
            ...prev,
            coins: prev.coins + coins,
            completedStories: prev.completedStories + 1,
            performance: {
                ...prev.performance,
                [selectedExercise]: prev.performance[selectedExercise] + (score >= 3 ? 1 : -1)
            }
        }));

        if (score < 3) {
            setShowAdaptivePrompt(selectedExercise);
        }
    }
  };

  const openStoryPreview = async (name: string, price?: number, isOwned: boolean = false) => {
    sounds.playClick();
    setStoryPreview({ name, synopsis: '', illustration: null, price, isOwned, loading: true });
    
    try {
      const synopsis = await generateStorySynopsis(name);
      const illustration = await generateStoryIllustration(name);
      setStoryPreview(prev => prev ? { ...prev, synopsis, illustration, loading: false } : null);
    } catch (error) {
      setStoryPreview(prev => prev ? { ...prev, synopsis: '¡Librito se quedó sin palabras! Es una historia maravillosa.', loading: false } : null);
    }
  };

  const handleBuyStory = () => {
    if (storyPreview && storyPreview.price && userState.coins >= storyPreview.price) {
      sounds.playCoin();
      setUserState(prev => ({
        ...prev,
        coins: prev.coins - (storyPreview.price || 0),
        inventory: [...prev.inventory, storyPreview.name]
      }));
      setStoryPreview(prev => prev ? { ...prev, isOwned: true } : null);
    } else {
      sounds.playError();
    }
  };

  const resetSelection = () => {
    sounds.playClick();
    setSelectedCity(null);
    setSelectedExercise(null);
    setShowResult(null);
    setStoryPreview(null);
  };

  const handleNavigation = (w: World) => {
    sounds.playClick();
    setActiveWorld(w);
    setSelectedCity(null);
    setSelectedExercise(null);
  }

  const renderCaminoLector = () => {
    if (showResult && selectedCity && selectedExercise) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-green-50">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl font-bold text-green-700 mb-2">¡Felicitaciones!</h2>
          <p className="text-xl text-gray-600 mb-8">Has completado el ejercicio en {selectedCity.name}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <span className="block text-sm font-bold text-gray-400 uppercase">Puntos</span>
              <span className="text-3xl font-bold text-green-500">{showResult.score}</span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <span className="block text-sm font-bold text-gray-400 uppercase">Monedas</span>
              <span className="text-3xl font-bold text-yellow-500">+{showResult.coins} 🪙</span>
            </div>
          </div>

          {showAdaptivePrompt && (
            <div className="bg-orange-100 border-2 border-orange-200 p-6 rounded-3xl mb-8 max-w-md">
              <p className="text-orange-800 font-medium text-lg">
                ¡Librito notó que este reto fue difícil! ¿Te gustaría practicar "{EXERCISE_LABELS[showAdaptivePrompt]}" una vez más para volverte un experto?
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <button 
                    onClick={() => {
                        setShowAdaptivePrompt(null);
                        handleExerciseStart(showAdaptivePrompt);
                    }}
                    className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-orange-600"
                >
                    ¡Sí, practicar!
                </button>
                <button 
                    onClick={() => {
                      sounds.playClick();
                      setShowAdaptivePrompt(null);
                    }}
                    className="bg-white text-gray-600 px-6 py-2 rounded-full font-bold border-2 border-gray-100 hover:bg-gray-50"
                >
                    Ahora no
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
             <button 
                onClick={() => {
                    sounds.playClick();
                    setShowResult(null);
                    setSelectedExercise(null);
                }}
                className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-600 transition-all"
             >
                Elegir otro reto
             </button>
             <button 
                onClick={resetSelection}
                className="bg-white text-green-600 px-8 py-3 rounded-2xl font-bold text-lg border-2 border-green-200 hover:bg-green-50 transition-all"
             >
                Volver al Mapa
             </button>
          </div>
        </div>
      );
    }

    if (selectedExercise && selectedCity) {
      return (
        <ExerciseGame 
          city={selectedCity} 
          type={selectedExercise} 
          onFinish={handleGameFinish}
          onBack={() => {
            sounds.playClick();
            setSelectedExercise(null);
          }}
        />
      );
    }

    if (selectedCity) {
      return (
        <div className="h-full flex flex-col p-8 bg-blue-50 overflow-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { sounds.playClick(); setSelectedCity(null); }} className="text-blue-500 text-2xl font-black">← VOLVER</button>
            <h2 className="text-4xl font-bold text-blue-900 uppercase tracking-tighter">{selectedCity.name}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
            {(['ELIGE_LA_PALABRA', 'HALLA_EL_PROPOSITO', 'RETO_SORPRESA'] as ExerciseType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleExerciseStart(type)}
                className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-white hover:border-blue-400 hover:scale-105 transition-all group text-left flex flex-col"
              >
                <div className={`w-16 h-16 rounded-3xl mb-6 flex items-center justify-center text-3xl shadow-inner ${
                  type === 'ELIGE_LA_PALABRA' ? 'bg-orange-100' : type === 'HALLA_EL_PROPOSITO' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {type === 'ELIGE_LA_PALABRA' ? '✏️' : type === 'HALLA_EL_PROPOSITO' ? '🎯' : '🎁'}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{EXERCISE_LABELS[type]}</h3>
                <p className="text-gray-500 text-sm flex-1">
                  Practica tu comprensión lectora con textos sobre la cultura de {selectedCity.name}.
                </p>
                <div className="mt-6 flex items-center text-blue-500 font-bold group-hover:translate-x-2 transition-transform">
                  Jugar ahora ➔
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 bg-blue-600/10 p-8 rounded-3xl border-2 border-dashed border-blue-200 text-center">
             <h4 className="text-xl font-bold text-blue-800 mb-2">Reto Final: {selectedCity.legend}</h4>
             <p className="text-blue-700 opacity-70">Completa los 3 ejercicios anteriores para desbloquear esta leyenda peruana y ganarla para tu Leyendópolis.</p>
             <div className="mt-4 text-4xl grayscale opacity-30">📜</div>
          </div>
        </div>
      );
    }

    return <PeruMap onCitySelect={handleCitySelect} />;
  };

  const renderLeyendopolis = () => (
    <div className="p-8 h-full bg-emerald-50 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-emerald-900 mb-2">Leyendópolis</h2>
        <p className="text-emerald-700 mb-10">Tus leyendas ganadas y misterios del Perú.</p>
        
        {userState.completedStories < 3 ? (
            <div className="bg-white p-12 rounded-[50px] shadow-lg text-center border-4 border-white">
                <span className="text-8xl mb-6 block">🔒</span>
                <h3 className="text-2xl font-bold text-gray-800">Mundo Bloqueado</h3>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                    Debes completar al menos 3 historias en el Camino Lector para desbloquear este mundo lleno de magia peruana.
                </p>
                <div className="mt-8 h-4 w-64 bg-gray-100 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(userState.completedStories / 3) * 100}%` }}></div>
                </div>
                <p className="text-sm font-bold mt-2 text-emerald-600">{userState.completedStories}/3 Historias</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Manco Cápac y Mama Ocllo', 'El Bufeo Colorado', 'La Achiqué', 'Pachacútec', 'Misti Protector'].map((legend, i) => (
                    <div 
                      key={i} 
                      onClick={() => openStoryPreview(legend, undefined, true)}
                      className="bg-white p-6 rounded-3xl shadow-sm border-2 border-emerald-100 hover:scale-105 hover:border-emerald-400 transition-all cursor-pointer group"
                    >
                        <div className="aspect-video rounded-2xl bg-emerald-50 mb-4 overflow-hidden relative">
                            <img src={`https://picsum.photos/seed/legend${i}/400/250`} alt={legend} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/20 transition-colors flex items-center justify-center">
                              <span className="bg-white text-emerald-600 px-4 py-2 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">Mirar</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-1">{legend}</h3>
                        <p className="text-emerald-600 text-sm">Leyenda Peruana</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );

  const renderCuentopia = () => (
    <div className="p-8 h-full bg-purple-50 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-purple-900 mb-2">Cuentopía</h2>
        <p className="text-purple-700 mb-10">Cuentos clásicos de todo el mundo.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Caperucita Roja', 'El Gato con Botas', 'Blancanieves', 'Pinocho', 'Aladino', 'La Cenicienta'].map((story, i) => {
                const isOwned = userState.inventory.includes(story);
                return (
                    <div 
                      key={i} 
                      onClick={() => openStoryPreview(story, 50, isOwned)}
                      className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col border-2 border-purple-100 group cursor-pointer hover:border-purple-400 transition-all"
                    >
                        <div className="aspect-[3/4] bg-purple-100 relative">
                            <img src={`https://picsum.photos/seed/tale${i}/300/400`} alt={story} className={`w-full h-full object-cover transition-all ${!isOwned ? 'grayscale opacity-50 blur-[2px]' : ''}`} />
                            {!isOwned && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                        <span>🪙</span> 50
                                    </div>
                                </div>
                            )}
                            {isOwned && (
                              <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                ✅
                              </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <h3 className="font-bold text-purple-900">{story}</h3>
                            <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">{isOwned ? 'Ya es tuyo' : 'Por comprar'}</p>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );

  const renderStoryPreviewModal = () => {
    if (!storyPreview) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => { sounds.playClick(); setStoryPreview(null); }}
        />
        <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border-8 border-white animate-float">
          <button 
            onClick={() => { sounds.playClick(); setStoryPreview(null); }}
            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold hover:bg-gray-200 transition-colors z-10"
          >
            ✕
          </button>
          
          <div className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto">
            <div className="md:w-1/2 bg-gray-50 aspect-square">
              {storyPreview.loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-orange-500 animate-pulse">Librito está dibujando...</p>
                </div>
              ) : storyPreview.illustration ? (
                <img src={storyPreview.illustration} alt={storyPreview.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-8xl">
                  📖
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 p-8 flex flex-col">
              <h2 className="text-3xl font-black text-gray-800 mb-4">{storyPreview.name}</h2>
              
              <div className="flex-1">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Sobre esta historia</h4>
                {storyPreview.loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-lg text-gray-600 leading-relaxed italic">
                    "{storyPreview.synopsis}"
                  </p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                {storyPreview.isOwned ? (
                  <button 
                    onClick={() => sounds.playClick()}
                    className="w-full bg-green-500 text-white py-4 rounded-3xl font-black text-xl shadow-lg hover:bg-green-600 transition-all active:scale-95"
                  >
                    ¡LEER AHORA! 📖
                  </button>
                ) : (
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                       <span className="text-gray-400 font-bold uppercase text-xs">Precio</span>
                       <div className="flex items-center gap-2 text-2xl font-black text-yellow-600">
                         <span>🪙</span> {storyPreview.price}
                       </div>
                    </div>
                    <button 
                      onClick={handleBuyStory}
                      disabled={userState.coins < (storyPreview.price || 0)}
                      className="w-full bg-orange-500 text-white py-4 rounded-3xl font-black text-xl shadow-lg hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-95"
                    >
                      {userState.coins < (storyPreview.price || 0) ? 'FALTAN MONEDAS' : 'COMPRAR CUENTO'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout 
        userState={userState} 
        activeWorld={activeWorld} 
        onNavigate={handleNavigation}
    >
      <div className="h-full">
        {activeWorld === 'CAMINO_LECTOR' && renderCaminoLector()}
        {activeWorld === 'LEYENDOPOLIS' && renderLeyendopolis()}
        {activeWorld === 'CUENTOPIA' && renderCuentopia()}
      </div>

      {renderStoryPreviewModal()}

      <ChatBot currentContext={`El usuario está en ${activeWorld}${selectedCity ? ` visitando ${selectedCity.name}` : ''}`} />
    </Layout>
  );
};

export default App;
