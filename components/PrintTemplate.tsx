
import React from 'react';
import { MilitaryPerson } from '../types';

interface PrintTemplateProps {
  person: MilitaryPerson;
}

const PrintTemplate: React.FC<PrintTemplateProps> = ({ person }) => {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="print-only bg-white p-12 text-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8 border-b-2 border-black pb-6">
        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mb-4">
          <span className="font-bold">BRASÃO</span>
        </div>
        <h1 className="text-xl font-bold uppercase tracking-widest">Ministério da Defesa</h1>
        <h2 className="text-lg font-bold uppercase">Comando da Aeronáutica</h2>
        <h3 className="text-md uppercase font-semibold">Diretoria de Saúde</h3>
        <p className="text-sm mt-2 font-mono">ID: {person.id}-{person.saram}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-center text-lg font-bold bg-gray-100 p-2 uppercase border border-black mb-4">
          Relatório de Histórico de Inspeção de Saúde
        </h2>
        
        <div className="grid grid-cols-2 gap-4 border border-black p-4">
          <div><p><strong>NOME:</strong> {person.name}</p></div>
          <div><p><strong>SARAM:</strong> {person.saram}</p></div>
          <div><p><strong>POSTO/GRAD:</strong> {person.rank}</p></div>
          <div><p><strong>CPF:</strong> {person.cpf}</p></div>
          <div><p><strong>ESPECIALIDADE:</strong> {person.specialty}</p></div>
          <div><p><strong>DATA EMISSÃO:</strong> {today}</p></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold border-b border-black pb-1">HISTÓRICO DE PARECERES (ORDEM DECRESCENTE)</h3>
        
        {[1, 2, 3].map(i => (
          <div key={i} className="border border-gray-300 p-4 rounded-sm">
            <div className="flex justify-between font-bold mb-2">
              <span>DATA: {i === 1 ? '15/05/2023' : i === 2 ? '10/02/2022' : '20/11/2020'}</span>
              <span>PARECER: APTO</span>
            </div>
            <p className="text-sm"><strong>TIPO:</strong> INSPEÇÃO PERIÓDICA DE SAÚDE</p>
            <p className="text-sm"><strong>ORGANIZAÇÃO:</strong> HOSPITAL DE FORÇA AÉREA DE SÃO PAULO</p>
            <p className="text-sm mt-2"><strong>OBSERVAÇÃO:</strong> Sem restrições médicas significativas observadas no período de avaliação.</p>
            <p className="text-sm mt-2 text-right"><strong>ASSINADO:</strong> Maj Med Médico Avaliador {i}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-around">
        <div className="flex flex-col items-center">
          <div className="w-48 border-t border-black"></div>
          <p className="text-xs mt-1">Assinatura do Responsável</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-48 border-t border-black"></div>
          <p className="text-xs mt-1">Carimbo da Organização</p>
        </div>
      </div>

      <div className="mt-12 text-[10px] text-gray-500 italic">
        Este documento foi gerado eletronicamente pelo SIS-SAUDE através do banco de dados ID-1Odv6OclUAie8LCFIpI5iQsuoUFLq6ChUimqiGPVjjjU.
      </div>
    </div>
  );
};

export default PrintTemplate;
