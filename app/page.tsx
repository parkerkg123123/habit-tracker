'use client';
import { useState, useEffect } from "react";
import { Habit } from "./data/habit";


export default function Home() {

  const date = new Date().getDate();

  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  let completedHabits = habits.filter((habit) => habit.completed === true);

  useEffect(() => {
    const savedHabits = localStorage.getItem("Habits");

    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);

      const updatedHabits = parsedHabits.map((habit: Habit) => {
        if (habit.date !== date) {
          return { ...habit, completed: false, date };
        }

        return habit;
      });

      setHabits(updatedHabits);
    }
  }, []);

  useEffect(() => {
    const stringedHabits = JSON.stringify(habits);
    localStorage.setItem("Habits", stringedHabits);
  }, [habits]);

  function SetComplete(CompletedHabit: Habit) {
    setHabits(prev =>
      prev.map(habit =>
        habit.id === CompletedHabit.id
          ? { ...habit, completed: true, date }
          : habit
      )
    );
  }
  
  function Uncomplete(SelectedHabit: Habit) {
    SelectedHabit.completed = false;
    setHabits((prev) => [...prev]);
  }

  function DeleteHabit(DeletedHabit: Habit) {
    setHabits(habits.filter((habit) => habit.id !== DeletedHabit.id));
  }

  function EditHabit(CurrentHabit: Habit) {
    const newName = prompt("New Name: ");

    if (newName !== null) {
      CurrentHabit.name = newName;
      setHabits((prev) => [...prev]);
    }
  }

  function HabitCard({ habit }: { habit: Habit }) {
    return (
      <div id="HabitCard" className={` ... mb-6 break-inside-avoid border-2 rounded-[6px] text-white flex items-start justify-start px-6 py-4 flex-col ${habit.completed ? 'border-[#246d41]' : 'border-[rgb(49,52,66)]'}`} style={{background: habit.completed ? '#141e18' : 'rgb(27, 29, 37)'}}>
          <h1 id="HabitName" className={`text-xl mt-3 break-all`}>{habit.completed ? '✓' : '✗'} {habit.name}</h1>
          <p className="text-[18px] max-h-[48px] ml-23 mt-3" style={{color: habit.completed ? "#6eeb74" : "rgb(190,190,190)"}}>{habit.completed ? 'Completed Today' : 'Not Completed'}</p>
          <div className="flex mt-3 flex-row gap-4 items-center justify-center w-full">
            <button className={`text-[18px] ${habit.completed ? 'bg-red-500' : 'bg-green-500'} w-fit h-fit p-2 rounded-[4px] text-gray-200 cursor-pointer`} onClick={habit.completed ? () => Uncomplete(habit) : () => SetComplete(habit)}>{habit.completed ? "Incomplete" : "Complete"}</button>
            <button className="text-[18px] bg-red-500 w-fit h-fit p-2 rounded-[4px] text-gray-200 cursor-pointer" onClick={() => DeleteHabit(habit)}>Delete</button>
            <button className="text-[18px] bg-gray-300 w-fit h-fit p-2 rounded-[4px] text-black cursor-pointer" onClick={() => EditHabit(habit)}>Edit</button>
          </div>
      </div>
    );
  }

  function AddHabit(HabitData: Habit) {
    setHabits((prevHabits) => [...prevHabits, HabitData]);
  }


  function StartScreen() {
    if (habits.length < 1) {
      return (
        <h1 className="text-4xl w-fit font-bold text-white">Add a habit to get started today!</h1>
      );
    }
  }

  function AddHabitPers() {
    if (habits.length < 1) {
      return (
        <h1 className="text-[10px] w-fit font-bold text-white">*try it out!*</h1>
      );
    }
  }

  function CompletedCounter() {
    const completed = habits.filter(habit => habit.completed).length;
    const total = habits.length;
    const percent = total === 0 ? 0 : (completed / total) * 100;
    return (
      <div className="w-full max-w-2xl">
        <div className="mb-2 flex justify-between text-sm text-slate-300">
          <p>Progress</p>
          <p>{Math.round(percent)}%</p>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-700">
          <div
            className="h-3 rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <main id="Background" className="min-h-screen min-w-screen text-white flex flex-col items-center justify-center align-center px-6  gap-2">
        <div className="flex flex-col items-center min-w-screen mt-12 ml-[10vh] gap-[24px]">
          <h1 id="Title" className="text-6xl font-bold text-[#8CD790]">Habit Tracker</h1>
          <p id="subText" className="text-[16px] font-bold text-[#8CD790] ml-3">Keep track of your daily habits.</p>

        </div>
        <div className="flex flex-row justify-center items-center min-w-screen mt-[40px] ml-[11vh] gap-3">
            <input maxLength={80} onChange={(e) => setHabit(e.target.value)} type="text" className="bg-[#4A6C6F] text-white p-2 rounded-[4px] placeholder-white border-2 border-slate-400" placeholder="Habit Name"/>
            <button className="bg-[#4A6C6F] text-white p-2 px-4 rounded-[4px] placeholder-white border-2 border-slate-400 font-semibold text-[16px]" onClick={() => AddHabit({name: habit, completed: false, id: crypto.randomUUID(), date: new Date().getDate()})}>Add Habit</button>
        </div>
        <div className="flex flex-col items-center justify-center min-w-screen">
            <AddHabitPers/>
        </div>

        <div className="flex flex-col items-center min-w-screen mt-[40px] ml-[10vh] gap-3 text-4xl font-bold text-[rgb(220,220,220)]">
          Habits
          <CompletedCounter/>
            <div className="mt-[48px] columns-1 lg:columns-2 gap-6 w-[40%] items-center max-w-5xl mx-auto">
              {habits
              .map((HabitData, index) => (
                <HabitCard key={HabitData.id} habit={HabitData}/>
              ))}

              
            </div>
            <StartScreen/>
        </div>
    </main>
  );
}
