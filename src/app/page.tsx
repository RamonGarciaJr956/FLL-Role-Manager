"use client";
import { useState, useEffect } from "react";
import Navbar from "~/components/Navbar";

export default function HomePage() {
  const [timer, setTimer] = useState(3600);
  const [timerValue, setTimerValue] = useState(3600);
  const [isRunning, setIsRunning] = useState(false);
  const [roles] = useState(["Builder", "Programmer", "Project"]);
  const [student, setStudent] = useState<{ name: string; role: string }>({
    name: "",
    role: "Builder"
  });
  const [students, setStudents] = useState<{ name: string; role: string }[]>([]);
  const [playSound, setPlaySound] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    const playVideo = () => {
      if (!playSound)
        return;

      const video = document.querySelector("iframe");
      if (video) {
        video.setAttribute("src", "https://www.youtube.com/embed/9XtUlQULRvA?si=4-7PL8mzM6eiI3SY&amp;controls=0&amp;start=9&amp;autoplay=1");
      }
      setTimeout(() => {
        video?.setAttribute("src", "");
      }, 8000);
    }

    let interval: NodeJS.Timeout;

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRunning(false);
      playVideo();
    }

    return () => clearInterval(interval);
  }, [isRunning, timer, playSound]);

  const startTimer = () => {
    setTimer(timerValue);
    setIsRunning(true);

    if (!firstRun) {
      setStudents(prevStudents =>
        prevStudents.map(student => {
          const currentRoleIndex = roles.indexOf(student.role);
          const nextRoleIndex = (currentRoleIndex + 1) % roles.length;
          return {
            name: student.name,
            role: roles[nextRoleIndex]!
          };
        })
      );
    }

    if (firstRun) {
      setFirstRun(false);
    }
  };

  const addStudent = () => {
    const { name, role } = student;
    if (!name || !role) return;

    setStudents(prevStudents => [...prevStudents, { name, role }]);
    setStudent({ name: "", role: "Builder" });
  }

  return (
    <main className="bg-zinc-900 min-h-screen min-w-screen flex flex-col">
      <Navbar />

      <iframe className="hidden" width="560" height="315" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

      <section className="mt-8 flex flex-col items-center flex-1">
        <ul className="flex flex-row gap-4 text-white items-center">
          <li className="flex flex-col items-center">
            <span className="text-6xl font-bold">{String(Math.floor(timer / 3600)).padStart(2, '0')}</span>
            <span className="text-lg">Hours</span>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-4xl font-semibold">:</span>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-6xl font-bold">{String(Math.floor((timer % 3600) / 60)).padStart(2, '0')}</span>
            <span className="text-lg">Min</span>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-4xl font-semibold">:</span>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-6xl font-bold">{String(timer % 60).padStart(2, '0')}</span>
            <span className="text-lg">Sec</span>
          </li>
        </ul>

        <div className="flex justify-center mt-4">
          <button onClick={startTimer} className="bg-zinc-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-full mr-4">Start</button>
          <button onClick={() => setIsRunning(false)} className="bg-zinc-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-full">Pause</button>
          <input type="number" value={timerValue} onChange={(e) => setTimerValue(Number(e.target.value))} className="bg-zinc-500 text-white font-bold py-2 px-4 rounded-full ml-4" min={0} />
          <div className="flex flex-col items-start">
            <label className="text-white ml-4">Play sound</label>
            <input type="checkbox" checked={playSound} onChange={(e) => setPlaySound(e.target.checked)} className="ml-4" />
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <input onChange={(e) => setStudent({ ...student, name: e.target.value })} value={student.name} type="text" placeholder="Name" className="bg-zinc-500 text-white font-bold py-2 px-4 rounded-full mt-4" />
          <select
            value={student.role}
            onChange={(e) => setStudent({ ...student, role: e.target.value })}
            className="bg-zinc-500 text-white font-bold py-2 px-4 rounded-full mt-4"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button onClick={() => addStudent()} className="bg-zinc-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded-full mt-4">Add</button>
        </div>

        <ul className="w-full flex-1 mt-4 p-4 flex flex-row gap-8">
          {roles.map(role => (
            <li key={role} className="w-1/3 bg-zinc-800/75 p-4 rounded-lg">
              <h2 className="text-white text-xl font-bold">{role}</h2>
              <hr className="my-2" />
              <ul className="mt-4">
                {students.filter(student => student.role === role).map(student => (
                  <li key={student.name} className="text-white flex flex-row justify-between">
                    {student.name}
                    <button onClick={() => { setStudents([...students].filter(s => s.name != student.name)) }} className="text-red-400">Remove</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}