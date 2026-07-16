const { Router } = require('express');
const prisma = require('./database');

const routes = Router();

// Lista de horários padrão que o estabelecimento atende
const WORK_HOURS = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

// ==========================================
// 👤 ÁREA DO CLIENTE
// ==========================================

// 1. Consultar horários disponíveis para uma data específica
routes.get('/appointments/available', async (req, res) => {
  try {
    const { date } = req.query; // Espera "YYYY-MM-DD"

    if (!date) {
      return res.status(400).json({ error: "A data é obrigatória." });
    }

    // Busca todos os agendamentos ativos (não cancelados) para o dia selecionado
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        date: date,
        status: { not: "Cancelado" }
      },
      select: { time: true }
    });

    const bookedTimes = bookedAppointments.map(app => app.time);

    // Filtra os horários removendo os que já estão ocupados
    const availableHours = WORK_HOURS.filter(hour => !bookedTimes.includes(hour));

    return res.json(availableHours);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar horários disponíveis." });
  }
});

// 2. Criar um agendamento (Cliente agenda serviço)
routes.post('/appointments', async (req, res) => {
  try {
    const { clientName, clientPhone, serviceName, date, time } = req.body;

    // Validação básica dos dados recebidos
    if (!clientName || !clientPhone || !serviceName || !date || !time) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Impede agendamento em horário já ocupado
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date,
        time,
        status: { not: "Cancelado" }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "Este horário já foi preenchido por outro cliente." });
    }

    // Cria o agendamento
    const newAppointment = await prisma.appointment.create({
      data: {
        clientName,
        clientPhone,
        serviceName,
        date,
        time
      }
    });

    return res.status(201).json(newAppointment);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar agendamento." });
  }
});

// ==========================================
// 👨‍💼 ÁREA ADMINISTRATIVA
// ==========================================

// 3. Visualizar todos os agendamentos (com filtro opcional por data)
routes.get('/admin/appointments', async (req, res) => {
  try {
    const { date } = req.query; // Filtro opcional ?date=YYYY-MM-DD

    const filter = {};
    if (date) {
      filter.date = date;
    }

    const appointments = await prisma.appointment.findMany({
      where: filter,
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar agendamentos do admin." });
  }
});

// 4. Alterar status do agendamento (Agendado, Confirmado, Concluído, Cancelado)
routes.patch('/admin/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Agendado', 'Confirmado', 'Concluído', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status }
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar status." });
  }
});

// 5. Excluir agendamento permanentemente
// 4. Deletar um agendamento específico
routes.delete('/admin/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Agendamento excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir agendamento." });
  }
});

module.exports = routes;