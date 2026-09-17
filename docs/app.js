const STORAGE = "attendance_v1";

let state =
  JSON.parse(
    localStorage.getItem(STORAGE) || "null"
  ) || {

    students: [],

    marks: {},

    date:
      new Date()
        .toISOString()
        .slice(0, 10),

    lesson: 1

  };


let viewDate =
  new Date(
    state.date + "T12:00:00"
  );

let editing = null;


const months = [
  "січень",
  "лютий",
  "березень",
  "квітень",
  "травень",
  "червень",
  "липень",
  "серпень",
  "вересень",
  "жовтень",
  "листопад",
  "грудень"
];


const pad = n =>
  String(n).padStart(2, "0");


function makeKey(year, month, day) {

  return `${year}-${pad(month + 1)}-${pad(day)}`;

}


function save() {

  localStorage.setItem(
    STORAGE,
    JSON.stringify(state)
  );

}


function render() {

  document.querySelector("#month")
    .textContent =
      months[viewDate.getMonth()]
      + " "
      + viewDate.getFullYear();


  const calendar =
    document.querySelector("#calendar");

  calendar.innerHTML = "";


  const first =
    new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1
    );


  const start =
    (first.getDay() + 6) % 7;


  const days =
    new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0
    ).getDate();


  const previousDays =
    new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      0
    ).getDate();


  for (let i = 0; i < 42; i++) {

    const number =
      i - start + 1;

    let date;


    if (number < 1) {

      date =
        new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() - 1,
          previousDays + number
        );

    }

    else if (number > days) {

      date =
        new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() + 1,
          number - days
        );

    }

    else {

      date =
        new Date(
          viewDate.getFullYear(),
          viewDate.getMonth(),
          number
        );

    }


    const key =
      makeKey(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );


    const button =
      document.createElement("button");


    button.className =
      "day"
      + (
        date.getMonth()
        !== viewDate.getMonth()
          ? " other"
          : ""
      )
      + (
        key === state.date
          ? " selected"
          : ""
      )
      + (
        key ===
        new Date()
          .toISOString()
          .slice(0, 10)
          ? " today"
          : ""
      );


    button.textContent =
      date.getDate();


    button.onclick = () => {

      state.date = key;

      state.lesson = 1;

      viewDate =
        new Date(
          key + "T12:00:00"
        );

      save();

      render();

    };


    calendar.appendChild(button);

  }


  document.querySelector("#selected")
    .textContent =
      new Date(
        state.date + "T12:00:00"
      ).toLocaleDateString(
        "uk-UA",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );


  const lessons =
    document.querySelector("#lessons");

  lessons.innerHTML = "";


  for (let i = 1; i <= 6; i++) {

    const button =
      document.createElement("button");

    button.className =
      "lesson"
      + (
        i === state.lesson
          ? " active"
          : ""
      );

    button.textContent =
      i + " пара";


    button.onclick = () => {

      state.lesson = i;

      save();

      render();

    };


    lessons.appendChild(button);

  }


  renderAttendance();

}


function renderAttendance() {

  const box =
    document.querySelector("#attendance");

  box.innerHTML = "";


  if (!state.students.length) {

    box.innerHTML =
      '<span style="color:#6b7280">Додай студентів, щоб ставити відмітки.</span>';

    return;

  }


  state.students.forEach(
    (student, index) => {

      const row =
        document.createElement("div");

      row.className =
        "student";


      const name =
        document.createElement("span");

      name.textContent =
        (index + 1)
        + ". "
        + student;


      const button =
        document.createElement("button");

      button.className =
        "mark";


      const key =
        `${state.date}|${state.lesson}|${index}`;


      button.textContent =
        state.marks[key] || "—";


      button.onclick = () => {

        editing = key;

        document
          .querySelector("#markModal")
          .classList.remove("hidden");

      };


      row.append(
        name,
        button
      );


      box.appendChild(row);

    }
  );

}


function renderStudents() {

  const list =
    document.querySelector("#list");

  list.innerHTML = "";


  state.students.forEach(
    (student, index) => {

      const row =
        document.createElement("div");

      row.className =
        "person";


      const span =
        document.createElement("span");

      span.textContent =
        (index + 1)
        + ". "
        + student;


      const deleteButton =
        document.createElement("button");

      deleteButton.className =
        "del";

      deleteButton.textContent =
        "Видалити";


      deleteButton.onclick = () => {

        state.students.splice(
          index,
          1
        );

        save();

        renderStudents();

        render();

      };


      row.append(
        span,
        deleteButton
      );


      list.appendChild(row);

    }
  );

}


document.querySelector("#prev")
  .onclick = () => {

    viewDate.setMonth(
      viewDate.getMonth() - 1
    );

    render();

  };


document.querySelector("#next")
  .onclick = () => {

    viewDate.setMonth(
      viewDate.getMonth() + 1
    );

    render();

  };


document.querySelector("#manage")
  .onclick = () => {

    renderStudents();

    document
      .querySelector("#modal")
      .classList.remove("hidden");

  };


document.querySelector("#add")
  .onclick = () => {

    renderStudents();

    document
      .querySelector("#modal")
      .classList.remove("hidden");

    document
      .querySelector("#name")
      .focus();

  };


document.querySelector("#saveStudent")
  .onclick = () => {

    const input =
      document.querySelector("#name");

    const value =
      input.value.trim();


    if (value) {

      state.students.push(value);

      input.value = "";

      save();

      renderStudents();

      render();

    }

  };


document
  .querySelector("#name")
  .addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {

        document
          .querySelector("#saveStudent")
          .click();

      }

    }
  );


document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.onclick = () => {

      button
        .closest(".modal")
        .classList.add("hidden");

    };

  });


document
  .querySelectorAll("[data-mark]")
  .forEach(button => {

    button.onclick = () => {

      if (!editing) return;


      if (button.dataset.mark) {

        state.marks[editing] =
          button.dataset.mark;

      }

      else {

        delete state.marks[editing];

      }


      save();


      document
        .querySelector("#markModal")
        .classList.add("hidden");


      render();

    };

  });


if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator
        .serviceWorker
        .register("sw.js");

    }
  );

}


render();