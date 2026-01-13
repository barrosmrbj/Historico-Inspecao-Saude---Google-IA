
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ShieldCheck, 
  Calendar, 
  User, 
  MapPin,
  Stethoscope,
  ChevronDown,
  // Added Clock to imports
  Clock
} from 'lucide-react';
import { MilitaryPerson, InspectionRecord } from '../types';

interface HistoryRecordProps {
  person: MilitaryPerson;
  onBack: () => void;
  onPrint: () => void;
}

const HistoryRecord: React.FC<HistoryRecordProps> = ({ person, onBack, onPrint }) => {
  const [history, setHistory] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from historical database: 1Odv6OclUAie8LCFIpI5iQsuoUFLq6ChUimqiGPVjjjU
    // Matching by CPF (Column G)
    const fetchHistory = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockHistory: InspectionRecord[] = [
          { 
            id: 'h1', 
            date: '15/05/2023', 
            type: 'Inspecao Periódica', 
            result: 'Apto para o serviço', 
            doctor: 'Ten Cel Med Ricardo', 
            location: 'HFASP', 
            observations: 'Paciente apresenta excelente condição física geral.',
            validity: '15/05/2024'
          },
          { 
            id: 'h2', 
            date: '10/02/2022', 
            type: 'Inspecao para Promoção', 
            result: 'Apto para o serviço', 
            doctor: 'Maj Med Cláudia', 
            location: 'HFASP', 
            observations: 'Sem restrições médicas observadas.',
            validity: '10/02/2023'
          },
          { 
            id: 'h3', 
            date: '20/11/2020', 
            type: 'Inspecao Especial', 
            result: 'Apto com restrições temporárias', 
            doctor: 'Cap Med André', 
            location: 'SESAU-SP', 
            observations: 'Repouso vocal de 15 dias recomendado após quadro viral.',
            validity: '05/12/2020'
          },
        ];
        setHistory(mockHistory);
        setLoading(false);
      }, 600);
    };
    fetchHistory();
  }, [person.cpf]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Quadro Geral
        </button>
        <div className="flex gap-3">
          <button 
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all font-bold"
          >
            <Printer className="w-4 h-4" />
            Gerar PDF de Histórico
          </button>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-indigo-900 px-8 py-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 text-2xl font-bold">
              {person.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{person.name}</h3>
              <p className="text-indigo-200 font-medium">{person.rank} • {person.specialty}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
            <div>
              <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider">SARAM</p>
              <p className="text-sm font-mono">{person.saram}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider">CPF</p>
              <p className="text-sm font-mono">{person.cpf}</p>
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider">Última Inspeção</p>
              <p className="text-sm">{person.lastInspectionDate}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h4 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Histórico de Juntas Superiores de Saúde</h4>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl"></div>)}
              </div>
            ) : history.length > 0 ? (
              history.map((record, idx) => (
                <div key={record.id} className="relative pl-8 border-l-2 border-indigo-100 pb-8 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-indigo-900">{record.date}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-semibold text-gray-700">{record.type}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        <span className="text-xs font-bold text-emerald-700">{record.result}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                      <div className="flex items-start gap-2">
                        <Stethoscope className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-500 font-medium">Médico Avaliador</p>
                          <p className="font-bold text-gray-800">{record.doctor}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-500 font-medium">Local / Organização</p>
                          <p className="font-bold text-gray-800">{record.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        {/* Clock icon is used here */}
                        <Clock className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-gray-500 font-medium">Validade da Inspeção</p>
                          <p className="font-bold text-gray-800">{record.validity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Observações Médicas:</p>
                      <p className="text-gray-700 leading-relaxed italic">"{record.observations}"</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Nenhum histórico anterior encontrado para este CPF.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryRecord;
