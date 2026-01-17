"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Şimdilik örnek veriler (Simülasyon)
const data = [
  { name: 'Oca', total: 4000 },
  { name: 'Şub', total: 3000 },
  { name: 'Mar', total: 2000 },
  { name: 'Nis', total: 2780 },
  { name: 'May', total: 1890 },
  { name: 'Haz', total: 2390 },
  { name: 'Tem', total: 3490 },
  { name: 'Ağu', total: 5000 }, // Yazın işler açılmış :)
  { name: 'Eyl', total: 4500 },
  { name: 'Eki', total: 6000 },
  { name: 'Kas', total: 5500 },
  { name: 'Ara', total: 7000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-[400px]">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">Yıllık Gelir Analizi</h3>
        <p className="text-sm text-gray-500">Aylık bazda tahsil edilen tutarlar</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₺${value}`} 
          />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.total > 5000 ? '#7C3AED' : '#C4B5FD'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}