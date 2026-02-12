import AIEditor from "./components/AIEditor";
import Checklist from "./components/checklist";
import DailyPlanner from "./components/dailyplanner";

export default function Home() {
  return (
    <>
      <AIEditor />
      <Checklist />
      <DailyPlanner />
    </>
  );
}
