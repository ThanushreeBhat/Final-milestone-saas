"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import ShareModal from "../components/ShareModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [shareOpen, setShareOpen] = useState(false);
  const [pageId, setPageId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadOrCreatePage();
    }
  }, [user, loading]);

  const loadOrCreatePage = async () => {
    const q = query(
      collection(db, "pages"),
      where("ownerId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const docRef = await addDoc(collection(db, "pages"), {
        title: "My First Page",
        ownerId: user.uid,
        members: {
          [user.uid]: "owner",
        },
        createdAt: new Date(),
      });
      setPageId(docRef.id);
    } else {
      setPageId(snapshot.docs[0].id);
    }
  };

  const handleShare = async (email, role) => {
    // 1. Find user by email
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert("User not found");
      return;
    }

    const invitedUserId = snapshot.docs[0].id;

    // 2. Update page members
    const pageRef = doc(db, "pages", pageId);

    await updateDoc(pageRef, {
      [`members.${invitedUserId}`]: role,
    });

    alert(`User added as ${role}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Dashboard</h1>
        <button
          onClick={() => setShareOpen(true)}
          style={{
            border: "1px solid black",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Share
        </button>
      </div>

      <p>Welcome, {user.email}</p>
      <p>Your pages will appear here</p>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onShare={handleShare}
      />
    </div>
  );
}
