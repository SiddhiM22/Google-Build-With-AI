import React, { useState } from 'react';
import { Trip, PackingItem } from '../types/travel';
import { CheckSquare, Square, Plus, Trash2, Tag, ShieldCheck, PenTool } from 'lucide-react';

interface PackingViewProps {
  trip: Trip;
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<PackingItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

export const PackingView: React.FC<PackingViewProps> = ({
  trip,
  onToggleItem,
  onAddItem,
  onDeleteItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | PackingItem['category']>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState<PackingItem['category']>('gear');
  const [isEssential, setIsEssential] = useState(false);

  const packedCount = trip.packingList.filter((item) => item.isPacked).length;
  const totalCount = trip.packingList.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const filteredItems = trip.packingList.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCat,
      isPacked: false,
      essential: isEssential,
    });

    setNewItemName('');
    setIsEssential(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Progress Card in Sage Mint (#CDEAC0) */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-5 shadow-[3px_3px_0px_#232326]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#CDEAC0] border-2 border-[#232326] flex items-center justify-center font-display font-bold text-lg shadow-[2px_2px_0px_#232326]">
              ✓
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-[#232326]">
                Pocket Travel Checklist
              </h2>
              <p className="text-xs font-mono-code text-[#524341]">
                Sage Mint verified essentials & pocket zine sketching supplies
              </p>
            </div>
          </div>

          <div className="text-right flex items-center sm:block gap-2">
            <div className="font-display font-bold text-2xl text-[#232326] tabular-nums">
              {packedCount} / {totalCount}
            </div>
            <div className="text-xs font-mono-code text-[#4c6544] font-bold">
              {progressPercent}% Packed
            </div>
          </div>
        </div>

        {/* Comic Progress Bar */}
        <div className="w-full bg-[#f0edf1] border-2 border-[#232326] h-3.5 rounded-full overflow-hidden mt-4">
          <div
            className="bg-[#CDEAC0] h-full border-r-2 border-[#232326] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Category Tabs & Quick Add Form */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-5 shadow-[3px_3px_0px_#232326]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap border-b-2 border-[#232326]/10 pb-3 mb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#FFB5A7] border-[#232326] shadow-[1.5px_1.5px_0px_#232326] text-[#232326]'
                : 'bg-white border-[#232326]/40 text-[#232326] hover:bg-[#f0edf1]'
            }`}
          >
            All Items ({trip.packingList.length})
          </button>
          <button
            onClick={() => setActiveCategory('documents')}
            className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border transition-all cursor-pointer ${
              activeCategory === 'documents'
                ? 'bg-[#FFB5A7] border-[#232326] shadow-[1.5px_1.5px_0px_#232326] text-[#232326]'
                : 'bg-white border-[#232326]/40 text-[#232326] hover:bg-[#f0edf1]'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveCategory('gear')}
            className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border transition-all cursor-pointer ${
              activeCategory === 'gear'
                ? 'bg-[#FFB5A7] border-[#232326] shadow-[1.5px_1.5px_0px_#232326] text-[#232326]'
                : 'bg-white border-[#232326]/40 text-[#232326] hover:bg-[#f0edf1]'
            }`}
          >
            Tech & Gear
          </button>
          <button
            onClick={() => setActiveCategory('zine')}
            className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border transition-all cursor-pointer ${
              activeCategory === 'zine'
                ? 'bg-[#FFB5A7] border-[#232326] shadow-[1.5px_1.5px_0px_#232326] text-[#232326]'
                : 'bg-white border-[#232326]/40 text-[#232326] hover:bg-[#f0edf1]'
            }`}
          >
            Zine & Pens
          </button>
          <button
            onClick={() => setActiveCategory('clothing')}
            className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border transition-all cursor-pointer ${
              activeCategory === 'clothing'
                ? 'bg-[#FFB5A7] border-[#232326] shadow-[1.5px_1.5px_0px_#232326] text-[#232326]'
                : 'bg-white border-[#232326]/40 text-[#232326] hover:bg-[#f0edf1]'
            }`}
          >
            Clothing
          </button>
        </div>

        {/* Add item inline */}
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <input
            type="text"
            required
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new packing item (e.g., Sakura ink pen, camera battery)..."
            className="w-full sm:flex-1 p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-body focus:outline-none"
          />

          <select
            value={newItemCat}
            onChange={(e) => setNewItemCat(e.target.value as any)}
            className="w-full sm:w-36 p-2 text-xs border-2 border-[#232326] rounded-lg bg-white font-mono-code focus:outline-none"
          >
            <option value="documents">Documents</option>
            <option value="gear">Tech / Gear</option>
            <option value="zine">Zine Stationery</option>
            <option value="clothing">Clothing</option>
            <option value="toiletries">Toiletries</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs font-mono-code cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={isEssential}
              onChange={(e) => setIsEssential(e.target.checked)}
              className="accent-[#884f44]"
            />
            <span>Essential</span>
          </label>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#FFB5A7] border-2 border-[#232326] font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2px_2px_0px_#232326] hover:shadow-[3px_3px_0px_#232326] cursor-pointer whitespace-nowrap"
          >
            + Add
          </button>
        </form>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-3 rounded-xl border-2 border-[#232326] flex items-center justify-between gap-3 cursor-pointer transition-all ${
                item.isPacked
                  ? 'bg-[#CDEAC0]/40 shadow-[1.5px_1.5px_0px_#232326]'
                  : 'bg-white hover:bg-[#FDE4CF]/30 shadow-[2px_2px_0px_#232326]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleItem(item.id);
                  }}
                  className="cursor-pointer"
                >
                  {item.isPacked ? (
                    <div className="w-5 h-5 rounded border-2 border-[#232326] bg-[#CDEAC0] flex items-center justify-center text-xs font-bold text-[#0a2006]">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded border-2 border-[#232326] bg-white" />
                  )}
                </button>

                <div className="min-w-0">
                  <span
                    className={`font-body text-sm block truncate ${
                      item.isPacked ? 'line-through text-[#857370]' : 'text-[#232326] font-medium'
                    }`}
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#524341] mt-0.5">
                    <span className="uppercase">{item.category}</span>
                    {item.essential && (
                      <span className="text-[#ba1a1a] font-bold">★ Essential</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="text-[#857370] hover:text-[#ba1a1a] p-1 cursor-pointer shrink-0"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
