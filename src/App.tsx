import React, { useState, useEffect } from 'react';
import { Trip, StopItem, ExpenseItem, PackingItem } from './types/travel';
import { DEFAULT_TRIPS } from './data/defaultTrips';
import { Header, NavTab } from './components/Header';
import { ComicStatsGrid } from './components/ComicStatsGrid';
import { StoryboardView } from './components/StoryboardView';
import { PastelMapView } from './components/PastelMapView';
import { MiniZineView } from './components/MiniZineView';
import { BudgetView } from './components/BudgetView';
import { PackingView } from './components/PackingView';
import { StopModal } from './components/StopModal';
import { TripSwitcherModal } from './components/TripSwitcherModal';
import { RealTimePlaceModal } from './components/RealTimePlaceModal';
import { SearchItineraryGeneratorModal } from './components/SearchItineraryGeneratorModal';
import { LandingPageView } from './components/LandingPageView';

const STORAGE_KEY = 'pastel_zine_safar_trips_v3';
const ACTIVE_TRIP_KEY = 'pastel_zine_safar_active_trip_v3';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load trips from storage', e);
    }
    // Default settings removed: start fresh on landing page
    return [];
  });

  const [activeTripId, setActiveTripId] = useState<string | null>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_TRIP_KEY);
      if (savedId) {
        return savedId;
      }
    } catch (e) {
      console.error('Failed to load active trip ID', e);
    }
    return null;
  });

  // Controls whether the initial Landing Page is shown
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<NavTab>('storyboard');
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<StopItem | null>(null);
  const [isTripSwitcherOpen, setIsTripSwitcherOpen] = useState(false);

  // Real-Time Place View & Google Search Generator modals
  const [realTimePlaceStop, setRealTimePlaceStop] = useState<StopItem | null>(null);
  const [isRealTimeModalOpen, setIsRealTimeModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);

  // Maps API key and Quota defense state
  const [mapsApiKey, setMapsApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  // Load Maps API Key from server endpoint if not set in client env
  useEffect(() => {
    if (!mapsApiKey) {
      fetch('/api/config/maps')
        .then((res) => res.json())
        .then((data) => {
          if (data.apiKey) {
            setMapsApiKey(data.apiKey);
          }
        })
        .catch((err) => console.error('Failed to fetch Maps config', err));
    }
  }, [mapsApiKey]);

  // Quota exceeded listener as mandated by Google Maps Platform skill
  useEffect(() => {
    const handleQuota = () => setIsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips to localStorage', e);
    }
  }, [trips]);

  useEffect(() => {
    try {
      if (activeTripId) {
        localStorage.setItem(ACTIVE_TRIP_KEY, activeTripId);
      } else {
        localStorage.removeItem(ACTIVE_TRIP_KEY);
      }
    } catch (e) {
      console.error('Failed to save active trip ID', e);
    }
  }, [activeTripId]);

  // Active trip object - null if no trips exist yet
  const currentTrip = trips.find((t) => t.id === activeTripId) || (trips.length > 0 ? trips[0] : null);

  // Helper to update active trip
  const updateCurrentTrip = (updater: (prevTrip: Trip) => Trip) => {
    if (!currentTrip) return;
    setTrips((prevTrips) =>
      prevTrips.map((t) => (t.id === currentTrip.id ? updater(t) : t))
    );
  };

  // --- Handlers for Itinerary Stops ---
  const handleToggleComplete = (stopId: string) => {
    updateCurrentTrip((trip) => ({
      ...trip,
      days: trip.days.map((day) => ({
        ...day,
        stops: day.stops.map((stop) =>
          stop.id === stopId ? { ...stop, isCompleted: !stop.isCompleted } : stop
        ),
      })),
    }));
  };

  const handleEditStop = (stop: StopItem) => {
    setEditingStop(stop);
    setIsStopModalOpen(true);
  };

  const handleDeleteStop = (stopId: string) => {
    updateCurrentTrip((trip) => ({
      ...trip,
      days: trip.days.map((day) => ({
        ...day,
        stops: day.stops.filter((stop) => stop.id !== stopId),
      })),
    }));
  };

  const handleMoveStop = (fromIndex: number, toIndex: number) => {
    updateCurrentTrip((trip) => {
      const updatedDays = trip.days.map((day) => {
        if (day.dayNumber !== activeDayNumber) return day;
        const newStops = [...day.stops];
        if (toIndex < 0 || toIndex >= newStops.length) return day;
        const [movedItem] = newStops.splice(fromIndex, 1);
        newStops.splice(toIndex, 0, movedItem);
        return { ...day, stops: newStops };
      });
      return { ...trip, days: updatedDays };
    });
  };

  const handleAddTip = (stopId: string, tip: string) => {
    updateCurrentTrip((trip) => ({
      ...trip,
      days: trip.days.map((day) => ({
        ...day,
        stops: day.stops.map((stop) =>
          stop.id === stopId ? { ...stop, tip } : stop
        ),
      })),
    }));
  };

  const handleViewRealTime = (stop: StopItem) => {
    setRealTimePlaceStop(stop);
    setIsRealTimeModalOpen(true);
  };

  const handleSaveStop = (stopData: Partial<StopItem>, targetDayNumber: number) => {
    updateCurrentTrip((trip) => {
      let targetDays = [...trip.days];

      if (editingStop) {
        // Updating existing stop
        targetDays = targetDays.map((day) => {
          if (day.dayNumber === targetDayNumber) {
            const existsInThisDay = day.stops.some((s) => s.id === editingStop.id);
            if (existsInThisDay) {
              return {
                ...day,
                stops: day.stops.map((s) =>
                  s.id === editingStop.id ? ({ ...s, ...stopData } as StopItem) : s
                ),
              };
            } else {
              return {
                ...day,
                stops: [...day.stops, { ...editingStop, ...stopData } as StopItem],
              };
            }
          } else {
            return {
              ...day,
              stops: day.stops.filter((s) => s.id !== editingStop.id),
            };
          }
        });
      } else {
        // Creating brand new stop
        const newStopId = 'stop-' + Date.now();
        const newStop: StopItem = {
          id: newStopId,
          time: stopData.time || '10:00 AM',
          period: stopData.period || 'morning',
          title: stopData.title || 'New Stop',
          subtitle: stopData.subtitle || '',
          category: stopData.category || 'place',
          description: stopData.description || '',
          cost: stopData.cost,
          flightOrTrainCode: stopData.flightOrTrainCode,
          confirmationCode: stopData.confirmationCode,
          isConfirmed: stopData.isConfirmed,
          isCompleted: false,
          transitToNext: stopData.transitToNext,
          tip: stopData.tip,
          photoUrl: stopData.photoUrl,
          coordinates: stopData.coordinates
            ? {
                x: stopData.coordinates.x ?? (20 + Math.floor(Math.random() * 60)),
                y: stopData.coordinates.y ?? (20 + Math.floor(Math.random() * 60)),
                label: stopData.coordinates.label ?? stopData.title?.slice(0, 14),
                lat: stopData.coordinates.lat ?? 35.6595,
                lng: stopData.coordinates.lng ?? 139.7005,
              }
            : {
                x: 20 + Math.floor(Math.random() * 60),
                y: 20 + Math.floor(Math.random() * 60),
                label: stopData.title?.slice(0, 14),
                lat: 35.6595,
                lng: 139.7005,
              },
          tags: stopData.category ? [stopData.category] : ['Explorer'],
        };

        targetDays = targetDays.map((day) => {
          if (day.dayNumber === targetDayNumber) {
            return { ...day, stops: [...day.stops, newStop] };
          }
          return day;
        });

        // Also add to expenses automatically if cost provided
        let newExpenses = trip.expenses;
        if (stopData.cost && stopData.cost > 0) {
          newExpenses = [
            ...newExpenses,
            {
              id: 'exp-' + Date.now(),
              title: stopData.title || 'Stop booking',
              amount: stopData.cost,
              category:
                stopData.category === 'transit'
                  ? 'transit'
                  : stopData.category === 'stay'
                  ? 'stay'
                  : stopData.category === 'food'
                  ? 'food'
                  : 'activity',
              dayNumber: targetDayNumber,
              date: `Day 0${targetDayNumber}`,
            },
          ];
        }

        return { ...trip, days: targetDays, expenses: newExpenses };
      }

      return { ...trip, days: targetDays };
    });

    setEditingStop(null);
  };

  const handleAddDay = () => {
    if (!currentTrip) return;
    updateCurrentTrip((trip) => {
      const nextDayNum = trip.days.length + 1;
      const newDay = {
        dayNumber: nextDayNum,
        title: `Day 0${nextDayNum} Discovery`,
        theme: 'New neighborhood exploration & scenic viewpoints',
        date: `Day ${nextDayNum}`,
        stops: [],
      };
      return { ...trip, days: [...trip.days, newDay] };
    });
    setActiveDayNumber(currentTrip.days.length + 1);
  };

  // --- Expenses & Budget Handlers ---
  const handleAddExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: 'exp-' + Date.now(),
    };
    updateCurrentTrip((trip) => ({
      ...trip,
      expenses: [newExpense, ...trip.expenses],
    }));
  };

  const handleDeleteExpense = (id: string) => {
    updateCurrentTrip((trip) => ({
      ...trip,
      expenses: trip.expenses.filter((e) => e.id !== id),
    }));
  };

  // --- Packing Checklist Handlers ---
  const handleTogglePackingItem = (id: string) => {
    updateCurrentTrip((trip) => ({
      ...trip,
      packingList: trip.packingList.map((item) =>
        item.id === id ? { ...item, isPacked: !item.isPacked } : item
      ),
    }));
  };

  const handleAddPackingItem = (itemData: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...itemData,
      id: 'pack-' + Date.now(),
    };
    updateCurrentTrip((trip) => ({
      ...trip,
      packingList: [...trip.packingList, newItem],
    }));
  };

  const handleDeletePackingItem = (id: string) => {
    updateCurrentTrip((trip) => ({
      ...trip,
      packingList: trip.packingList.filter((item) => item.id !== id),
    }));
  };

  // --- Trip Switcher & Generator Handlers ---
  const handleCreateTrip = (newTrip: Trip) => {
    setTrips((prev) => [...prev, newTrip]);
    setActiveTripId(newTrip.id);
    setActiveDayNumber(1);
    setIsLandingPage(false);
  };

  const handleTripGenerated = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev.filter((t) => t.id !== newTrip.id)]);
    setActiveTripId(newTrip.id);
    setActiveDayNumber(1);
    setActiveTab('storyboard');
    setIsLandingPage(false);
  };

  const handleResetDefaults = () => {
    setTrips([]);
    setActiveTripId(null);
    setIsLandingPage(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_TRIP_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // If on Landing Page or no trip is created/selected yet, render LandingPageView
  if (isLandingPage || !currentTrip) {
    return (
      <div className="min-h-screen bg-[#f7f4f8] text-[#232326] flex flex-col font-body selection:bg-[#FFB5A7] selection:text-[#232326]">
        {/* Mandatory Google Maps Quota Exceeded Banner */}
        {isQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm font-body">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <LandingPageView
          onTripGenerated={handleTripGenerated}
          savedTrips={trips}
          onSelectSavedTrip={(id) => {
            setActiveTripId(id);
            setActiveDayNumber(1);
            setActiveTab('storyboard');
            setIsLandingPage(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8fc] text-[#232326] flex flex-col font-body selection:bg-[#FFB5A7] selection:text-[#232326]">
      {/* Mandatory Google Maps Quota Exceeded Banner */}
      {isQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm font-body">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 1. Top Bar Contract: [Brand title] — [4-5 nav links] — [1 primary action] */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddStop={() => {
          setEditingStop(null);
          setIsStopModalOpen(true);
        }}
        onOpenTripSwitcher={() => setIsTripSwitcherOpen(true)}
        currentTripTitle={currentTrip.title}
        onGoToLanding={() => setIsLandingPage(true)}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {/* Asymmetric 2-column Comic Grid Header with live statistics (Days, Stops, Budget, Transit) */}
        <ComicStatsGrid
          trip={currentTrip}
          activeDayNumber={activeDayNumber}
          onSelectDay={(dayNum) => {
            setActiveDayNumber(dayNum);
            setActiveTab('storyboard');
          }}
          onOpenTripSwitcher={() => setIsTripSwitcherOpen(true)}
          onOpenGenerator={() => setIsGeneratorModalOpen(true)}
        />

        {/* Tab Views */}
        {activeTab === 'storyboard' && (
          <StoryboardView
            trip={currentTrip}
            activeDayNumber={activeDayNumber}
            onSelectDay={setActiveDayNumber}
            onAddDay={handleAddDay}
            onOpenAddStop={() => {
              setEditingStop(null);
              setIsStopModalOpen(true);
            }}
            onToggleComplete={handleToggleComplete}
            onEditStop={handleEditStop}
            onDeleteStop={handleDeleteStop}
            onMoveStop={handleMoveStop}
            onAddTip={handleAddTip}
            onViewRealTime={handleViewRealTime}
          />
        )}

        {activeTab === 'map' && (
          <PastelMapView
            trip={currentTrip}
            activeDayNumber={activeDayNumber}
            onSelectDay={setActiveDayNumber}
            onEditStop={handleEditStop}
            onToggleComplete={handleToggleComplete}
            onViewRealTime={handleViewRealTime}
            mapsApiKey={mapsApiKey}
          />
        )}

        {activeTab === 'zine' && <MiniZineView trip={currentTrip} />}

        {activeTab === 'budget' && (
          <BudgetView
            trip={currentTrip}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'packing' && (
          <PackingView
            trip={currentTrip}
            onToggleItem={handleTogglePackingItem}
            onAddItem={handleAddPackingItem}
            onDeleteItem={handleDeletePackingItem}
          />
        )}
      </main>

      {/* 3. Quiet Comic Zine Footer */}
      <footer className="border-t-2 border-[#232326] bg-[#fbf8fc] px-4 md:px-8 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[#524341]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded border border-[#232326] bg-[#FFB5A7] flex items-center justify-center font-bold text-[10px] text-[#232326]">
              ✦
            </span>
            <span className="font-bold text-[#232326]">Pastel Zine Safar</span>
            <span>·</span>
            <span>India Edition (₹ INR) · Google Maps & Search Grounding</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setIsLandingPage(true)}
              className="hover:text-[#232326] font-bold text-[#884f44] hover:underline cursor-pointer"
            >
              ✦ Plan Another Destination
            </button>
            <button
              onClick={() => setIsGeneratorModalOpen(true)}
              className="hover:text-[#232326] hover:underline cursor-pointer"
            >
              ⚡ Autopopulate & Generate
            </button>
            <button
              onClick={() => setIsTripSwitcherOpen(true)}
              className="hover:text-[#232326] hover:underline cursor-pointer"
            >
              Switch Trip
            </button>
            <button
              onClick={() => setActiveTab('zine')}
              className="hover:text-[#232326] hover:underline cursor-pointer"
            >
              Print Mini-Zine
            </button>
            <button
              onClick={handleResetDefaults}
              className="text-[#857370] hover:text-[#ba1a1a] cursor-pointer"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => {
          setIsStopModalOpen(false);
          setEditingStop(null);
        }}
        onSave={handleSaveStop}
        initialStop={editingStop}
        days={currentTrip.days}
        activeDayNumber={activeDayNumber}
        currencySymbol={currentTrip.currencySymbol}
      />

      <TripSwitcherModal
        isOpen={isTripSwitcherOpen}
        onClose={() => setIsTripSwitcherOpen(false)}
        trips={trips}
        activeTripId={currentTrip.id}
        onSelectTrip={(id) => {
          setActiveTripId(id);
          setActiveDayNumber(1);
        }}
        onCreateTrip={handleCreateTrip}
        onResetDefaults={handleResetDefaults}
        onOpenGenerator={() => setIsGeneratorModalOpen(true)}
      />

      {/* Real-Time Place View Modal (360° Street View & Google Maps live view) */}
      <RealTimePlaceModal
        isOpen={isRealTimeModalOpen}
        onClose={() => {
          setIsRealTimeModalOpen(false);
          setRealTimePlaceStop(null);
        }}
        stop={realTimePlaceStop}
        mapsApiKey={mapsApiKey}
      />

      {/* Google Search City Autopopulate & Itinerary Generator Modal */}
      <SearchItineraryGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        onTripGenerated={handleTripGenerated}
      />
    </div>
  );
}
