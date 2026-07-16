// frontend/src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ScissorsIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.5" y2="15.5" strokeLinecap="round" />
    <line x1="8.5" y1="8.5" x2="20" y2="20" strokeLinecap="round" />
  </svg>
);

const CombIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <line x1="5" y1="8" x2="5" y2="20" strokeLinecap="round" />
    <line x1="9" y1="8" x2="9" y2="18" strokeLinecap="round" />
    <line x1="13" y1="8" x2="13" y2="20" strokeLinecap="round" />
    <line x1="17" y1="8" x2="17" y2="18" strokeLinecap="round" />
  </svg>
);

const BarbicideIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="7" y="9" width="10" height="13" rx="1.5" stroke="#3B82F6" strokeWidth="1.5" />
    <rect x="9" y="5" width="6" height="4" rx="0.5" stroke="#3B82F6" strokeWidth="1.5" />
    <rect x="10" y="2.5" width="4" height="3" rx="0.5" fill="#EF4444" />
    <line x1="7" y1="14" x2="17" y2="14" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
    <line x1="7" y1="17" x2="17" y2="17" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('client');

  // --- ESTADOS DA ÁREA DO CLIENTE ---
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [clientMessage, setClientMessage] = useState({ type: '', text: '' });

  // --- ESTADOS DA ÁREA ADMIN ---
  const [appointments, setAppointments] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminMessage, setAdminMessage] = useState({ type: '', text: '' });

  const services = [
    'Corte de Cabelo Masculino',
    'Barba Completa',
    'Corte & Barba',
    'Sobrancelha',
    'Tratamento Capilar'
  ];

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!date) {
        setAvailableTimes([]);
        return;
      }
      setLoadingTimes(true);
      try {
        const response = await axios.get(`${API_URL}/appointments/available`, {
          params: { date }
        });
        setAvailableTimes(response.data);
      } catch (error) {
        console.error('Erro ao buscar horários:', error);
        setClientMessage({ type: 'error', text: 'Erro ao carregar horários disponíveis.' });
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchAvailableTimes();
  }, [date]);

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setClientMessage({ type: '', text: '' });

    if (!name || !phone || !service || !date || !time) {
      setClientMessage({ type: 'error', text: 'Preencha todos os campos do formulário!' });
      return;
    }

    try {
      await axios.post(`${API_URL}/appointments`, {
        clientName: name,
        clientPhone: phone,
        serviceName: service,
        date,
        time
      });

      setClientMessage({
        type: 'success',
        text: `Agendamento realizado com sucesso para o dia ${date} às ${time}! 🎉`
      });

      setName('');
      setPhone('');
      setService('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao realizar agendamento.';
      setClientMessage({ type: 'error', text: errorMessage });
    }
  };

  // 1º: Declare a função fetchAppointments primeiro!
  const fetchAppointments = useCallback(async () => {
    setLoadingAdmin(true);
    try {
      const response = await axios.get(`${API_URL}/admin/appointments`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAdminMessage({ type: 'error', text: 'Erro ao carregar lista de agendamentos.' });
    } finally {
      setLoadingAdmin(false);
    }
  }, []);

  // 2º: Chame o useEffect logo abaixo dela!
  useEffect(() => {
    if (activeTab === 'admin') {
      queueMicrotask(() => {
        fetchAppointments();
      });
    }
  }, [activeTab, fetchAppointments]);
  const handleUpdateStatus = async (id, status) => {
    try {
      // MUDAMOS PARA .patch E COLOCAMOS O /status NO FINAL DA URL:
      await axios.patch(`${API_URL}/admin/appointments/${id}/status`, { status });

      setAdminMessage({ type: 'success', text: `Agendamento atualizado para "${status}" com sucesso!` });
      fetchAppointments(); // Recarrega a tabela na tela
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setAdminMessage({ type: 'error', text: 'Não foi possível atualizar o status do agendamento.' });
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir definitivamente este agendamento?")) {
      return; // Cancela a exclusão se o usuário clicar em "Cancelar" no aviso do navegador
    }

    try {
      await axios.delete(`${API_URL}/admin/appointments/${id}`);
      setAdminMessage({ type: 'success', text: 'Agendamento excluído com sucesso!' });
      fetchAppointments(); // Recarrega a tabela na tela
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      setAdminMessage({ type: 'error', text: 'Não foi possível excluir o agendamento.' });
    }
  };

  return (
    <div className="min-h-screen bg-devclub-black p-4 md:p-8 relative overflow-hidden">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-devclub-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-devclub-green/5 rounded-full blur-3xl pointer-events-none" />

      {/* Ilustrações decorativas de barbearia */}
      <ScissorsIcon className="fixed top-16 left-10 w-16 h-16 text-devclub-green/10 -rotate-12 pointer-events-none hidden md:block" />
      <CombIcon className="fixed bottom-24 left-16 w-14 h-14 text-devclub-green/10 rotate-6 pointer-events-none hidden md:block" />
      <BarbicideIcon className="fixed top-24 right-16 w-12 h-12 opacity-[0.15] rotate-3 pointer-events-none hidden md:block" />
      <ScissorsIcon className="fixed bottom-16 right-12 w-12 h-12 text-devclub-green/10 rotate-45 pointer-events-none hidden md:block" />

      <div className="relative max-w-4xl mx-auto">

        {/* Logo topo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-devclub-green flex items-center justify-center shadow-neon">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 8L5 12L9 16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 8L19 12L15 16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            Barbearia <span className="text-devclub-green">DEVCLUB</span>
          </span>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-8">
          <div className="bg-devclub-card p-1 rounded-full flex border border-devclub-green/20">
            <button
              onClick={() => setActiveTab('client')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition duration-200 ${activeTab === 'client'
                  ? 'bg-devclub-green text-black shadow-neon'
                  : 'text-gray-400 hover:text-devclub-green'
                }`}
            >
              👤 Área do Cliente
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition duration-200 ${activeTab === 'admin'
                  ? 'bg-devclub-green text-black shadow-neon'
                  : 'text-gray-400 hover:text-devclub-green'
                }`}
            >
              👨‍💼 Área do Administrador
            </button>
          </div>
        </div>

        {/* --- ÁREA DO CLIENTE --- */}
        {activeTab === 'client' && (
          <div className="flex items-center justify-center">
            <div className="bg-devclub-card border border-devclub-green/20 p-8 rounded-2xl shadow-neon-lg w-full max-w-md">
              <h1 className="text-lg font-semibold text-gray-300 mb-6 text-center">
                Agende seu horário
              </h1>

              {clientMessage.text && (
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium border ${clientMessage.type === 'success'
                    ? 'bg-devclub-green/10 text-devclub-green border-devclub-green/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                  {clientMessage.text}
                </div>
              )}

              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    className="w-full bg-devclub-dark border border-gray-700 text-white placeholder-gray-500 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-devclub-green focus:border-devclub-green transition"
                    placeholder="Ex: Aussie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Telefone</label>
                  <input
                    type="tel"
                    className="w-full bg-devclub-dark border border-gray-700 text-white placeholder-gray-500 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-devclub-green focus:border-devclub-green transition"
                    placeholder="Ex: (11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Selecione o Serviço</label>
                  <select
                    className="w-full bg-devclub-dark border border-gray-700 text-white p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-devclub-green focus:border-devclub-green transition"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option value="">Escolha um serviço...</option>
                    {services.map((srv) => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Data do Atendimento</label>
                  <input
                    type="date"
                    className="w-full bg-devclub-dark border border-gray-700 text-white p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-devclub-green focus:border-devclub-green transition [color-scheme:dark]"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                {date && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      Horários Disponíveis:
                    </label>
                    {loadingTimes ? (
                      <p className="text-gray-500 text-sm animate-pulse">Consultando horários...</p>
                    ) : availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={`p-2 text-sm font-medium rounded-lg border transition ${time === t
                                ? 'bg-devclub-green text-black border-devclub-green shadow-neon font-bold'
                                : 'bg-devclub-dark text-gray-300 border-gray-700 hover:border-devclub-green/50'
                              }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-400 text-sm">Nenhum horário disponível para este dia.</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-devclub-green hover:bg-devclub-green-dark text-black font-bold py-3 px-4 rounded-lg transition duration-200 mt-6 shadow-neon hover:shadow-neon-lg"
                >
                  Confirmar Agendamento
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- ÁREA DO ADMINISTRADOR --- */}
        {activeTab === 'admin' && (
          <div className="bg-devclub-card border border-devclub-green/20 p-6 md:p-8 rounded-2xl shadow-neon-lg w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-xl font-bold text-white">
                Painel do Administrador 📊
              </h1>
              <button
                onClick={fetchAppointments}
                className="bg-devclub-dark hover:bg-devclub-green/10 border border-gray-700 hover:border-devclub-green/50 text-gray-300 hover:text-devclub-green font-semibold py-2 px-4 rounded-lg text-sm transition"
              >
                🔄 Atualizar Lista
              </button>
            </div>

            {adminMessage.text && (
              <div className={`p-3 rounded-lg mb-4 text-sm font-medium border ${adminMessage.type === 'success'
                  ? 'bg-devclub-green/10 text-devclub-green border-devclub-green/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                {adminMessage.text}
              </div>
            )}

            {loadingAdmin ? (
              <div className="text-center py-8 text-gray-500 animate-pulse">
                Carregando agendamentos...
              </div>
            ) : appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-devclub-dark border-b border-gray-700 text-gray-400 uppercase font-bold text-xs">
                      <th className="py-3 px-4 rounded-l-lg">Cliente</th>
                      <th className="py-3 px-4">Serviço</th>
                      <th className="py-3 px-4">Data/Hora</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center rounded-r-lg">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {appointments.map((ap) => (
                      <tr key={ap.id} className="hover:bg-devclub-dark/50 transition">
                        <td className="py-4 px-4 font-medium text-white">
                          <div>{ap.clientName}</div>
                          <div className="text-xs text-gray-500">{ap.clientPhone}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{ap.serviceName}</td>
                        <td className="py-4 px-4 text-gray-300">
                          <div>{ap.date}</div>
                          <div className="text-xs font-semibold text-gray-500">{ap.time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${ap.status === 'Confirmado'
                              ? 'bg-devclub-green/10 text-devclub-green border-devclub-green/30'
                              : ap.status === 'Cancelado'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : ap.status === 'Concluído'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                            }`}>
                            {ap.status || 'Agendado'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {ap.status !== 'Confirmado' && (
                              <button
                                onClick={() => handleUpdateStatus(ap.id, 'Confirmado')}
                                className="bg-devclub-green hover:bg-devclub-green-dark text-black font-bold py-1 px-3 rounded-lg text-xs transition"
                              >
                                Confirmar
                              </button>
                            )}
                            {ap.status !== 'Concluído' && (
                              <button
                                onClick={() => handleUpdateStatus(ap.id, 'Concluído')}
                                className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold py-1 px-3 rounded-lg text-xs transition"
                              >
                                Concluir
                              </button>
                            )}
                            {ap.status !== 'Cancelado' && (
                              <button
                                onClick={() => handleUpdateStatus(ap.id, 'Cancelado')}
                                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-1 px-3 rounded-lg text-xs transition"
                              >
                                Cancelar
                              </button>
                            )}
                            <button
                                onClick={() => handleDelete(ap.id)}
                                className="bg-gray-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition"
                                title="Excluir agendamento"
                              >
                                🗑️ Excluir
                              </button>
                            <div className="flex justify-center gap-2">
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Nenhum agendamento encontrado no banco de dados.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;