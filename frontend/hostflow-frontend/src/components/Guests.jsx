import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Mail, Phone, Briefcase, Building2, FileText, Search } from 'lucide-react'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: null,
    phone: '',
    company: null,
    position: null,
    notes: null
  })

  // Mock data baseado no formato de contacts.json
  const mockContacts = [
    {
      "company": null,
      "created_at": "2025-08-26T18:10:25.312169",
      "email": "marcio@example.com",
      "id": 1,
      "name": "Márcio",
      "notes": "Cliente VIP",
      "phone": "5752003168",
      "position": "CEO",
      "updated_at": "2025-08-26T18:10:25.312169"
    },
    {
      "company": "Acme Inc",
      "created_at": "2025-08-26T18:14:25.380912",
      "email": "maria@acme.com",
      "id": 2,
      "name": "Maria Silva",
      "notes": "Contato inicial feito via site",
      "phone": "1198765432",
      "position": "Marketing Director",
      "updated_at": "2025-08-26T18:14:25.380912"
    }
  ]

  useEffect(() => {
    fetchContacts()
  }, [currentPage, searchTerm])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      
      // URL para a API de contatos (quando estiver disponível)
      // const params = new URLSearchParams({
      //   page: currentPage,
      //   per_page: 10,
      //   search: searchTerm
      // })
      
      // const response = await fetch(`https://n8n.srv888692.hstgr.cloud/webhook/Contacts?${params}`)
      // const data = await response.json()
      
      // Por enquanto, usando dados mockados
      // Simulando um pequeno atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filtrando os dados mockados com base no termo de busca
      const filteredContacts = searchTerm 
        ? mockContacts.filter(contact => 
            contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone?.includes(searchTerm) ||
            contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mockContacts
      
      setContacts(filteredContacts)
      setTotalPages(1) // Mock de uma página
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Em um ambiente real, aqui teríamos a chamada para a API
      if (editingContact) {
        // Atualização de contato existente
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === editingContact.id 
              ? { ...contact, ...formData, updated_at: new Date().toISOString() } 
              : contact
          )
        )
      } else {
        // Criação de novo contato
        const newContact = {
          ...formData,
          id: Math.max(0, ...contacts.map(c => c.id)) + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setContacts(prev => [...prev, newContact])
      }
      
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar contato:', error)
      alert('Erro ao salvar contato')
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name || '',
      email: contact.email || null,
      phone: contact.phone || '',
      company: contact.company || null,
      position: contact.position || null,
      notes: contact.notes || null
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        // Em um ambiente real, aqui teríamos a chamada para a API de exclusão
        setContacts(contacts.filter(contact => contact.id !== id))
      } catch (error) {
        console.error('Erro ao excluir contato:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: null,
      phone: '',
      company: null,
      position: null,
      notes: null
    })
    setEditingContact(null)
    setShowForm(false)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
    // In a real implementation, we'd likely debounce this to avoid too many API calls
    fetchContacts()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contatos</h1>
          <p className="text-gray-600">Gerencie sua base de contatos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Contato
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por nome, empresa ou telefone..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingContact ? 'Editar Contato' : 'Novo Contato'}
              </h2>
              <button 
                onClick={resetForm} 
                className="text-gray-500 hover:text-gray-800"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nome do contato"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value || null }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value || null }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nome da empresa"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value || null }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Cargo na empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Observações e notas sobre este contato"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingContact ? 'Atualizar' : 'Criar'} Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  {contact.position && (
                    <span className="text-sm text-gray-600">{contact.position}</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(contact)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition"
                  title="Editar contato"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition"
                  title="Excluir contato"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{contact.email}</span>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{contact.company}</span>
                </div>
              )}
              
              {contact.notes && (
                <div className="flex items-start gap-2 mt-3">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="flex-1">{contact.notes}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              {contact.created_at && (
                <div>
                  Criado em: {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                </div>
              )}
              {contact.updated_at && contact.updated_at !== contact.created_at && (
                <div>
                  Atualizado em: {new Date(contact.updated_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
      )}

      {contacts.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-indigo-200 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum contato encontrado' : 'Nenhum contato cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou limpar o filtro' 
              : 'Sua base de contatos está vazia. Adicione seu primeiro contato agora.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Adicionar Primeiro Contato
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Rename the file to Contacts.jsx when saving
export default Contacts

