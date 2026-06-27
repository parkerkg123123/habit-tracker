'use client';
import { useState, useEffect } from "react";
import { Habit } from "./data/habit";


export default function Home() {

  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  let completedHabits = habits.filter((habit) => habit.completed === true);

  useEffect(() => {
    const savedHabits = localStorage.getItem("Habits")

    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits);
      setHabits(parsedHabits);
    }
  }, []);

  useEffect(() => {
    const stringedHabits = JSON.stringify(habits);
    localStorage.setItem("Habits", stringedHabits);
  }, [habits]);

  function SetComplete(CompletedHabit: Habit) {
    CompletedHabit.completed = true;
    setHabits((prev) => [...prev]);
  }

  function DeleteHabit(DeletedHabit: Habit) {
    setHabits(habits.filter((habit) => habit.id !== DeletedHabit.id));
  }

  function HabitCard({ habit }: { habit: Habit }) {
    return (
      <div className="max-h-[20vh] h-[15vh] w-[30vh] max-w-[35vh] min-w-[20vh] min-h-[12.5vh] ml-[1.5vh] rounded-[6px] bg-[#4A6C6F] text-white flex items-start justify-start px-6 flex-col ">
          <h1 className="text-xl mt-4">{habit.completed ? '✓' : '✗'} {habit.name}</h1>
          <p className="text-[18px] mt-2" style={{color: habit.completed ? "#8CD790" : "red"}}>{habit.completed ? 'Completed Today' : 'Not Completed'}</p>
          <div className="flex mt-3 flex-row gap-4">
            <button className="text-[18px] bg-slate-600 w-fit h-fit p-2 rounded-[4px] text-green-300 cursor-pointer" onClick={() => SetComplete(habit)}>Complete</button>
            <button className="text-[18px] bg-slate-600 w-fit h-fit p-2 rounded-[4px] text-red-300 cursor-pointer" onClick={() => DeleteHabit(habit)}>Delete</button>
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
    completedHabits = habits.filter((habit) => habit.completed === true);
    return (
      <p>{completedHabits.length}/{habits.length} Completed</p>
    );
  }

  return (
    <main className="min-h-screen bg-[#D7FFF1] text-white flex items-start justify-start px-6 flex-col gap-2">
        <div className="flex flex-col items-start min-w-screen mt-12 ml-[10vh] gap-3">
          <h1 id="Title" className="text-6xl font-bold text-[#8CD790]">Habit Tracker</h1>
          <p className="text-[16px] font-bold text-[#8CD790] ml-3">Keep track of your daily habits.</p>

        </div>
        <div className="flex flex-col items-start min-w-screen mt-6 ml-[11vh] gap-3">
            <input onChange={(e) => setHabit(e.target.value)} type="text" className="bg-[#4A6C6F] text-white p-2 rounded-[4px] placeholder-white border-2 border-slate-400" placeholder="Habit Name"/>
            <div className="flex flex-col items-center gap-1">
              <button className="bg-[#4A6C6F] text-white p-2 px-4 rounded-[4px] placeholder-white border-2 border-slate-400 font-semibold text-[16px]" onClick={() => AddHabit({name: habit, completed: false, id: crypto.randomUUID()})}>Add Habit</button>
              <AddHabitPers/>
            </div>
        </div>

        <div className="flex flex-col items-start min-w-screen mt-6 ml-[10vh] gap-3 text-4xl font-bold text-[rgb(220,220,220)]">
          Habits
          <CompletedCounter/>
            <div className="mt-4 grid grid-cols-3 grid-rows-3 gap-4">
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
