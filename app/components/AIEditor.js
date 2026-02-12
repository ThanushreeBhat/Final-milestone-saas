"use client";
import { useState, useEffect } from "react";


import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AIEditor() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

 
  const handleAction = async (path) => {
    if (!text) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/ai/${path}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setText(data.result);
    } catch (error) {
      console.error(error);
      alert("AI error occurred");
    }
    setLoading(false);
  };

 
  useEffect(() => {
    if (!text.trim()) return;

    const timer = setTimeout(async () => {
      try {
        await addDoc(collection(db, "notes"), {
          content: text,
          createdAt: new Date(),
        });

        setAutoSaveStatus("Auto saved");
        loadNotes();
      } catch (error) {
        console.error(error);
      }
    }, 2000); 

    return () => clearTimeout(timer);
  }, [text]);

  const loadNotes = async () => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const notesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNotes(notesList);
  };

  useEffect(() => {
    loadNotes();
  }, []);


  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    loadNotes();
  };

  
  const renameNote = async (id) => {
    const newName = prompt("Enter new note name:");

    if (!newName) return;

    await updateDoc(doc(db, "notes", id), {
      content: newName,
    });

    loadNotes();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      
      <div className="w-[300px] bg-white border-r p-4">
        <h2 className="text-lg font-bold mb-4">History</h2>

        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 border mb-2 rounded hover:bg-gray-100"
          >
            <div
              className="cursor-pointer font-medium"
              onClick={() => setText(note.content)}
            >
              {note.content.substring(0, 40)}...
            </div>

            <div className="flex gap-2 mt-2">
            
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

     
      <div className="flex-1 flex flex-col items-center p-6">

        <div className="w-[800px] bg-white rounded-xl shadow-sm border">
          
          <textarea
            className="w-full h-64 p-6 text-lg outline-none"
            placeholder="Type your notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-between px-6 py-4 border-t">
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("summarize")}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Summarize
              </button>

              <button
                onClick={() => handleAction("improve")}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Improve
              </button>

              <button
                onClick={() => handleAction("generate")}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
