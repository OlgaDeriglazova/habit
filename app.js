// Получение элементов DOM
const habitNameInput = document.getElementById('habitName');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');

// Получение данных из localStorage
function getHabits() {
  const habits = JSON.parse(localStorage.getItem('habits')) || [];
  return habits;
}

// Сохранение данных в localStorage
function saveHabits(habits) {
  localStorage.setItem('habits', JSON.stringify(habits));
}

/* Создание чекбоксов. Создает HTML-разметку для чекбоксов.
Функция принимает объект habit
*/
function createCheckboxes(habit) {
  const checkboxes = habit.dailyProgress.map((completed, index) => `
    <label>
      <input type="checkbox" value="${index}" ${completed ? 'checked' : ''} onchange="markDay(${habit.id}, ${index}, this.checked)">
        ${index + 1}
    </label>
  `).join('');

  return checkboxes;
}

// Создание кнопок
function createButtons(habit) {
  return `
    <button 
      class="complete-btn ${habit.completed ? 'completed' : ''}" 
      onclick="completeHabit(${habit.id}, this, '${habit.name}')">
      Complete
    </button>
    <button 
      class="delete-btn" 
      onclick="deleteHabit(${habit.id})">
      Delete
    </button>
  `;
}

// Отображение привычек
function renderHabits() {
  const habits = getHabits();
  habitList.innerHTML = '';
  habits.forEach(habit => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="habit-container">
        <h3>${habit.name}</h3>
        <div class="habit-checkboxes">${createCheckboxes(habit)}</div>
        <div class="habit-button">${createButtons(habit)}</div>
      </div>
    `;
    habitList.appendChild(li);
  });
}

// Отмечаем день для привычки
function markDay(habitId, dayIndex, isChecked) {
  const habits = getHabits();
  const habit = habits.find(h => h.id === habitId);
  habit.dailyProgress[dayIndex] = isChecked;
  saveHabits(habits);
  renderHabits();
}

// Добавление новой привычки
addHabitBtn.addEventListener('click', () => {
  const name = habitNameInput.value.trim();
  if (name) {
    const habits = getHabits();
    const newHabit = {
      id: Date.now(),  // Используем текущее время как уникальный идентификатор
      name,
      dailyProgress: Array(30).fill(false),  // 30 дней с состоянием "не выполнено"
      completed: false,
    };
    habits.push(newHabit);
    saveHabits(habits);
    habitNameInput.value = ''; 
    renderHabits();
  } else {
    alert('Пожалуйста, введите имя привычки');
  }
});

// Удаление привычки
function deleteHabit(id) {
  const habits = getHabits();
  const updatedHabits = habits.filter(h => h.id !== id);
  saveHabits(updatedHabits);
  renderHabits();
}

// Завершение привычки
function completeHabit(habitId, button, habitName) {
  const habits = getHabits();
  const habit = habits.find(h => h.id === habitId);
  habit.completed = true;
  saveHabits(habits);
  button.classList.add('completed');
  button.disabled = true;
  alert(`Поздравляем! Вы завершили привычку: ${habitName}`);
  renderHabits();
}

// Инициализация приложения
renderHabits();
