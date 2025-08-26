
import React, { useState, useEffect } from "react";

// Mock data baseado no arquivo pipeline.json
const mockPipeline = [
  {
    id: 1,
    name: "Novo",
    color: "bg-blue-100 border-blue-300",
    leads: [
      {
        id: 1,
        title: "Novo Lead de Teste via Postman",
        value: 1500,
        priority: "high"
      },
      {
        id: 2,
        title: "Novo Lead via Telegram - Márcio",
        value: 0,
        priority: "medium"
      },
      {
        id: 4,
        title: "Novo Lead via Telegram - Alberto",
        value: 0,
        priority: "medium"
      }
    ]
  },
  {
    id: 2,
    name: "Contato Feito",
    color: "bg-purple-100 border-purple-300",
    leads: []
  },
  {
    id: 3,
    name: "Proposta",
    color: "bg-yellow-100 border-yellow-300",
    leads: [
      {
        id: 3,
        title: "Proposta para M.",
        value: 3500,
        priority: "high"
      }
    ]
  },
  {
    id: 4,
    name: "Negociação",
    color: "bg-orange-100 border-orange-300",
    leads: []
  },
  {
    id: 5,
    name: "Fechado (Ganho)",
    color: "bg-green-100 border-green-300",
    leads: []
  },
  {
    id: 6,
    name: "Fechado (Perdido)",
    color: "bg-red-100 border-red-300",
    leads: []
  }
];

export default function PipelineKanban() {
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);
  const [usingMockData, setUsingMockData] = useState(true);
  
  const apiUrl = "https://n8n.srv888692.hstgr.cloud/webhook/Pipeline";
  
  const fetchPipelineFromAPI = async () => {
    try {
      setPipeline([]);
      setLoading(true);
      setError(null);
      
      console.log("Buscando pipeline do webhook:", apiUrl);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados do pipeline:", data);
      
      // Analisar se os dados estão no formato esperado e adaptar se necessário
      let formattedPipeline;
      if (data.stages) {
        formattedPipeline = data.stages;
      } else if (Array.isArray(data) && data[0] && Object.keys(data[0]).includes('new')) {
        // Formato encontrado no pipeline.json
        const pipelineData = data[0];
        formattedPipeline = Object.entries(pipelineData).map(([key, value], index) => ({
          id: index + 1,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          leads: value.leads || []
        }));
      } else {
        formattedPipeline = mockPipeline;
      }
      
      setPipeline(formattedPipeline);
      setUsingMockData(false);
      
    } catch (err) {
      console.error("Erro ao buscar pipeline:", err);
      setError(`Não foi possível conectar à API do pipeline: ${err.message}. Usando dados mockados.`);
      setPipeline(mockPipeline);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados da API automaticamente ao montar o componente
    fetchPipelineFromAPI().catch(() => {
      // Se falhar, usar dados mockados como fallback
      setPipeline(mockPipeline);
      setLoading(false);
      setUsingMockData(true);
    });
  }, []);

  const onDragStart = (lead, stageId) => {
    setDraggedLead({ ...lead, fromStage: stageId });
  };

  const onDrop = (stageId) => {
    if (!draggedLead) return;
    setPipeline(prev => {
      // Remove lead from old stage
      const newPipeline = prev.map(stage => {
        if (stage.id === draggedLead.fromStage) {
          return { ...stage, leads: stage.leads.filter(l => l.id !== draggedLead.id) };
        }
        return stage;
      });
      // Add lead to new stage
      return newPipeline.map(stage => {
        if (stage.id === stageId) {
          return { 
            ...stage, 
            leads: [...stage.leads, { 
              id: draggedLead.id, 
              title: draggedLead.title || draggedLead.name || "Lead sem título",
              priority: draggedLead.priority || "medium",
              value: draggedLead.value || 0
            }] 
          };
        }
        return stage;
      });
    });
    setDraggedLead(null);
  };

  const stageColors = [
    "bg-blue-50 border-blue-300",
    "bg-purple-50 border-purple-300", 
    "bg-yellow-50 border-yellow-300",
    "bg-orange-50 border-orange-300",
    "bg-green-50 border-green-300",
    "bg-red-50 border-red-300"
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mr-4">Pipeline de Vendas</h2>
          {usingMockData && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Usando dados locais
            </span>
          )}
        </div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          onClick={fetchPipelineFromAPI}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Atualizar Pipeline'}
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 pt-2 px-2 -mx-2">
      {loading ? (
        <div className="w-full flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500 w-full bg-red-50 rounded-lg border border-red-200 p-4">{error}</div>
      ) : pipeline.length === 0 ? (
        <div className="text-center py-8 text-gray-500 w-full bg-gray-50 rounded-lg border border-gray-200 p-4">Nenhum estágio disponível no pipeline</div>
      ) : (
        pipeline.map((stage, idx) => (
          <div
            key={stage.id}
            className={`min-w-[280px] rounded-xl border ${stageColors[idx % stageColors.length]} shadow-lg flex flex-col p-4 transition-all duration-200`}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(stage.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-700">{stage.name}</h3>
              <span className="bg-white border px-2 py-1 rounded-full text-xs text-gray-600 font-medium">{stage.leads.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {stage.leads.map(lead => (
                <div
                  key={lead.id}
                  className={`bg-white border border-gray-200 rounded-lg shadow-sm p-3 hover:shadow-md flex flex-col cursor-grab hover:bg-gray-50 transition-all duration-150 ${draggedLead && draggedLead.id === lead.id ? 'ring-2 ring-indigo-400' : ''}`}
                  draggable
                  onDragStart={() => onDragStart(lead, stage.id)}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 ${lead.priority === 'high' ? 'bg-red-100 text-red-600' : lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center font-bold mr-2`}>
                      {(lead.title && lead.title[0]) || (lead.contact && lead.contact.name && lead.contact.name[0]) || (lead.name && lead.name[0]) || "L"}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{lead.title || (lead.contact && lead.contact.name) || lead.name || "Lead sem título"}</span>
                      {lead.contact && lead.contact.company && (
                        <div className="text-xs text-gray-500 mt-0.5">{lead.contact.company}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {lead.source || ""}
                      {lead.contact && lead.contact.phone && (
                        <span className="ml-2">📞 {lead.contact.phone}</span>
                      )}
                    </span>
                    {lead.value > 0 && <span className="font-semibold text-green-600">R$ {lead.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>}
                  </div>
                </div>
              ))}
              {stage.leads.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <svg className="w-6 h-6 mx-auto mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Arraste leads para aqui
                </div>
              )}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
}
