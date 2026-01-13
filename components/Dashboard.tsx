
import React from 'react';
import { 
  Search, 
  Printer, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { MilitaryPerson } from '../types';

interface DashboardProps {
  data: MilitaryPerson[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSelect: (person: MilitaryPerson) => void;
  onPrint: (person: MilitaryPerson) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  onSelect,
  onPrint
}) => {
  const stats = {
    total: data.length,
    pending: data.filter(p => p.status === 'Pendente').length,
    completed: data.filter(p => p.status === 'Concluído').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Inspeções de Hoje</h2>
          <p className="text-gray-500 mt-1">Quadro geral de militares para avaliação de saúde no dia {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[140px]">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[140px]">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Pendentes</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 min-w-[140px]">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Concluídos</p>
              <p className="text-xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por Nome ou SARAM..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
            <TrendingUp className="w-4 h-4" />
            Recentes
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Militar</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Documentos</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                  <td className="px-6 py-6"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                  <td className="px-6 py-6 text-right"><div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div></td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((person) => (
                <tr key={person.id} className="hover:bg-indigo-50 transition-colors cursor-pointer group" onClick={() => onSelect(person)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.rank} • {person.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-gray-600">SARAM: {person.saram}</p>
                    <p className="text-xs font-mono text-gray-600">CPF: {person.cpf}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      person.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' :
                      person.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {person.status === 'Concluído' && <CheckCircle className="w-3 h-3" />}
                      {person.status === 'Pendente' && <Clock className="w-3 h-3" />}
                      {person.status === 'Em Avaliação' && <AlertCircle className="w-3 h-3" />}
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold ${person.priority === 'Urgente' ? 'text-rose-600' : 'text-gray-500'}`}>
                      {person.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelect(person); }}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                    >
                      <FileText className="w-4 h-4" />
                      Histórico
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPrint(person); }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                    >
                      <Printer className="w-4 h-4" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p>Nenhum militar encontrado para os critérios de busca.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
