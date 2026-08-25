/**
 * Calendar Component v1.3
 * Lógica matemática para renderizar meses, dias e eventos sem dependências.
 */

import { Modal } from './Modal.js';

export class Calendar {
    constructor(elementSelector) {
        this.container = document.querySelector(elementSelector);
        if (!this.container) return;

        // Estado do Calendário
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        
        // Banco de Dados Local Fake (Na vida real viria de uma API/Banco de Dados)
        // Estrutura: { "2026-08-25": [{ title: "Deploy", time: "14:00", color: "#ff0000" }] }
        this.events = {}; 

        this.init();
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="of-calendar">
                <div class="of-calendar-header">
                    <h3 class="of-calendar-title">${this.getMonthName(this.currentMonth)} ${this.currentYear}</h3>
                    <div class="of-calendar-nav">
                        <button class="of-calendar-btn" id="calPrevBtn" aria-label="Mês anterior">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button class="of-calendar-btn" id="calNextBtn" aria-label="Próximo mês">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>
                <div class="of-calendar-weekdays">
                    <div class="of-calendar-weekday">Dom</div>
                    <div class="of-calendar-weekday">Seg</div>
                    <div class="of-calendar-weekday">Ter</div>
                    <div class="of-calendar-weekday">Qua</div>
                    <div class="of-calendar-weekday">Qui</div>
                    <div class="of-calendar-weekday">Sex</div>
                    <div class="of-calendar-weekday">Sáb</div>
                </div>
                <div class="of-calendar-days" id="calDaysGrid">
                    <!-- Dias serão injetados via JS -->
                </div>
            </div>
        `;

        this.renderDays();
    }

    renderDays() {
        const grid = this.container.querySelector('#calDaysGrid');
        grid.innerHTML = '';

        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

        const today = new Date();
        const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;

        // Renderiza os dias do mês passado (para preencher os espaços em branco no início)
        for (let i = firstDayOfMonth; i > 0; i--) {
            const dayNum = daysInPrevMonth - i + 1;
            grid.appendChild(this.createDayElement(dayNum, true)); // true = isMuted
        }

        // Renderiza os dias do mês atual
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isCurrentMonth && i === today.getDate();
            // Formata a data para a chave do Dicionário (ex: 2026-08-25)
            const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            grid.appendChild(this.createDayElement(i, false, isToday, dateStr));
        }

        // Renderiza os dias do próximo mês para fechar o Grid de 35 ou 42 células
        const totalCellsRendered = firstDayOfMonth + daysInMonth;
        const remainingCells = (Math.ceil(totalCellsRendered / 7) * 7) - totalCellsRendered;
        
        for (let i = 1; i <= remainingCells; i++) {
            grid.appendChild(this.createDayElement(i, true)); // true = isMuted
        }
    }

    createDayElement(dayNumber, isMuted = false, isToday = false, dateStr = null) {
        const div = document.createElement('div');
        div.className = 'of-calendar-day';
        if (isMuted) div.classList.add('is-muted');
        if (isToday) div.classList.add('is-today');
        
        if (dateStr) {
            div.dataset.date = dateStr; // Salva a data real no HTML
        }

        let html = `<span class="of-calendar-date">${dayNumber}</span>`;
        
        // Se temos eventos salvos neste dia, nós os renderizamos!
        if (dateStr && this.events[dateStr]) {
            html += `<div class="of-calendar-events">`;
            
            // Ordena os eventos do dia por horário antes de renderizar
            const sortedEvents = this.events[dateStr].sort((a, b) => a.time.localeCompare(b.time));
            
            sortedEvents.forEach(evt => {
                html += `
                    <div class="of-calendar-event" style="background-color: ${evt.color}" data-id="${evt.id}" data-date="${dateStr}">
                        <span class="of-calendar-event-time">${evt.time}</span> 
                        ${evt.title}
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html += `<div class="of-calendar-events"></div>`; // Div vazia para não quebrar layout flex
        }

        div.innerHTML = html;
        return div;
    }

    attachEvents() {
        // Navegação
        this.container.addEventListener('click', (e) => {
            const prevBtn = e.target.closest('#calPrevBtn');
            const nextBtn = e.target.closest('#calNextBtn');
            const eventBadge = e.target.closest('.of-calendar-event');
            const dayCell = e.target.closest('.of-calendar-day:not(.is-muted)');

            if (prevBtn) {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.render();
            } else if (nextBtn) {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.render();
            } else if (eventBadge) {
                e.stopPropagation(); // Impede de abrir o modal de "Adicionar Evento"
                const dateStr = eventBadge.dataset.date;
                const eventId = eventBadge.dataset.id;
                this.openEditEventModal(dateStr, eventId);
            } else if (dayCell) {
                const dateStr = dayCell.dataset.date; // Ex: 2026-08-25
                this.openAddEventModal(dateStr);
            }
        });
    }

    openAddEventModal(dateStr) {
        // Formata data de YYYY-MM-DD para DD/MM/YYYY só pra ficar bonito no título
        const [y, m, d] = dateStr.split('-');
        const dataBonita = `${d}/${m}/${y}`;

        const modal = new Modal({
            title: `Agendar para ${dataBonita}`,
            size: 'sm',
            content: `
                <div class="of-form-group">
                    <label class="of-label" for="evtTitle">Título do Evento</label>
                    <input type="text" id="evtTitle" class="of-input" placeholder="Ex: Reunião de Marketing">
                </div>
                <div class="of-form-group" style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <label class="of-label" for="evtTime">Horário</label>
                        <input type="time" id="evtTime" class="of-input" value="12:00">
                    </div>
                    <div style="flex: 1;">
                        <label class="of-label" for="evtColor">Cor</label>
                        <!-- Usando o input type="color" nativo do HTML como o usuário pediu! -->
                        <input type="color" id="evtColor" class="of-input" value="#4F46E5" style="padding: 0; height: 42px; cursor: pointer;">
                    </div>
                </div>
            `,
            buttons: [
                {
                    text: 'Cancelar',
                    class: 'of-btn-secondary',
                    onClick: (e, instance) => instance.close()
                },
                {
                    text: 'Salvar Evento',
                    class: 'of-btn-primary',
                    onClick: (e, instance) => {
                        const title = instance.modalElement.querySelector('#evtTitle').value;
                        const time = instance.modalElement.querySelector('#evtTime').value;
                        const color = instance.modalElement.querySelector('#evtColor').value;

                        if (title.trim() === '') return; // Ignora se não tiver título

                        // Se o dia não existe no nosso Banco de Dados falso, cria a array
                        if (!this.events[dateStr]) {
                            this.events[dateStr] = [];
                        }

                        // Adiciona o evento na memória (com ID único)
                        this.events[dateStr].push({ id: Date.now().toString(), title, time, color });

                        // Re-renderiza os dias para exibir o novo evento no grid!
                        this.renderDays();
                        
                        instance.close();
                    }
                }
            ]
        });

        modal.open();
        
        // Focar no título automaticamente
        setTimeout(() => {
            const el = document.getElementById('evtTitle');
            if(el) el.focus();
        }, 50);
    }

    openEditEventModal(dateStr, eventId) {
        const dayEvents = this.events[dateStr] || [];
        const eventIndex = dayEvents.findIndex(e => e.id.toString() === eventId.toString());
        if (eventIndex === -1) return;

        const evt = dayEvents[eventIndex];
        const [y, m, d] = dateStr.split('-');
        const dataBonita = `${d}/${m}/${y}`;

        const modal = new Modal({
            title: `Editar Evento - ${dataBonita}`,
            size: 'sm',
            content: `
                <div class="of-form-group">
                    <label class="of-label" for="editEvtTitle">Título do Evento</label>
                    <input type="text" id="editEvtTitle" class="of-input" value="${evt.title}">
                </div>
                <div class="of-form-group" style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <label class="of-label" for="editEvtTime">Horário</label>
                        <input type="time" id="editEvtTime" class="of-input" value="${evt.time}">
                    </div>
                    <div style="flex: 1;">
                        <label class="of-label" for="editEvtColor">Cor</label>
                        <input type="color" id="editEvtColor" class="of-input" value="${evt.color}" style="padding: 0; height: 42px; cursor: pointer;">
                    </div>
                </div>
            `,
            buttons: [
                {
                    text: 'Excluir',
                    class: 'of-btn-danger',
                    onClick: async (e, instance) => {
                        const confirmar = await Modal.confirm('Deseja realmente excluir este evento?', 'Atenção');
                        if (confirmar) {
                            // Remove do array
                            this.events[dateStr].splice(eventIndex, 1);
                            this.renderDays();
                            instance.close();
                        }
                    }
                },
                {
                    text: 'Salvar',
                    class: 'of-btn-primary',
                    onClick: (e, instance) => {
                        const title = instance.modalElement.querySelector('#editEvtTitle').value;
                        const time = instance.modalElement.querySelector('#editEvtTime').value;
                        const color = instance.modalElement.querySelector('#editEvtColor').value;

                        if (title.trim() === '') return;

                        // Atualiza o evento
                        dayEvents[eventIndex] = { ...evt, title, time, color };
                        this.renderDays();
                        
                        instance.close();
                    }
                }
            ]
        });

        modal.open();
    }

    getMonthName(monthIndex) {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[monthIndex];
    }
}
