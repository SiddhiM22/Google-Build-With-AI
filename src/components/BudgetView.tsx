import React, { useState } from 'react';
import { Trip, ExpenseItem } from '../types/travel';
import { Plus, Wallet, Receipt, CheckCircle2, Ticket, TrendingUp, Trash2 } from 'lucide-react';

interface BudgetViewProps {
  trip: Trip;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  trip,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'transit' | 'stay' | 'food' | 'activity' | 'souvenir'>('food');
  const [dayNumber, setDayNumber] = useState(1);

  const totalSpent = trip.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = Math.max(0, trip.totalBudget - totalSpent);
  const budgetPercent = Math.min(100, Math.round((totalSpent / trip.totalBudget) * 100));

  // Category aggregations
  const categoryTotals = trip.expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const confirmedStops = trip.days
    .flatMap((d) => d.stops)
    .filter((s) => s.isConfirmed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    onAddExpense({
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      dayNumber: Number(dayNumber),
      date: `Day 0${dayNumber}`,
    });

    setTitle('');
    setAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Sage Mint Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Total Budget Card */}
        <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-4 shadow-[3px_3px_0px_#232326]">
          <span className="text-xs font-mono-code font-bold uppercase text-[#524341]">
            TOTAL BUDGET CAP
          </span>
          <div className="font-display font-bold text-2xl text-[#232326] mt-1 tabular-nums">
            {trip.currencySymbol}
            {trip.totalBudget.toLocaleString()}
          </div>
          <p className="text-xs font-mono-code text-[#857370] mt-1">
            Trip currency: {trip.currency}
          </p>
        </div>

        {/* Total Spent Card */}
        <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-4 shadow-[3px_3px_0px_#232326]">
          <span className="text-xs font-mono-code font-bold uppercase text-[#524341]">
            CURRENT EXPENDITURE
          </span>
          <div className="font-display font-bold text-2xl text-[#884f44] mt-1 tabular-nums">
            {trip.currencySymbol}
            {totalSpent.toLocaleString()}
          </div>
          <div className="w-full bg-[#f0edf1] border border-[#232326] h-2.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-[#FFB5A7] h-full border-r border-[#232326]"
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>

        {/* Sage Mint Remaining Card */}
        <div className="bg-[#CDEAC0] border-2 border-[#232326] rounded-[14px] p-4 shadow-[3px_3px_0px_#232326]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code font-bold uppercase text-[#0a2006]">
              REMAINING BUDGET
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#232326] text-[10px] font-mono-code font-bold text-[#232326]">
              {100 - budgetPercent}% LEFT
            </span>
          </div>
          <div className="font-display font-bold text-2xl text-[#0a2006] mt-1 tabular-nums">
            {trip.currencySymbol}
            {remainingBudget.toLocaleString()}
          </div>
          <p className="text-xs font-mono-code text-[#354d2e] mt-1">
            Sage Mint Confirmed Status
          </p>
        </div>
      </div>

      {/* 2. Confirmed Reservations & Vouchers Section */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-5 shadow-[3px_3px_0px_#232326]">
        <div className="flex items-center justify-between mb-4 border-b-2 border-[#232326]/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#CDEAC0] border-2 border-[#232326] flex items-center justify-center font-bold text-xs shadow-[1px_1px_0px_#232326]">
              ✓
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#232326]">
                Confirmed Reservations & Tickets
              </h3>
              <p className="text-xs font-mono-code text-[#524341]">
                Verified boarding passes, train seats, and hotel bookings
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full border border-[#232326] bg-[#CDEAC0] text-xs font-mono-code font-bold text-[#0a2006]">
            {confirmedStops.length} Confirmed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {confirmedStops.map((stop) => (
            <div
              key={stop.id}
              className="bg-white border-2 border-[#232326] rounded-[12px] p-3 shadow-[2px_2px_0px_#232326] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded bg-[#CDEAC0] border border-[#232326] text-[#0a2006]">
                    {stop.confirmationCode || 'CONFIRMED'}
                  </span>
                  <span className="text-xs font-mono-code text-[#524341]">{stop.time}</span>
                </div>
                <h4 className="font-display font-bold text-sm text-[#232326] mt-2 line-clamp-1">
                  {stop.title}
                </h4>
                <p className="text-xs font-mono-code text-[#857370] truncate mt-0.5">
                  {stop.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#232326]/10 flex items-center justify-between text-xs font-mono-code">
                <span className="text-[#356668] font-bold">
                  {stop.flightOrTrainCode || stop.category.toUpperCase()}
                </span>
                {stop.cost ? (
                  <span className="font-bold text-[#232326]">
                    {trip.currencySymbol}{stop.cost.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-[#4c6544]">Pre-paid</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Expense Ledger */}
      <div className="bg-[#fbf8fc] border-2 border-[#232326] rounded-[14px] p-5 shadow-[3px_3px_0px_#232326]">
        <div className="flex items-center justify-between mb-4 border-b-2 border-[#232326]/10 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#884f44]" />
            <h3 className="font-display font-bold text-lg text-[#232326]">
              Pocket Expense Ledger
            </h3>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-full bg-[#FFB5A7] border-2 border-[#232326] px-3.5 py-1.5 font-display font-bold text-xs uppercase tracking-wider text-[#232326] shadow-[2px_2px_0px_#232326] hover:shadow-[3px_3px_0px_#232326] cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Add Form Accordion */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-5 p-4 border-2 border-[#232326] bg-[#FDE4CF] rounded-xl shadow-[2px_2px_0px_#232326] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
          >
            <div className="lg:col-span-2">
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Item Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Takoyaki stall, Museum ticket..."
                className="w-full p-2 text-xs border border-[#232326] rounded bg-white font-body focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Amount ({trip.currencySymbol}):
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full p-2 text-xs border border-[#232326] rounded bg-white font-mono-code focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code font-bold uppercase text-[#232326] mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 text-xs border border-[#232326] rounded bg-white font-mono-code focus:outline-none"
              >
                <option value="food">Food & Drink</option>
                <option value="transit">Transit & Rail</option>
                <option value="stay">Lodging</option>
                <option value="activity">Activity</option>
                <option value="souvenir">Souvenir / Zine</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="w-full py-2 rounded border-2 border-[#232326] bg-[#FFB5A7] font-display font-bold text-xs uppercase text-[#232326] shadow-[1.5px_1.5px_0px_#232326] cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-3 rounded border border-[#232326] bg-white font-mono-code text-xs text-[#232326] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead>
              <tr className="border-b-2 border-[#232326] text-[#524341]">
                <th className="py-2 px-3">DATE / DAY</th>
                <th className="py-2 px-3">ITEM DESCRIPTION</th>
                <th className="py-2 px-3">CATEGORY</th>
                <th className="py-2 px-3 text-right">AMOUNT</th>
                <th className="py-2 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {trip.expenses.map((expense) => {
                const getCatBadge = () => {
                  switch (expense.category) {
                    case 'transit':
                      return 'bg-[#A8DADC] text-[#002021]';
                    case 'food':
                    case 'stay':
                      return 'bg-[#FDE4CF] text-[#524341]';
                    case 'activity':
                      return 'bg-[#CDEAC0] text-[#0a2006]';
                    default:
                      return 'bg-[#E8D7F1] text-[#232326]';
                  }
                };

                return (
                  <tr
                    key={expense.id}
                    className="border-b border-[#232326]/10 hover:bg-[#f0edf1]/60 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-[#884f44]">
                      {expense.date || `Day 0${expense.dayNumber}`}
                    </td>
                    <td className="py-2.5 px-3 font-display font-semibold text-sm text-[#232326]">
                      {expense.title}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded border border-[#232326] text-[10px] font-bold uppercase ${getCatBadge()}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#232326] tabular-nums">
                      {trip.currencySymbol}
                      {expense.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-[#ba1a1a] hover:opacity-75 cursor-pointer p-1"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
