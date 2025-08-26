

import React, { useState, useEffect } from "react";

// Mock data baseado nos arquivos em tools/pipeline.json
// Extraindo todos os leads de todos os estágios do pipeline
const extractLeadsFromPipeline = () => {
  const allLeads = [
    {
      "assigned_to": null,
      "contact": null,
      "contact_id": null,
      "created_at": "2025-08-26T18:05:19.956201",
      "description": null,
      "expected_close_date": null,
      "id": 1,
      "priority": "high",
      "source": "Postman",
      "stage": "new",
      "title": "Novo Lead de Teste via Postman",
      "updated_at": "2025-08-26T18:05:19.956201",
      "value": 1500
    },
    {
      "assigned_to": null,
      "contact": {
        "company": null,
        "created_at": "2025-08-26T18:10:25.312169",
        "email": null,
        "id": 1,
        "name": "Márcio",
        "notes": null,
        "phone": "5752003168",
        "position": null,
        "updated_at": "2025-08-26T18:10:25.312169"
      },
      "contact_id": 1,
      "created_at": "2025-08-26T18:11:34.719624",
      "description": "Contato recebido através do bot do Telegram.",
      "expected_close_date": null,
      "id": 2,
      "priority": "medium",
      "source": "Telegram",
      "stage": "new",
      "title": "Novo Lead via Telegram - Márcio",
      "updated_at": "2025-08-26T18:11:34.719624",
      "value": 0
    },
    {
      "assigned_to": null,
      "contact": {
        "company": null,
        "created_at": "2025-08-26T18:14:25.380912",
        "email": null,
        "id": 2,
        "name": "Alberto",
        "notes": null,
        "phone": "6579028215",
        "position": null,
        "updated_at": "2025-08-26T18:14:25.380912"
      },
      "contact_id": 2,
      "created_at": "2025-08-26T18:16:33.156973",
      "description": "Contato recebido através do bot do Telegram.",
      "expected_close_date": null,
      "id": 4,
      "priority": "medium",
      "source": "Telegram",
      "stage": "new",
      "title": "Novo Lead via Telegram - Alberto",
      "updated_at": "2025-08-26T18:16:33.156973",
      "value": 0
    },
    {
      "assigned_to": null,
      "contact": {
        "company": null,
        "created_at": "2025-08-26T18:14:50.580594",
        "email": null,
        "id": 3,
        "name": "M.",
        "notes": null,
        "phone": "5310826495",
        "position": null,
        "updated_at": "2025-08-26T18:14:50.580594"
      },
      "contact_id": 3,
      "created_at": "2025-08-26T18:14:50.748109",
      "description": "Contato recebido através do bot do Telegram.",
      "expected_close_date": null,
      "id": 3,
      "priority": "medium",
      "source": "Telegram",
      "stage": "proposal",
      "title": "Novo Lead via Telegram - M.",
      "updated_at": "2025-08-26T18:19:04.433150",
      "value": 0
    }
  ];
  
  return allLeads;
};

const mockLeads = extractLeadsFromPipeline();

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newLead, setNewLead] = useState({ 
    title: "", 
    source: "", 
    stage: "new", 
    assigned_to: null,
    priority: "medium",
    value: 0,
    description: "",
    contact: { name: "", email: "", phone: "" }
  });
  const [usingMockData, setUsingMockData] = useState(true);
  
  const apiUrl = "https://n8n.srv888692.hstgr.cloud/webhook/Leads";
  
  const fetchLeadsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando leads do webhook:", apiUrl);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados da API:", data);
      setLeads(Array.isArray(data) ? data : [data]);
      setUsingMockData(false);
      
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(`Não foi possível conectar à API: ${err.message}. Usando dados mockados.`);
      setLeads(mockLeads);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados da API automaticamente ao montar o componente
    fetchLeadsFromAPI().catch(() => {
      // Se falhar, usar dados mockados como fallback
      setLeads(mockLeads);
      setLoading(false);
      setUsingMockData(true);
    });
  }, []);

  const openModal = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleDelete = (id) => {
    setLeads(leads.filter(l => l.id !== id));
    closeModal();
  };

  const handleEdit = (field, value) => {
    setSelectedLead({ ...selectedLead, [field]: value });
  };
  const saveEdit = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? selectedLead : l));
    closeModal();
  };

  const handleCreate = () => {
    setLeads([...leads, { ...newLead, id: Date.now() }]);
    setShowCreate(false);
    setNewLead({ name: "", email: "", phone: "", source: "", status: "Novo", assigned_to: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mr-4">Leads</h2>
          {usingMockData && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Usando dados locais
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            onClick={fetchLeadsFromAPI}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Atualizar Dados'}
          </button>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition" 
            onClick={() => setShowCreate(true)}
          >
            + Novo Lead
          </button>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-200 p-4">{error}</div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estágio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap" onClick={() => openModal(lead)}>
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {lead.title || 'Sem título'}
                      </div>
                      {lead.priority && (
                        <div className={`inline-flex mt-1 px-2 text-xs rounded-full ${
                          lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                          lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {lead.priority === 'high' ? 'Alta' : 
                           lead.priority === 'medium' ? 'Média' : 'Baixa'}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap" onClick={() => openModal(lead)}>
                  <div className="text-sm text-gray-900">{lead.contact?.name || '-'}</div>
                  <div className="text-sm text-gray-500">{lead.contact?.phone || '-'}</div>
                  <div className="text-sm text-gray-500">{lead.contact?.email || '-'}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap" onClick={() => openModal(lead)}>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {lead.source || 'Não definido'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={() => openModal(lead)}>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${lead.stage === 'new' ? 'bg-gray-100 text-gray-800' :
                      lead.stage === 'qualified' ? 'bg-blue-100 text-blue-800' :
                      lead.stage === 'proposal' ? 'bg-indigo-100 text-indigo-800' :
                      lead.stage === 'negotiation' ? 'bg-purple-100 text-purple-800' :
                      lead.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                      lead.stage === 'closed_lost' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {lead.stage === 'new' ? 'Novo' :
                     lead.stage === 'qualified' ? 'Qualificado' :
                     lead.stage === 'proposal' ? 'Proposta' :
                     lead.stage === 'negotiation' ? 'Negociação' :
                     lead.stage === 'closed_won' ? 'Fechado (Ganho)' :
                     lead.stage === 'closed_lost' ? 'Fechado (Perdido)' :
                     lead.stage}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" onClick={() => openModal(lead)}>
                  {lead.value ? `R$ ${lead.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'R$ 0,00'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openModal(lead)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(lead.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* Modal de detalhes/edição */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Detalhes do Lead</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Lead</label>
                <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={selectedLead.title || ''} 
                  onChange={e => handleEdit('title', e.target.value)} 
                  placeholder="Título" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={selectedLead.source || ''} 
                  onChange={e => handleEdit('source', e.target.value)} 
                  placeholder="Origem" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estágio</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedLead.stage || 'new'} 
                  onChange={e => handleEdit('stage', e.target.value)}>
                  <option value="new">Novo</option>
                  <option value="qualified">Qualificado</option>
                  <option value="proposal">Proposta</option>
                  <option value="negotiation">Negociação</option>
                  <option value="closed_won">Fechado (Ganho)</option>
                  <option value="closed_lost">Fechado (Perdido)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedLead.priority || 'medium'} 
                  onChange={e => handleEdit('priority', e.target.value)}>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 border-b pb-2 mb-3">Informações de Contato</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={selectedLead.contact?.name || ''} 
                    onChange={e => handleEdit('contact', {...selectedLead.contact, name: e.target.value})} 
                    placeholder="Nome do Contato" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={selectedLead.contact?.email || ''} 
                    onChange={e => handleEdit('contact', {...selectedLead.contact, email: e.target.value})} 
                    placeholder="Email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={selectedLead.contact?.phone || ''} 
                    onChange={e => handleEdit('contact', {...selectedLead.contact, phone: e.target.value})} 
                    placeholder="Telefone" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 border-b pb-2 mb-3">Detalhes Financeiros</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    type="number"
                    min="0"
                    value={selectedLead.value || ''} 
                    onChange={e => handleEdit('value', parseFloat(e.target.value) || 0)} 
                    placeholder="Valor" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={selectedLead.assigned_to || ''} 
                    onChange={e => handleEdit('assigned_to', e.target.value)} 
                    placeholder="Responsável" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]" 
                value={selectedLead.description || ''} 
                onChange={e => handleEdit('description', e.target.value)} 
                placeholder="Adicione detalhes sobre este lead..." />
            </div>
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                onClick={closeModal}>
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                onClick={saveEdit}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de criação */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Criar Novo Lead</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Lead*</label>
                <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={newLead.title} 
                  onChange={e => setNewLead({ ...newLead, title: e.target.value })} 
                  placeholder="Título" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={newLead.source} 
                  onChange={e => setNewLead({ ...newLead, source: e.target.value })} 
                  placeholder="Origem (ex: site, referência, etc.)" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estágio</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={newLead.stage} 
                  onChange={e => setNewLead({ ...newLead, stage: e.target.value })}>
                  <option value="new">Novo</option>
                  <option value="qualified">Qualificado</option>
                  <option value="proposal">Proposta</option>
                  <option value="negotiation">Negociação</option>
                  <option value="closed_won">Fechado (Ganho)</option>
                  <option value="closed_lost">Fechado (Perdido)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={newLead.priority} 
                  onChange={e => setNewLead({ ...newLead, priority: e.target.value })}>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 border-b pb-2 mb-3">Informações de Contato</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={newLead.contact?.name || ""} 
                    onChange={e => setNewLead({ ...newLead, contact: { ...newLead.contact, name: e.target.value } })} 
                    placeholder="Nome completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={newLead.contact?.email || ""} 
                    onChange={e => setNewLead({ ...newLead, contact: { ...newLead.contact, email: e.target.value } })} 
                    placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    value={newLead.contact?.phone || ""} 
                    onChange={e => setNewLead({ ...newLead, contact: { ...newLead.contact, phone: e.target.value } })} 
                    placeholder="(00) 00000-0000" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 border-b pb-2 mb-3">Detalhes Financeiros</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado (R$)</label>
                  <input className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    type="number"
                    min="0"
                    value={newLead.value} 
                    onChange={e => setNewLead({ ...newLead, value: parseFloat(e.target.value) || 0 })} 
                    placeholder="0,00" />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea 
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]" 
                value={newLead.description} 
                onChange={e => setNewLead({ ...newLead, description: e.target.value })} 
                placeholder="Adicione informações relevantes sobre este lead..." />
            </div>
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                onClick={() => setShowCreate(false)}>
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                onClick={handleCreate}>
                Criar Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
