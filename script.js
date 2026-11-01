const input = document.getElementById('cli-input');
const terminalBody = document.getElementById('terminal-body');
const outputContainer = document.querySelector('.terminal-output');

// База данных файлов на сервере
const files = {
    'skills.db': 'STATUS: EXTRACTING HARD_SKILLS...\n- Languages: Python, JS, Dart (Flutter), GDScript\n- Databases: SQL / PostgreSQL (Запросы, Оптимизация, Анализ)\n- DevOps: Git (GitLab/GitHub), Docker (Base), Linux CLI\n- Engines: Godot Engine, Unreal Engine 5',
    'infrastructure.log': 'LOG_START: Morevna Project Server\n[OK] Nginx proxy up and routing\n[OK] PostgreSQL database integration healthy\n[INFO] Checked local environment logs via Linux CLI\n[OK] Audio engine pipeline synchronized successfully.',
    'knowledge_base.md': '## KNOWLEDGE BASE // TECHNICAL WRITING\n- Опыт создания методичек, регламентов и мануалов для технических платформ.\n- Перевод сложных архитектурных решений разработки на язык пошаговых инструкций.\n- Структурирование гайдов по дебагу, настройке ПО и траблшутингу для специалистов и пользователей.',
    'contacts.cfg': 'EMAIL="mykweenn@yandex.ru"\nLOCATION="Gorno-Altaysk / Saratov (Oct 2026)"\nGITHUB="https://mykweenn.github.io"\nSTATUS="Ready for interview"'
};


// Справочник команд
const commands = {
    help: 'Доступные команды:\n  <span class="highlight">help</span>    - Вывести этот список\n  <span class="highlight">ls</span>      - Посмотреть структуру директории\n  <span class="highlight">cat [file]</span> - Прочесть содержимое файла\n  <span class="highlight">clear</span>   - Очистить экран терминала',
    ls: () => Object.keys(files).join('    ')
};

// Блокируем ввод пользователя, пока идет анимация заставки
let isAutotyping = true;
input.disabled = true;

// Логи для начальной авто-загрузки
const bootLogs = [
    "Connecting to root-server.local...",
    "[OK] Established SSH session on port 22",
    "[OK] Linux kernel 6.1.0-sys x86_64 loaded",
    "[OK] Mounted SSD storage drives [C:/] and [D:/]",
    "[OK] Allocated 16GB RAM internal matrix memory",
    "Initializing Erel OS shell environment..."
];

// Функция для эффекта печатающегося текста (Typewriter effect)
function typeText(element, text, speed = 40) {
    return new Promise((resolve) => {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                terminalBody.scrollTop = terminalBody.scrollHeight;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// Главный сценарий аутентичной авто-загрузки
async function runTerminalIntro() {
    // 1. Выводим лог загрузки строчка за строчкой
    for (let log of bootLogs) {
        outputContainer.innerHTML += `<p>${log}</p>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
        await new Promise(r => setTimeout(r, 400));
    }
    
    outputContainer.innerHTML += `<br><p>Type <span class="highlight">help</span> to view available operations.</p><br>`;
    
    // 2. Имитируем, что пользователь думает, и начинает писать команду авто-ввода
    await new Promise(r => setTimeout(r, 800));
    outputContainer.innerHTML += `<p><span class="prompt">erel@root-server:~$</span> <span id="autotype-placeholder"></span></p>`;
    
    const placeholder = document.getElementById('autotype-placeholder');
    await typeText(placeholder, "cat infrastructure.log", 70);
    
    // 3. Выводим результат «выполненной» команды
    await new Promise(r => setTimeout(r, 500));
    // Убираем временный placeholder и переносим в общий лог
    placeholder.parentElement.innerHTML = `<span class="prompt">erel@root-server:~$</span> cat infrastructure.log`;
    outputContainer.innerHTML += `<p class="highlight">${files['infrastructure.log']}</p><br>`;
    
    // 4. Завершаем авто-ввод, передаем управление нанимателю
    isAutotyping = false;
    input.disabled = false;
    input.focus();
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Запуск анимации при загрузке страницы
window.addEventListener('DOMContentLoaded', runTerminalIntro);

// Фокус на инпут при клике по терминалу (только если авто-ввод завершен)
terminalBody.addEventListener('click', () => {
    if (!isAutotyping) input.focus();
});

// Обработка ручного ввода команд
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const rawInput = this.value.trim();
        if (!rawInput) return;
        
        const parts = rawInput.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1];

        outputContainer.innerHTML += `<p><span class="prompt">erel@root-server:~$</span> ${rawInput}</p>`;

        if (cmd === 'clear') {
            outputContainer.innerHTML = '';
        } else if (cmd === 'help') {
            outputContainer.innerHTML += `<p>${commands.help}</p>`;
        } else if (cmd === 'ls') {
            outputContainer.innerHTML += `<p>${commands.ls()}</p>`;
        } else if (cmd === 'cat') {
            if (!arg) {
                outputContainer.innerHTML += `<p style="color: #ef4444;">Ошибка: Укажите имя файла. Пример: cat skills.db</p>`;
            } else if (files[arg]) {
                outputContainer.innerHTML += `<p class="highlight">${files[arg]}</p>`;
            } else {
                outputContainer.innerHTML += `<p>cat: ${arg}: Нет такого файла</p>`;
            }
        } else {
            outputContainer.innerHTML += `<p>bash: ${cmd}: команда не найдена. Введите <span class="highlight">help</span>.</p>`;
        }

        this.value = '';
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});
